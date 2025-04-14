import { z } from "zod"

export const orderSchema = z.object({
  name: z
    .string({ message: "Customer name must be string value" })
    .min(2, { message: "Customer name must be above 2 character" }),
  phone: z
    .string({ message: "Customer phone number must be string value" })
    .min(10, { message: "Customer phone number must be above 2 character" }),
  address: z
    .string({ message: "Customer address must be string value" })
    .min(3, { message: "Customer address must be above 2 character" }),
  district: z
    .string({ message: "Customer district must be string value" })
    .min(2, { message: "Customer district must be above 2 character" }),
  note: z
    .string({ message: "Note must be string value" })
    .min(2, { message: "Note must be above 2 character" })
    .optional(),
})
export const orderSchemaApi = z.object({
  name: z
    .string({ message: "Customer name must be string value" })
    .min(2, { message: "Customer name must be above 2 character" }),
  phone: z
    .string({ message: "Customer phone number must be string value" })
    .min(10, { message: "Customer phone number must be above 2 character" }),
  address: z
    .string({ message: "Customer address must be string value" })
    .min(3, { message: "Customer address must be above 2 character" }),
  district: z
    .string({ message: "Customer district must be string value" })
    .min(2, { message: "Customer district must be above 2 character" }),
  note: z
    .string({ message: "Note must be string value" })
    .min(2, { message: "Note must be above 2 character" })
    .optional(),
  sellPrice: z.number({ message: "Sell price must be number value" }).positive({
    message: "Sell price must me positive number not negative number",
  }),
  totalPrice: z
    .number({ message: "Total  price must be number value" })
    .positive({
      message: "total price must me positive number not negative number",
    }),
  delivery: z
    .number({ message: "Total  price must be number value" })
    .positive({
      message: "total price must me positive number not negative number",
    })
    .optional(),
  profit: z
    .number({ message: "Total  price must be number value" })
    .positive({
      message: "total price must me positive number not negative number",
    })
    .optional(),

  consignment_id: z.string({ message: "Consignment Id is string " }).optional(),
  tracking_code: z.string({ message: "Consignment Id is string " }).optional(),
  isDelivery: z.boolean().optional(),
  status: z.string({ message: "Order status is string" }).optional(),
  // courier: z.string({ message: "Courier must be string value" }),

  items: z.array(
    z.object({
      quantity: z.number({ message: "Quantity must be number" }).default(1),
      productId: z.number({ message: "Product id must be number" }).positive(),
      price: z.number({ message: "Sell price must be number" }).positive(),
    })
  ),
})

export type orderType = z.infer<typeof orderSchema>
export type orderApiType = z.infer<typeof orderSchemaApi>
