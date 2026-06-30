"use client"

import type { ReactNode } from "react"
import { useMemo } from "react"
import AddCard from "@/components/add-card"
import AddPassword from "@/components/add-password"
import YourCards from "@/components/your-cards"
import YourPasswords from "@/components/your-passwords"
import PasswordGenerator from "@/components/password-generator"
import VaultUnlock from "@/components/vault-unlock"
import { VaultProvider, useVault } from "@/context/vault-context"
import type { VaultMetadata } from "@/lib/types"
import { computeSecurityScore } from "@/lib/security-score"
import { Button } from "@/components/ui/button"
import { CreditCard, KeyRound, Lock, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface VaultContentProps {
  userId: string
  metadata: VaultMetadata
}

function StatCard({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: ReactNode
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="glass-card flex items-center gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-primary">
        {icon}
      </div>
      <div>
        <p className={cn("text-2xl font-semibold leading-none", valueClassName)}>{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function VaultDashboard() {
  const { isUnlocked, needsSetup, lock, passwords, cards } = useVault()

  const security = useMemo(() => computeSecurityScore(passwords), [passwords])

  const scoreColor =
    security.score >= 80
      ? "text-green-500"
      : security.score >= 50
      ? "text-yellow-500"
      : "text-red-500"

  if (!isUnlocked) {
    return <VaultUnlock needsSetup={needsSetup} />
  }

  return (
    <>
      <div className="mb-6 flex w-full max-w-6xl items-center justify-between animate-in fade-in-0 slide-in-from-top-2 duration-500">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Vault unlocked
        </div>
        <Button variant="outline" size="sm" onClick={lock}>
          <Lock className="mr-2 h-4 w-4" />
          Lock Vault
        </Button>
      </div>

      <div className="mb-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        <StatCard icon={<KeyRound className="h-5 w-5" />} label={`${passwords.length} Saved`} value={String(passwords.length)} />
        <StatCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label={
            security.reusedCount > 0 || security.weakCount > 0
              ? `${security.weakCount} weak, ${security.reusedCount} reused`
              : "All passwords look strong"
          }
          value={`${security.score}/100`}
          valueClassName={scoreColor}
        />
      </div>

      <div className="mb-12 flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <div className="glass-card w-full rounded-2xl p-8 transition-shadow duration-300 hover:shadow-[0_0_40px_-15px_hsl(258_90%_66%/0.35)]">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="gradient-text">Add Card</span>
          </h2>
          <AddCard />
        </div>
        <div className="glass-card w-full rounded-2xl p-8 transition-shadow duration-300 hover:shadow-[0_0_40px_-15px_hsl(217_91%_60%/0.35)]">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            <KeyRound className="h-5 w-5 text-primary" />
            <span className="gradient-text">Add Password</span>
          </h2>
          <AddPassword />
        </div>
      </div>

      <div className="mb-12 w-full max-w-4xl">
        <PasswordGenerator />
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <div className="glass-card w-full rounded-2xl p-6">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="gradient-text">Your Cards</span>
          </h2>
          <YourCards />
        </div>
        <div className="glass-card w-full rounded-2xl p-6">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            <KeyRound className="h-5 w-5 text-primary" />
            <span className="gradient-text">Your Passwords</span>
          </h2>
          <YourPasswords />
        </div>
      </div>
    </>
  )
}

export default function VaultContent({ userId, metadata }: VaultContentProps) {
  return (
    <VaultProvider userId={userId} metadata={metadata}>
      <VaultDashboard />
    </VaultProvider>
  )
}