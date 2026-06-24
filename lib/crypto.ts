const PBKDF2_ITERATIONS = 100_000
const SALT_LENGTH = 16
const IV_LENGTH = 12

export interface EncryptedPayload {
  v: 1
  iv: string
  data: string
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  return bufferToBase64(salt.buffer)
}

export async function deriveKey(
  masterPassword: string,
  saltBase64: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(base64ToBuffer(saltBase64)),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

export async function encryptData<T>(
  data: T,
  key: CryptoKey
): Promise<EncryptedPayload> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encoded = new TextEncoder().encode(JSON.stringify(data))
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  )

  return {
    v: 1,
    iv: bufferToBase64(iv.buffer),
    data: bufferToBase64(ciphertext),
  }
}

export async function decryptData<T>(
  payload: EncryptedPayload,
  key: CryptoKey
): Promise<T> {
  const iv = new Uint8Array(base64ToBuffer(payload.iv))
  const ciphertext = base64ToBuffer(payload.data)
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  )
  return JSON.parse(new TextDecoder().decode(decrypted)) as T
}

export function serializeEncrypted(payload: EncryptedPayload): string {
  return JSON.stringify(payload)
}

export function parseEncrypted(raw: string): EncryptedPayload | null {
  try {
    const parsed = JSON.parse(raw) as EncryptedPayload
    if (parsed.v === 1 && parsed.iv && parsed.data) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export async function verifyMasterPassword(
  masterPassword: string,
  saltBase64: string,
  encryptedPayload: EncryptedPayload
): Promise<boolean> {
  try {
    const key = await deriveKey(masterPassword, saltBase64)
    await decryptData(encryptedPayload, key)
    return true
  } catch {
    return false
  }
}
