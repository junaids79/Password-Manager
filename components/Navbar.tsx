"use client"

import React from 'react'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignInButton } from '@clerk/nextjs'
import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/clerk-react'



const Navbar = () => {
    const { setTheme } = useTheme()

  return (
   <nav className='flex justify-between items-center px-4 h-16 text-foreground bg-card border-b border-border'>
    <span className='font-bold text-xl'>My-Passwords</span>
    <ul className='flex items-center justify-start gap-5 text-muted-foreground'>
        <li className="hover:text-foreground transition-colors">Home</li>
        <li className="hover:text-foreground transition-colors">About us</li>
        <li className="hover:text-foreground transition-colors">Contact us</li>
    </ul>
    <div className='flex gap-2 justify-center items-center'>
        
  
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
    <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
       
</div>
   </nav>
  )
}

export default Navbar
