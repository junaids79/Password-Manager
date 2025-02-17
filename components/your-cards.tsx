import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
interface CardProps{
  cardNo: string,
  expiryDate: string,
  cvv:number
}
export default function YourCards({cards}: {cards: CardProps[]}) {
 
  return (
    <div className="space-y-4 h-48 overflow-y-scroll">
     {cards.length=== 0 && "No cards add"}
      {cards.map((card: CardProps) => (
        <Card key={card.cardNo}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">
                {card.cvv}  {card.cardNo}
              </p>
              <p className="text-sm text-muted-foreground">{card.expiryDate}</p>
              <p className="text-sm text-muted-foreground">{card.cvv}</p>
           
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

