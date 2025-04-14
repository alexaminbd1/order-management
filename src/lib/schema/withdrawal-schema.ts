import { z } from "zod"

export const withdrawalSchema = z.object({
  amount: z
    .number({ message: "Withdrawal Amount must be number" })
    .positive({ message: "Withdrawal Amount must be positive value" }),
  type: z.string({ message: "Withdrawal Payment type must be number" }),
  accountNumber: z
    .string({ message: "Account Number must be string" })
    .optional(),
  comment: z
    .string({ message: "if any comment must be string value" })
    .optional(),
  message: z
    .string({ message: "if any message must be string value" })
    .optional(),
})

export type withdrawalType = z.infer<typeof withdrawalSchema>
