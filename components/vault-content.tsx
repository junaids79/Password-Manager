"use client"

import type { ReactNode } from "react"
import AddCard from "@/components/add-card"
import AddPassword from "@/components/add-password"
import YourCards from "@/components/your-cards"
import YourPasswords from "@/components/your-passwords"
import PasswordGenerator from "@/components/password-generator"
import VaultUnlock from "@/components/vault-unlock"
import { VaultProvider, useVault } from "@/context/vault-context"
import type { VaultMetadata } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CreditCard, KeyRound, Lock, ShieldCheck } from "lucide-react"

interface VaultContentProps {
  userId: string
  metadata: VaultMetadata
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function VaultDashboard() {
  const { isUnlocked, needsSetup, lock, passwords, cards } = useVault()

  if (!isUnlocked) {
    return <VaultUnlock needsSetup={needsSetup} />
  }

  return (
    <>
      <div className="mb-6 flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Vault unlocked
        </div>
        <Button variant="outline" size="sm" onClick={lock}>
          <Lock className="mr-2 h-4 w-4" />
          Lock Vault
        </Button>
      </div>

      <div className="mb-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={<KeyRound className="h-5 w-5" />} label="Saved Passwords" value={passwords.length} />
        <StatCard icon={<CreditCard className="h-5 w-5" />} label="Saved Cards" value={cards.length} />
      </div>

      <div className="mb-12 flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <div className="w-full rounded-2xl border bg-card p-8 shadow-xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-card-foreground">
            <CreditCard className="h-5 w-5 text-primary" />
            Add Card
          </h2>
          <AddCard />
        </div>
        <div className="w-full rounded-2xl border bg-card p-8 shadow-xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-card-foreground">
            <KeyRound className="h-5 w-5 text-primary" />
            Add Password
          </h2>
          <AddPassword />
        </div>
      </div>

      <div className="mb-12 w-full max-w-4xl">
        <PasswordGenerator />
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <div className="w-full rounded-2xl border bg-card p-6 shadow-xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-card-foreground">
            <CreditCard className="h-5 w-5 text-primary" />
            Your Cards
          </h2>
          <YourCards />
        </div>
        <div className="w-full rounded-2xl border bg-card p-6 shadow-xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-card-foreground">
            <KeyRound className="h-5 w-5 text-primary" />
            Your Passwords
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