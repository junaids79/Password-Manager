"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVault } from "@/context/vault-context"
import { Lock, ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"

interface VaultUnlockProps {
  needsSetup: boolean
}

export default function VaultUnlock({ needsSetup }: VaultUnlockProps) {
  const { unlock, setupVault } = useVault()
  const [masterPassword, setMasterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!masterPassword) return
    setLoading(true)
    try {
      const success = await unlock(masterPassword)
      if (success) {
        toast.success("Vault unlocked")
        setMasterPassword("")
      } else {
        toast.error("Incorrect master password")
      }
    } catch {
      toast.error("Failed to unlock vault")
    } finally {
      setLoading(false)
    }
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (masterPassword.length < 8) {
      toast.error("Master password must be at least 8 characters")
      return
    }
    if (masterPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      await setupVault(masterPassword)
      toast.success("Vault created and secured")
      setMasterPassword("")
      setConfirmPassword("")
    } catch {
      toast.error("Failed to set up vault")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {needsSetup ? (
              <ShieldCheck className="h-6 w-6 text-primary" />
            ) : (
              <Lock className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle>{needsSetup ? "Create Master Password" : "Unlock Vault"}</CardTitle>
          <CardDescription>
            {needsSetup
              ? "Set a master password to encrypt your vault. This is separate from your sign-in and is never sent to the server."
              : "Enter your master password to decrypt and view your saved data."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={needsSetup ? handleSetup : handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-password">Master Password</Label>
              <Input
                id="master-password"
                type="password"
                placeholder="Enter master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                autoComplete="off"
              />
            </div>
            {needsSetup && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Master Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm master password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : needsSetup ? "Create Vault" : "Unlock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
