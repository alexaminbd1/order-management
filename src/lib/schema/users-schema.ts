import { z } from "zod"

export const userSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be above 2 character" }),
  phone: z
    .string({ message: "Must be provide valid number" })
    .min(10, { message: "Must be provide 11 digit number" }),
  image: z.string().url({ message: "Image must be URL" }).optional(),
  password: z
    .string({ message: "Must be provide strong password" })
    .min(6, { message: "Password must be above 6 character!" }),
  paymentType: z.string({ message: "Payment type is string" }).optional(),
  paymentNumber: z.string().optional(),
  payOutAmount: z
    .number({ message: "Cash out amount must be number" })
    .positive({ message: "Please provide valid amount for cash out!" })
    .optional(),
  deliveryCharge: z
    .number({ message: "Delivery charge must be number" })
    // .positive({ message: "Please provide valid delivery charge amount!" })
    .optional(),
  status: z.string(),
  roles: z.string(),
})
export const updateUserSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be above 2 character" }),
  phone: z
    .string({ message: "Must be provide valid number" })
    .min(10, { message: "Must be provide 11 digit number" }),
  image: z.string().url({ message: "Image must be URL" }).optional(),
  password: z
    .string({ message: "Must be provide strong password" })
    .min(6, { message: "Password must be above 6 character!" })
    .optional(),
  paymentType: z.string({ message: "Payment type is string" }).optional(),
  paymentNumber: z.string().optional(),
  payOutAmount: z
    .number({ message: "Cash out amount must be number" })
    .positive({ message: "Please provide valid amount for cash out!" })
    .optional(),
  deliveryCharge: z
    .number({ message: "Delivery charge must be number" })
    // .positive({ message: "Please provide valid delivery charge amount!" })
    .optional(),
  status: z.string(),
  roles: z.string(),
  currentBalance: z.number({ message: "Balance is number" }).min(0, {message: "Minimum balance 0"}),
})

export type userType = z.infer<typeof userSchema>
export type updateUserType = z.infer<typeof updateUserSchema>
