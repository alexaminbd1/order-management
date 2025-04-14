import { auth } from "@/auth"
import { isAdmin } from "@/lib/custom-auth"
import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

export const GET = async () => {
  const session = await auth()

  // const url = new URL(await request.url)
  // const user = url.searchParams.get("user")

  const isUser = await isAdmin()

  const orderStatusCounts = await prisma.order.groupBy({
    where: isUser ? {} : { userId: session?.user?.id },
    by: ["status"],
    _count: {
      _all: true,
    },
  })

  // Or get individual counts:
  const pendingOrders = await prisma.order.count({
    where: {
      userId: isUser ? {} : session?.user?.id,
      status: "PENDING",
    },
  })

  const deliveryOrders = await prisma.order.count({
    where: { userId: isUser ? {} : session?.user?.id, status: "DELIVERY" },
  })

  const completedOrders = await prisma.order.count({
    where: { userId: isUser ? {} : session?.user?.id, status: "DRAFT" }, // Adjust based on your completed status
  })

  // Top selling products
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  })

  // Total profit (sum of all order profits)
  const totalProfit = await prisma.order.aggregate({
    _sum: {
      profit: true,
    },
  })

  // Pending withdrawals
  const pendingWithdrawals = await prisma.withdrawal.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PENDING",
    },
  })

  // Transaction summary
  const transactionSummary = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: {
      amount: true,
    },
  })

  // Total products
  const totalProducts = await prisma.product.count()

  return NextResponse.json({
    orderStatusCounts,
    pendingOrders,
    deliveryOrders,
    completedOrders,
    totalProducts: totalProducts ? isUser : null,
    topProducts,
    totalProfit,
    pendingWithdrawals,
    transactionSummary,
  })
}
