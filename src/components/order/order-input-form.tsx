"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { orderSchema, orderType } from "@/lib/schema/order-schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { districts } from "@/lib/districts-list"
import { ICart } from "./order-create"
import axios from "axios"
import { toast } from "react-toastify"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

const getUser = async () => {
  const res = await axios.get("/api/v1/me")
  return res.data
}

interface IUser {
  user: {
    id: string
    name: string
    phone: string
    image: string | null
    paymentType: string | null
    paymentNumber: string | null
    payOutAmount: number
    totalOrderAmount: number
    currentBalance: number
    deliveryCharge: number | null
    status: string
    roles: string
    createdAt: string
    updatedAt: string
  }
}

export default function OrderInputForm({ cart }: { cart: ICart[] }) {
  const router = useRouter()

  const { data } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: getUser,
  })

  const dCharge = data?.user.deliveryCharge ? data?.user.deliveryCharge : 90

  const createOrder = async (data: orderType) => {
    const res = await axios.post("/api/v1/order", {
      ...data,
      sellPrice: totals.totalSell,
      totalPrice: totals.totalPrice,
      profit: totals.totalProfit - dCharge,
      delivery: dCharge,
      items: cart.map(
        (v) =>
          new Object({
            quantity: v.quantity,
            productId: v.id,
            price: v.sell,
          })
      ),
    })
    return res.data
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast("Order create success!", { type: "success" })
      router.push("/create-order")
    },
    onError: (data) => {
      console.log(data, "error print")
      toast("Order Create file")
    },
  })

  const form = useForm<orderType>({
    resolver: zodResolver(orderSchema),
  })
  const totals = cart.reduce(
    (acc, item) => {
      acc.totalPrice += item.price * item.quantity
      acc.totalProfit += item.profit * item.quantity
      acc.totalSell += item.sell
      return acc
    },
    { totalPrice: 0, totalProfit: 0, totalSell: 0 }
  )

  const onSubmit = async (data: orderType) => {
    if (cart.length < 1) {
      return toast("Please add product in crate then create order!", {
        type: "error",
      })
    }
    mutate(data)
  }

  return (
    <div>
      <div className="">
        <div className="flex justify-between items-center">
          <h3>Total Sell : </h3>
          <h3>{totals.totalSell} Tk</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Total Price : </h3>
          <h3>{totals.totalPrice} Tk</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Courier Charge : </h3>
          <h3>{dCharge}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Total Profit : </h3>
          <h3>
            {totals.totalProfit > 1 ? totals.totalProfit - dCharge : 0}
            Tk
          </h3>
        </div>
      </div>
      <h2 className="font-medium my-3">
        Please Provide The customer Information
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Customer full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Customer phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((v, i) => (
                        <SelectItem key={i} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="Customer full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Any Not about this order" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isPending ? (
            <Button type="button" disabled>
              <Loader className="animate-spin" /> Loading...
            </Button>
          ) : (
            <Button className="w-full cursor-pointer">Create Order</Button>
          )}
        </form>
      </Form>
    </div>
  )
}
