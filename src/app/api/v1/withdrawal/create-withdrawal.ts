import { withdrawalType } from "@/lib/schema/withdrawal-schema"
import { prisma } from "@/prisma"

export const createWithdrawal = async ({
  data,
  id,
}: {
  data: withdrawalType
  id: string
}) => {
  return await prisma.withdrawal.create({
    data: {
      ...data,
      status: "PENDING",
      userId: id,
    },
  })
}

export const paymentDecreasing = async ({
  id,
  amount,
}: {
  id: string
  amount: number
}) => {
  return await prisma.user.update({
    where: { id },
    data: { currentBalance: { decrement: amount } },
  })
}
