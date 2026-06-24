import VaultContent from "@/components/vault-content"
import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { getVaultMetadata } from "@/actions/action"
import { SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "MyPasswords - Home",
  description: "This is the homepage of my password manager",
}

export default async function Home() {
  const user = await currentUser()

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">My Password Manager</h1>
          <p className="text-muted-foreground">Sign in to access your encrypted vault.</p>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </main>
    )
  }

  const metadata = await getVaultMetadata(user.id)

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-12">
      <div className="mb-12 w-full max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-foreground">My Password Manager</h1>
        <p className="mt-2 text-muted-foreground">
          Your passwords and cards are encrypted client-side with your master password.
        </p>
      </div>

      <VaultContent userId={user.id} metadata={metadata} />
    </main>
  )
}
