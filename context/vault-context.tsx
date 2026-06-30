"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { saveVaultData } from "@/actions/action"
import {
  decryptData,
  deriveKey,
  encryptData,
  generateSalt,
  parseEncrypted,
  serializeEncrypted,
  verifyMasterPassword,
} from "@/lib/crypto"
import type {
  CardEntry,
  PasswordEntry,
  VaultData,
  VaultMetadata,
} from "@/lib/types"

interface VaultContextValue {
  isUnlocked: boolean
  isInitialized: boolean
  needsSetup: boolean
  passwords: PasswordEntry[]
  cards: CardEntry[]
  allTags: string[]
  unlock: (masterPassword: string) => Promise<boolean>
  setupVault: (masterPassword: string) => Promise<void>
  lock: () => void
  addPassword: (entry: Omit<PasswordEntry, "tags"> & { tags?: string[] }) => Promise<void>
  updatePassword: (index: number, entry: PasswordEntry) => Promise<void>
  deletePassword: (index: number) => Promise<void>
  addCard: (entry: CardEntry) => Promise<void>
  updateCard: (index: number, entry: CardEntry) => Promise<void>
  deleteCard: (index: number) => Promise<void>
}

const VaultContext = createContext<VaultContextValue | null>(null)

function extractTags(passwords: PasswordEntry[]): string[] {
  const tagSet = new Set<string>()
  for (const p of passwords) {
    for (const tag of p.tags ?? []) {
      if (tag.trim()) tagSet.add(tag.trim())
    }
  }
  return Array.from(tagSet).sort()
}

interface VaultProviderProps {
  userId: string
  metadata: VaultMetadata
  children: ReactNode
}

