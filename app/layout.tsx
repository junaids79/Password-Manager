import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

import Navbar from '@/components/Navbar'
import {Toaster} from "react-hot-toast"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background text-foreground antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
                      <Navbar/>
                      <Toaster
  position="top-center"
  reverseOrder={false}
/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}