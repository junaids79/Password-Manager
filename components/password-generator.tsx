"use client"

import { useCallback, useMemo, useState } from "react"
import zxcvbn from "zxcvbn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Copy, Check } from "lucide-react"
import PasswordInput from "@/components/password-input"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
]

interface PasswordGeneratorProps {
  onUsePassword?: (password: string) => void
  compact?: boolean
}

function generatePassword(options: {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}): string {
  let charset = ""
  if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz"
  if (options.numbers) charset += "0123456789"
  if (options.symbols) charset += "!@#$%^&*()-_=+[]{}|;:,.<>?"

  if (!charset) charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

  const array = new Uint32Array(options.length)
  crypto.getRandomValues(array)
  return Array.from(array, (n) => charset[n % charset.length]).join("")
}

export default function PasswordGenerator({
  onUsePassword,
  compact = false,
}: PasswordGeneratorProps) {
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [generated, setGenerated] = useState("")
  const [copied, setCopied] = useState(false)

  const regenerate = useCallback(() => {
    setGenerated(
      generatePassword({ length, uppercase, lowercase, numbers, symbols })
    )
  }, [length, uppercase, lowercase, numbers, symbols])

  const strength = useMemo(() => {
    if (!generated) return null
    return zxcvbn(generated)
  }, [generated])

  const handleCopy = async () => {
    if (!generated) return
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const content = (
    <div className="space-y-4">
      <div className="flex gap-2">
        <PasswordInput
          value={generated}
          readOnly
          placeholder="Click Generate"
          className="font-mono"
        />
        <Button type="button" variant="outline" size="icon" onClick={regenerate} title="Generate">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopy}
          disabled={!generated}
          title="Copy"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {strength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i <= strength.score ? STRENGTH_COLORS[strength.score] : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {STRENGTH_LABELS[strength.score]}
            {strength.feedback.warning && ` — ${strength.feedback.warning}`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="gen-length">Length: {length}</Label>
          <Input
            id="gen-length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="cursor-pointer"
          />
        </div>
        {(
          [
            ["uppercase", "Uppercase (A-Z)", uppercase, setUppercase],
            ["lowercase", "Lowercase (a-z)", lowercase, setLowercase],
            ["numbers", "Numbers (0-9)", numbers, setNumbers],
            ["symbols", "Symbols (!@#...)", symbols, setSymbols],
          ] as const
        ).map(([key, label, checked, setter]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setter(e.target.checked)}
              className="rounded border-input"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="button" onClick={regenerate} className="flex-1">
          Generate
        </Button>
        {onUsePassword && (
          <Button
            type="button"
            variant="secondary"
            disabled={!generated}
            onClick={() => onUsePassword(generated)}
          >
            Use Password
          </Button>
        )}
      </div>
    </div>
  )

  if (compact) return content

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Password Generator</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