export function VaultProvider({ userId, metadata, children }: VaultProviderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [cards, setCards] = useState<CardEntry[]>([])
  const keyRef = useRef<CryptoKey | null>(null)
  const saltRef = useRef<string>(metadata.vaultSalt ?? "")

  const isInitialized = Boolean(metadata.vaultSalt && metadata.encryptedPasswords)
  const needsSetup = !metadata.vaultSalt

  const persistVault = useCallback(
    async (data: VaultData) => {
      if (!keyRef.current) throw new Error("Vault is locked")

      if (!saltRef.current) {
        saltRef.current = generateSalt()
      }

      const encPasswords = await encryptData(data.passwords, keyRef.current)
      const encCards = await encryptData(data.cards, keyRef.current)

      await saveVaultData(userId, {
        vaultSalt: saltRef.current,
        encryptedPasswords: serializeEncrypted(encPasswords),
        encryptedCards: serializeEncrypted(encCards),
        clearLegacy: true,
      })
    },
    [userId]
  )

  const unlockWithKey = useCallback(async (key: CryptoKey, salt: string) => {
    keyRef.current = key
    saltRef.current = salt
    let nextPasswords: PasswordEntry[] = []
    let nextCards: CardEntry[] = []

    if (metadata.encryptedPasswords) {
      const payload = parseEncrypted(metadata.encryptedPasswords)
      if (!payload) throw new Error("Invalid encrypted passwords")
      const decryptedPasswords = await decryptData<PasswordEntry[]>(payload, key)
      nextPasswords = decryptedPasswords.map((p) => ({
        ...p,
        tags: p.tags ?? [],
      }))
    } else if (metadata.legacyPasswords) {
      nextPasswords = metadata.legacyPasswords
    }

    if (metadata.encryptedCards) {
      const payload = parseEncrypted(metadata.encryptedCards)
      if (!payload) throw new Error("Invalid encrypted cards")
      nextCards = await decryptData<CardEntry[]>(payload, key)
    } else if (metadata.legacyCards) {
      nextCards = metadata.legacyCards
    }

    const hasLegacy =
      !metadata.encryptedPasswords &&
      !metadata.encryptedCards &&
      ((metadata.legacyPasswords?.length ?? 0) > 0 ||
        (metadata.legacyCards?.length ?? 0) > 0)
    if (hasLegacy && keyRef.current) {
      await persistVault({ passwords: nextPasswords, cards: nextCards })
    }

    setPasswords(nextPasswords)
    setCards(nextCards)
    setIsUnlocked(true)
  }, [metadata, persistVault])

  const unlock = useCallback(
    async (masterPassword: string): Promise<boolean> => {
      const salt = metadata.vaultSalt
      if (!salt) return false

      if (metadata.encryptedPasswords) {
        const payload = parseEncrypted(metadata.encryptedPasswords)
        if (!payload) return false
        const valid = await verifyMasterPassword(masterPassword, salt, payload)
        if (!valid) return false
        const key = await deriveKey(masterPassword, salt)
        await unlockWithKey(key, salt)
        return true
      }

      if (metadata.legacyPasswords || metadata.legacyCards) {
        const key = await deriveKey(masterPassword, salt)
        keyRef.current = key
        saltRef.current = salt
        const data: VaultData = {
          passwords: metadata.legacyPasswords ?? [],
          cards: metadata.legacyCards ?? [],
        }
        await persistVault(data)
        setPasswords(data.passwords)
        setCards(data.cards)
        setIsUnlocked(true)
        return true
      }

      return false
    },
    [metadata, unlockWithKey, persistVault]
  )

  const setupVault = useCallback(
    async (masterPassword: string) => {
      const salt = generateSalt()
      const key = await deriveKey(masterPassword, salt)
      keyRef.current = key
      saltRef.current = salt

      const data: VaultData = {
        passwords: metadata.legacyPasswords ?? [],
        cards: metadata.legacyCards ?? [],
      }
      await persistVault(data)
      setPasswords(data.passwords)
      setCards(data.cards)
      setIsUnlocked(true)
    },
    [metadata, persistVault]
  )

  const lock = useCallback(() => {
    keyRef.current = null
    setPasswords([])
    setCards([])
    setIsUnlocked(false)
  }, [])

  const addPassword = useCallback(
    async (entry: Omit<PasswordEntry, "tags"> & { tags?: string[] }) => {
      const newEntry: PasswordEntry = {
        ...entry,
        tags: entry.tags ?? [],
      }
      const updated = [...passwords, newEntry]
      await persistVault({ passwords: updated, cards })
      setPasswords(updated)
    },
    [passwords, cards, persistVault]
  )

  const updatePassword = useCallback(
    async (index: number, entry: PasswordEntry) => {
      if (index < 0 || index >= passwords.length) {
        throw new Error("Password entry not found")
      }
      const updated = [...passwords]
      updated[index] = entry
      await persistVault({ passwords: updated, cards })
      setPasswords(updated)
    },
    [passwords, cards, persistVault]
  )

  const addCard = useCallback(
    async (entry: CardEntry) => {
      const updated = [...cards, entry]
      await persistVault({ passwords, cards: updated })
      setCards(updated)
    },
    [passwords, cards, persistVault]
  )

  const updateCard = useCallback(
    async (index: number, entry: CardEntry) => {
      if (index < 0 || index >= cards.length) {
        throw new Error("Card entry not found")
      }
      const updated = [...cards]
      updated[index] = entry
      await persistVault({ passwords, cards: updated })
      setCards(updated)
    },
    [passwords, cards, persistVault]
  )

  const deletePassword = useCallback(
    async (index: number) => {
      if (index < 0 || index >= passwords.length) {
        throw new Error("Password entry not found")
      }
      const updated = passwords.filter((_, i) => i !== index)
      await persistVault({ passwords: updated, cards })
      setPasswords(updated)
    },
    [passwords, cards, persistVault]
  )

  const deleteCard = useCallback(
    async (index: number) => {
      if (index < 0 || index >= cards.length) {
        throw new Error("Card entry not found")
      }
      const updated = cards.filter((_, i) => i !== index)
      await persistVault({ passwords, cards: updated })
      setCards(updated)
    },
    [passwords, cards, persistVault]
  )

  const allTags = useMemo(() => extractTags(passwords), [passwords])

  const value = useMemo(
    () => ({
      isUnlocked,
      isInitialized,
      needsSetup,
      passwords,
      cards,
      allTags,
      unlock,
      setupVault,
      lock,
      addPassword,
      updatePassword,
      deletePassword,
      addCard,
      updateCard,
      deleteCard,
    }),
    [
      isUnlocked,
      isInitialized,
      needsSetup,
      passwords,
      cards,
      allTags,
      unlock,
      setupVault,
      lock,
      addPassword,
      updatePassword,
      deletePassword,
      addCard,
      updateCard,
      deleteCard,
    ]
  )

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function useVault() {
  const ctx = useContext(VaultContext)
  if (!ctx) {
    throw new Error("useVault must be used within VaultProvider")
  }
  return ctx
}