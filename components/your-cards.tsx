"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import PasswordInput from "@/components/password-input"
import CopyButton from "@/components/copy-button"
import { useVault } from "@/context/vault-context"
import toast from "react-hot-toast"
import { CreditCard, Eye, EyeOff, Search, Trash2 } from "lucide-react"

function MaskedValue({ value, masked = true }: { value: string; masked?: boolean }) {
  const [visible, setVisible] = useState(false)
  const show = !masked || visible

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm">{show ? value : "****"}</span>
      {masked && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide" : "Show"}
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      )}
    </div>
  )
}

export default function YourCards() {
  const { cards, updateCard, deleteCard } = useVault()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ cardNo: "", expiry: "", cvv: "" })

  const filtered = cards.filter((card) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true
    return (
      card.cardNo.toLowerCase().includes(query) ||
      card.expiry.toLowerCase().includes(query)
    )
  })

  const startEdit = (card: (typeof cards)[0], index: number) => {
    setEditingIndex(index)
    setEditForm({
      cardNo: card.cardNo,
      expiry: card.expiry,
      cvv: String(card.cvv),
    })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditForm({ cardNo: "", expiry: "", cvv: "" })
  }

  const saveEdit = async (index: number) => {
    const cvv = parseInt(editForm.cvv, 10)
    if (!editForm.cardNo || !editForm.expiry || Number.isNaN(cvv)) {
      toast.error("Please fill in all fields correctly")
      return
    }

    try {
      await updateCard(index, {
        cardNo: editForm.cardNo,
        expiry: editForm.expiry,
        cvv,
      })
      toast.success("Card Updated!")
      cancelEdit()
    } catch {
      toast.error("Failed to update card")
    }
  }

  const handleDelete = async (index: number) => {
    if (!window.confirm("Delete this card? This cannot be undone.")) return
    try {
      await deleteCard(index)
      toast.success("Card deleted")
    } catch {
      toast.error("Failed to delete card")
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No cards found</p>
        )}
        {filtered.map((card, index) => {
          const realIndex = cards.indexOf(card)
          return (
            <Card key={card.cardNo || index} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between gap-3 p-4">
                {editingIndex === realIndex ? (
                  <div className="flex flex-1 flex-col gap-2">
                    <Input
                      placeholder="Card Number"
                      value={editForm.cardNo}
                      onChange={(e) => setEditForm({ ...editForm, cardNo: e.target.value })}
                    />
                    <Input
                      placeholder="MM/YY"
                      value={editForm.expiry}
                      onChange={(e) => setEditForm({ ...editForm, expiry: e.target.value })}
                    />
                    <PasswordInput
                      placeholder="CVV"
                      value={editForm.cvv}
                      onChange={(e) => setEditForm({ ...editForm, cvv: e.target.value })}
                    />
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          <MaskedValue value={card.cardNo} />
                        </p>
                        <p className="text-sm text-muted-foreground">{card.expiry}</p>
                        <p className="text-sm text-muted-foreground">
                          CVV: <MaskedValue value={String(card.cvv)} masked />
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <CopyButton value={card.cardNo} label="Card number copied!" />
                      <Button variant="outline" size="sm" onClick={() => startEdit(card, realIndex)}>
                        Edit
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