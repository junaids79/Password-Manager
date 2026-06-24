"use server"

import { clerkClient } from "@clerk/nextjs/server"
import type { CardEntry, PasswordEntry, VaultMetadata } from "@/lib/types"

function normalizePassword(entry: Record<string, unknown>): PasswordEntry {
  return {
    website: String(entry.website ?? ""),
    username: String(entry.username ?? ""),
    password: String(entry.password ?? ""),
    tags: Array.isArray(entry.tags) ? entry.tags.map(String) : [],
  }
}

function normalizeCard(entry: Record<string, unknown>): CardEntry {
  return {
    cardNo: String(entry.cardNo ?? ""),
    expiry: String(entry.expiry ?? entry.expiryDate ?? ""),
    cvv: Number(entry.cvv ?? 0),
  }
}

export async function getVaultMetadata(userId: string): Promise<VaultMetadata> {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const meta = user.privateMetadata

  const result: VaultMetadata = {}

  if (typeof meta.vaultSalt === "string") {
    result.vaultSalt = meta.vaultSalt
  }
  if (typeof meta.encryptedPasswords === "string") {
    result.encryptedPasswords = meta.encryptedPasswords
  }
  if (typeof meta.encryptedCards === "string") {
    result.encryptedCards = meta.encryptedCards
  }

  if (Array.isArray(meta.passwords) && !meta.encryptedPasswords) {
    result.legacyPasswords = meta.passwords.map((p) =>
      normalizePassword(p as Record<string, unknown>)
    )
  }
  if (Array.isArray(meta.cards) && !meta.encryptedCards) {
    result.legacyCards = meta.cards.map((c) =>
      normalizeCard(c as Record<string, unknown>)
    )
  }

  return result
}

export async function saveVaultData(
  userId: string,
  data: {
    vaultSalt: string
    encryptedPasswords: string
    encryptedCards: string
    clearLegacy?: boolean
  }
) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  const privateMetadata: Record<string, unknown> = {
    ...user.privateMetadata,
    vaultSalt: data.vaultSalt,
    encryptedPasswords: data.encryptedPasswords,
    encryptedCards: data.encryptedCards,
  }

  if (data.clearLegacy) {
    delete privateMetadata.passwords
    delete privateMetadata.cards
  }

  await client.users.updateUserMetadata(userId, { privateMetadata })
}

export async function addCardServer(
  cardNo: string,
  expiry: string,
  cvv: number,
  userId: string
) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const cards: CardEntry[] = Array.isArray(user.privateMetadata.cards)
    ? user.privateMetadata.cards.map((c) =>
        normalizeCard(c as Record<string, unknown>)
      )
    : []
  cards.push({ cardNo, expiry, cvv })

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      cards,
    },
  })
}

export async function updateCardServer(
  userId: string,
  cardIndex: number,
  cardNo: string,
  expiry: string,
  cvv: number
) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  if (!Array.isArray(user.privateMetadata.cards)) {
    return
  }

  const cards = [...user.privateMetadata.cards]
  if (cardIndex < 0 || cardIndex >= cards.length) {
    return
  }

  cards[cardIndex] = { cardNo, expiry, cvv }

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      cards,
    },
  })
}

export async function addPasswordServer(
  website: string,
  username: string,
  password: string,
  userId: string,
  tags: string[] = []
) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const passwords: PasswordEntry[] = Array.isArray(user.privateMetadata.passwords)
    ? user.privateMetadata.passwords.map((p) =>
        normalizePassword(p as Record<string, unknown>)
      )
    : []
  passwords.push({ website, username, password, tags })

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      passwords,
    },
  })
}
