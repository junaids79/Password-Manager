import AddCard from "@/components/add-card"
import AddPassword from "@/components/add-password"
import YourCards from "@/components/your-cards"
import YourPasswords from "@/components/your-passwords"
import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"

export const metadata: Metadata = {
  title: "MyPasswords - Home",
  description: "This is the homepage of my password manager",
}

export default async function Home() {
  const user = await currentUser()
  console.log(user?.privateMetadata)

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-100">
      {/* Header Section */}
      <div className="w-full max-w-5xl text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">My Password Manager</h1>
      </div>

      {/* Add Details Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 w-full max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add Card</h2>
          <AddCard />
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add Password</h2>
          <AddPassword />
        </div>
      </div>

      {/* Cards & Passwords Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
        {/* Cards Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Cards</h2>
          <YourCards
            cards={Array.isArray(user?.privateMetadata.cards) ? user?.privateMetadata.cards : []}
          />
        </div>

        {/* Passwords Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Passwords</h2>
          <YourPasswords
            passwords={
              Array.isArray(user?.privateMetadata.passwords) ? user?.privateMetadata.passwords : []
            }
          />
        </div>
      </div>
    </main>
  )
}
