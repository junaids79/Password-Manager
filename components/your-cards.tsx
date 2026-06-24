"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { updateCardServer } from "@/actions/action"
import { useUser } from "@clerk/nextjs"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface CardProps {
  cardNo: string
  expiry?: string
  expiryDate?: string
  cvv: number
}

interface YourCardsProps {
  cards: CardProps[]
}

export default function YourCards({ cards }: YourCardsProps) {
  const user = useUser()
  const router = useRouter()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ cardNo: "", expiry: "", cvv: "" })

  const startEdit = (card: CardProps, index: number) => {
    setEditingIndex(index)
    setEditForm({
      cardNo: card.cardNo,
      expiry: card.expiry ?? card.expiryDate ?? "",
      cvv: String(card.cvv),
    })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditForm({ cardNo: "", expiry: "", cvv: "" })
  }

  const saveEdit = async (index: number) => {
    if (!user.user) return

    const cvv = parseInt(editForm.cvv, 10)
    if (!editForm.cardNo || !editForm.expiry || Number.isNaN(cvv)) {
      toast.error("Please fill in all fields correctly")
      return
    }

    await updateCardServer(user.user.id, index, editForm.cardNo, editForm.expiry, cvv)
    toast.success("Card Updated!")
    cancelEdit()
    router.refresh()
  }

  return (
    <div className="space-y-4 h-48 overflow-y-scroll">
      {cards.length === 0 && "No cards added"}
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
                <Input
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
                <div>
                  <p className="font-semibold">
                    {card.cvv} {card.cardNo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {card.expiry ?? card.expiryDate}
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
