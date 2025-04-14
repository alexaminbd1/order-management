import { prisma } from "@/prisma"

export const getUserDetails = async ({ id }: { id: string }) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
    include: {
      order: true,
      ticket: true,
      withdrawal: true,
    },
  })
  const totalOrder = user?.order.length
  const totalPending = user?.order.filter((v) => v.status == "PENDING").length
  const totalCancel = user?.order.filter((v) => v.status == "CANCEL").length
  const totalDelivery = user?.order.filter((v) => v.status == "DELIVERY").length
  const totalDraft = user?.order.filter((v) => v.status == "DRAFT").length

  const userRecent = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
      updatedAt: true,
    },
    include: {
      withdrawal: { take: 10, orderBy: { createdAt: "desc" } },
      order: { take: 10, orderBy: { createdAt: "desc" } },
    },
  })

  return {
    orderSummary: {
      totalOrder,
      totalDelivery,
      totalPending,
      totalCancel,
      totalDraft,
    },
    userRecent,
  }
}
