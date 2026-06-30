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
import { SignInButton, Show, SignUpButton, UserButton } from '@clerk/nextjs'

const Navbar = () => {
    const { setTheme } = useTheme()

  return (
   <nav className='sticky top-0 z-50 flex justify-between items-center px-6 h-16 text-foreground glass-card border-b'>
    <span className='font-bold text-xl gradient-text'>My-Passwords</span>
    <ul className='hidden sm:flex items-center justify-start gap-6 text-sm text-muted-foreground'>
        <li className="hover:text-foreground transition-colors cursor-pointer">Home</li>
        <li className="hover:text-foreground transition-colors cursor-pointer">About us</li>
        <li className="hover:text-foreground transition-colors cursor-pointer">Contact us</li>
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
    
    <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
       
</div>
   </nav>
  )
}

export default Navbar