import VaultContent from "@/components/vault-content"
import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { getVaultMetadata } from "@/actions/action"
import { SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Lock, ShieldCheck, KeyRound } from "lucide-react"

export const metadata: Metadata = {
  title: "MyPasswords - Home",
  description: "This is the homepage of my password manager",
}

export default async function Home() {
  const user = await currentUser()

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-12">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 text-center space-y-6">
          <div className="glass-card mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-primary" />
            End-to-end encrypted vault
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">My Password Manager</span>
          </h1>
          <p className="text-muted-foreground">Sign in to access your encrypted vault.</p>
          <SignInButton>
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </main>
    )
  }

  const metadata = await getVaultMetadata(user.id)

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-12">
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 mb-12 w-full max-w-5xl text-center">
        <div className="glass-card mx-auto mb-4 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-primary" />
          End-to-end encrypted vault
        </div>
        <h1 className="text-4xl font-bold sm:text-5xl">
          <span className="gradient-text">My Password Manager</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your passwords and cards are encrypted client-side with your master password.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
            <ShieldCheck className="h-3 w-3 text-primary" />
            AES-256 Encryption
          </span>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
            <KeyRound className="h-3 w-3 text-primary" />
            Zero-Knowledge
          </span>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
            <Lock className="h-3 w-3 text-primary" />
            Client-Side Only
          </span>
        </div>
      </div>

      <VaultContent userId={user.id} metadata={metadata} />
    </main>
  )
}