"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addCardServer } from "@/actions/action";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// Define form schema with proper validation
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
    .length(3, { message: "CVV must be exactly 3 digits." })
    .regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits." }),
});

export default function AddCard() {
  const user= useUser()
  const router= useRouter()

  // 1. Define the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    if(user.user){
    addCardServer(values.cardNumber, values.expiryDate, values.cvv , user?.user?.id)
    toast.success("Card Added!")
    form.reset()
    router.refresh()
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
            {/* Card Number Field */}
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

            {/* Expiry Date Field */}
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter expiry date in MM/YY format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CVV Field */}
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Card CVV" {...field} />
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
  );
}
