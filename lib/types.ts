export interface CardEntry {
  cardNo: string
  expiry: string
  cvv: number
}

export interface PasswordEntry {
  website: string
  username: string
  password: string
  tags: string[]
}

export interface VaultMetadata {
  vaultSalt?: string
  encryptedPasswords?: string
  encryptedCards?: string
  legacyPasswords?: PasswordEntry[]
  legacyCards?: CardEntry[]
}

export interface VaultData {
  passwords: PasswordEntry[]
  cards: CardEntry[]
}
