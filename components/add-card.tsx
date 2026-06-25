"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { useVault } from "@/context/vault-context"
import toast from "react-hot-toast"

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "Card number must be at least 16 digits." })
    .max(19, { message: "Card number cannot exceed 19 digits." })
    .regex(/^\d+$/, { message: "Card number must contain only digits." }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Expiry date must be in MM/YY format.",
    }),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits." }),
})

export default function AddCard() {
  const { addCard } = useVault()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addCard({
        cardNo: values.cardNumber,
        expiry: values.expiryDate,
        cvv: parseInt(values.cvv, 10),
      })
      toast.success("Card Added!")
      form.reset()
    } catch {
      toast.error("Failed to add card")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Card Number" {...field} />
                  </FormControl>
                  <FormDescription>This is your Card Number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" {...field} />
                  </FormControl>
                  <FormDescription>Enter expiry date in MM/YY format.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Your Card CVV" {...field} />
                  </FormControl>
                  <FormDescription>3-digit or 4-digit CVV.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
