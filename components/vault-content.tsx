"use client"

import AddCard from "@/components/add-card"
import AddPassword from "@/components/add-password"
import YourCards from "@/components/your-cards"
import YourPasswords from "@/components/your-passwords"
import PasswordGenerator from "@/components/password-generator"
import VaultUnlock from "@/components/vault-unlock"
import { VaultProvider, useVault } from "@/context/vault-context"
import type { VaultMetadata } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface VaultContentProps {
  userId: string
  metadata: VaultMetadata
}

function VaultDashboard() {
  const { isUnlocked, needsSetup, lock } = useVault()

  if (!isUnlocked) {
    return <VaultUnlock needsSetup={needsSetup} />
  }

  return (
    <>
      <div className="mb-6 flex w-full max-w-6xl justify-end">
        <Button variant="outline" size="sm" onClick={lock}>
          <Lock className="mr-2 h-4 w-4" />
          Lock Vault
        </Button>
      </div>

      <div className="mb-12 flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <div className="w-full rounded-2xl border bg-card p-8 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-semibold text-card-foreground">Add Card</h2>
          <AddCard />
        </div>
        <div className="w-full rounded-2xl border bg-card p-8 shadow-xl">
          <h2 className="mb-6 text-center text-2xl font-semibold text-card-foreground">Add Password</h2>
          <AddPassword />
        </div>
      </div>

      <div className="mb-12 w-full max-w-4xl">
        <PasswordGenerator />
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <div className="w-full rounded-2xl border bg-card p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold text-card-foreground">Your Cards</h2>
          <YourCards />
        </div>
        <div className="w-full rounded-2xl border bg-card p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold text-card-foreground">Your Passwords</h2>
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
