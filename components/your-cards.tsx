"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CardProps {
  cardNo: string
  expiryDate: string
  cvv: number
}

interface YourCardsProps {
  cards: CardProps[]
  onEdit?: (card: CardProps) => void // optional now
}

export default function YourCards({ cards, onEdit }: YourCardsProps) {
  return (
    <div className="space-y-4 h-48 overflow-y-scroll">
      {cards.length === 0 && "No cards added"}
      {cards.map((card, index) => (
        <Card key={card.cardNo || index}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">
                {card.cvv} {card.cardNo}
              </p>
              <p className="text-sm text-muted-foreground">{card.expiryDate}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit && onEdit(card)} // safe check
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
