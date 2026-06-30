import zxcvbn from "zxcvbn"
import type { PasswordEntry } from "@/lib/types"

export interface SecurityScoreResult {
  score: number
  weakCount: number
  reusedCount: number
}

export function computeSecurityScore(passwords: PasswordEntry[]): SecurityScoreResult {
  if (passwords.length === 0) {
    return { score: 100, weakCount: 0, reusedCount: 0 }
  }

  const seen = new Map<string, number>()
  let totalStrength = 0
  let weakCount = 0

  for (const entry of passwords) {
    const result = zxcvbn(entry.password)
    totalStrength += result.score
    if (result.score <= 1) weakCount++
    seen.set(entry.password, (seen.get(entry.password) ?? 0) + 1)
  }

  const reusedCount = Array.from(seen.values()).filter((count) => count > 1).length

  const avgStrength = totalStrength / passwords.length
  const strengthScore = (avgStrength / 4) * 100

  const reusedPenalty = (reusedCount / passwords.length) * 30
  const weakPenalty = (weakCount / passwords.length) * 20

  const score = Math.max(
    0,
    Math.min(100, Math.round(strengthScore - reusedPenalty - weakPenalty))
  )

  return { score, weakCount, reusedCount }
}