import { z } from "zod"

export const courierSchema = z.object({
  name: z
    .string({ message: "Courier name must be string" })
    .min(2, { message: "Courier name must be above 2 character!" }),
  apiKey: z
    .string({ message: "Courier apiKey must be string" })
    .min(2, { message: "Courier apiKey must be above 2 character!" }),
  secretKey: z
    .string({ message: "Courier secretKey must be string" })
    .min(2, { message: "Courier secretKey must be above 2 character!" }),
  status: z.string(),
})
 
export type courierType = z.infer< typeof courierSchema>