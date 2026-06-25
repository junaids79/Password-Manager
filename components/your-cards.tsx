"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import PasswordInput from "@/components/password-input"
import { useVault } from "@/context/vault-context"
import toast from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"

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
  const { cards, updateCard } = useVault()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ cardNo: "", expiry: "", cvv: "" })

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

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto">
      {cards.length === 0 && (
        <p className="text-sm text-muted-foreground">No cards saved</p>
      )}
      {cards.map((card, index) => (
        <Card key={card.cardNo || index}>
          <CardContent className="flex items-center justify-between p-4">
            {editingIndex === index ? (
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
                  <Button size="sm" onClick={() => saveEdit(index)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="font-semibold">
                    <MaskedValue value={card.cardNo} />
                  </p>
                  <p className="text-sm text-muted-foreground">{card.expiry}</p>
                  <p className="text-sm text-muted-foreground">
                    CVV: <MaskedValue value={String(card.cvv)} masked />
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEdit(card, index)}>
                  Edit
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
