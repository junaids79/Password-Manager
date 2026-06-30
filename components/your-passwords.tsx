"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import PasswordInput from "@/components/password-input"
import CopyButton from "@/components/copy-button"
import { useVault } from "@/context/vault-context"
import type { PasswordEntry } from "@/lib/types"
import Link from "next/link"
import { Eye, EyeOff, Pencil, Trash2, X } from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

function PasswordReveal({ password }: { password: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-muted-foreground font-mono">
        {visible ? password : "********"}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </Button>
    </div>
  )
}

function getInitial(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "")
    return hostname.charAt(0).toUpperCase() || "?"
  } catch {
    return url.charAt(0).toUpperCase() || "?"
  }
}

export default function YourPasswords() {
  const { passwords, allTags, updatePassword, deletePassword } = useVault()
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<PasswordEntry>({
    website: "",
    username: "",
    password: "",
    tags: [],
  })
  const [editTagInput, setEditTagInput] = useState("")

  const filtered = filterTag
    ? passwords.filter((p) => p.tags?.includes(filterTag))
    : passwords

  const startEdit = (entry: PasswordEntry, index: number) => {
    setEditingIndex(index)
    setEditForm({ ...entry, tags: entry.tags ?? [] })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditTagInput("")
  }

  const addEditTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || editForm.tags.includes(trimmed)) return
    setEditForm({ ...editForm, tags: [...editForm.tags, trimmed] })
    setEditTagInput("")
  }

  const removeEditTag = (tag: string) => {
    setEditForm({ ...editForm, tags: editForm.tags.filter((t) => t !== tag) })
  }

  const saveEdit = async (index: number) => {
    try {
      await updatePassword(index, editForm)
      toast.success("Password Updated!")
      cancelEdit()
    } catch {
      toast.error("Failed to update password")
    }
  }

  const handleDelete = async (index: number) => {
    if (!window.confirm("Delete this password? This cannot be undone.")) return
    try {
      await deletePassword(index)
      toast.success("Password deleted")
    } catch {
      toast.error("Failed to delete password")
    }
  }

  return (
    <div className="space-y-4">
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setFilterTag(null)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs transition-colors",
              filterTag === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilterTag(tag)}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs transition-colors",
                filterTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No passwords saved</p>
        )}
        {filtered.map((entry, index) => {
          const realIndex = passwords.indexOf(entry)
          return (
            <Card key={`${entry.website}-${index}`} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-start justify-between gap-3 p-4">
                {editingIndex === realIndex ? (
                  <div className="flex flex-1 flex-col gap-2">
                    <Input
                      placeholder="Website URL"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    />
                    <Input
                      placeholder="Username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    />
                    <PasswordInput
                      placeholder="Password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        value={editTagInput}
                        onChange={(e) => setEditTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addEditTag(editTagInput)
                          }
                        }}
                      />
                      <Button type="button" size="sm" variant="outline" onClick={() => addEditTag(editTagInput)}>
                        Tag
                      </Button>
                    </div>
                    {editForm.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {editForm.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs"
                          >
                            {tag}
                            <button type="button" onClick={() => removeEditTag(tag)}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(realIndex)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitial(entry.website)}
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={entry.website}
                          target="_blank"
                          className="font-semibold text-foreground underline-offset-4 hover:underline"
                        >
                          {entry.website}
                        </Link>
                        <p className="text-sm text-muted-foreground">{entry.username}</p>
                        <PasswordReveal password={entry.password} />
                        {entry.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <CopyButton value={entry.password} label="Password copied!" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(entry, realIndex)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(realIndex)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}