import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import Navbar from '@/components/Navbar'
import { Toaster } from "react-hot-toast"
import { Inter } from "next/font/google"
import Footer from "@/components/footer"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} min-h-screen bg-background text-foreground antialiased font-sans`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
              <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
            </div>
            <Navbar />
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}