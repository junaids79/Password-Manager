"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PasswordInput from "@/components/password-input"
import { useVault } from "@/context/vault-context"
import toast from "react-hot-toast"
import { X } from "lucide-react"

export const formSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, underscores, and dashes",
    }),
  website: z
    .string({ required_error: "Website is required" })
    .url({ message: "Please enter a valid URL" })
    .startsWith("https://", { message: "URL must start with https://" })
    .or(z.string().startsWith("http://", { message: "URL must start with http://" })),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
  tags: z.array(z.string()).default([]),
})

export type UserFormData = z.infer<typeof formSchema>

export default function AddPassword() {
  const { addPassword, allTags } = useVault()
  const [tagInput, setTagInput] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
      tags: [],
    },
  })

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || selectedTags.includes(trimmed)) return
    const updated = [...selectedTags, trimmed]
    setSelectedTags(updated)
    form.setValue("tags", updated)
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    const updated = selectedTags.filter((t) => t !== tag)
    setSelectedTags(updated)
    form.setValue("tags", updated)
  }

  async function onSubmit(values: UserFormData) {
    try {
      await addPassword({
        website: values.website,
        username: values.username,
        password: values.password,
        tags: values.tags,
      })
      toast.success("Password Added!")
      form.reset()
      setSelectedTags([])
    } catch {
      toast.error("Failed to add password")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>Your website URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag (e.g. Work)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(tagInput)
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
                  Add
                </Button>
              </div>
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {allTags
                    .filter((t) => !selectedTags.includes(t))
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground hover:bg-secondary/80"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              )}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}