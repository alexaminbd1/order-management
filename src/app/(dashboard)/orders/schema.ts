import { z } from "zod"

export const expenseSchema = z.object({
  id: z.string(),
  label: z.string(),
  note: z.string(),
  category: z.string(),
  type: z.enum(["income", "expense"]),
  amount: z.number(),
  date: z.string(),
})

export type Expense = z.infer<typeof expenseSchema>

export const orderSchema = z.object({
  id: z.number(),
})

type Courier = {
  id: number
  charge: number
  name: string
  apiKey: string
  secretKey: string
}

type User = {
  name: string
  phone: string
}

export type IOrder = {
  id: number
  name: string
  phone: string
  user: User | undefined
  status: string
  courier: Courier | null // Courier can be null
  sellPrice: number
  createdAt: string // ISO 8601 string
}

export type OrderResponse = {
  message: string
  totalOrders: number
  orders: IOrder[]
}

export interface Orders {
  orderId: string // Assuming v.id is a string
  customerName: string // Assuming v.name is a string
  customerPhone: string // Assuming v.phone is a string
  isDelivery: boolean // Assuming v.isDelivery is a boolean
  status: string // Assuming v.status is a string
  userId: string // Assuming v.user.name is a string
  userName: string // Assuming v.user.name is a string
  userPhone: string // Assuming v.user.phone is a string
  courierApi?: string // Assuming v.courier?.apiKey is a string or undefined
  courierSecret?: string // Assuming v.courier?.secretKey is a string or undefined
  courierCharge?: number // Assuming v.courier?.charge is a number or undefined
  courierName?: string // Assuming v.courier?.name is a string or undefined
  courierId?: string // Assuming v.courier?.id is a string or undefined
  sellPrice: number // Assuming v.sellPrice is a number
  createdAt: string // Assuming v.createdAt is a string (ISO format)
}

export type IData = {
  message: string,
  totalOrders : number,
  orders : Orders[]
}