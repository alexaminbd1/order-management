import { auth } from "@/auth"
import { isAdmin } from "@/lib/custom-auth"
import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  const session = await auth()

  const url = new URL(await req.url)
  const take = url.searchParams.get("take")
  const to = url.searchParams.get("to")
  const from = url.searchParams.get("from")

  console.log(take, to, from, "session", new Date(from ? from : Date.now()))

  const isUser = await isAdmin()

  const orderStatusCounts = await prisma.order.groupBy({
    where: isUser ? {} : { userId: session?.user?.id, createdAt: {} },
    by: ["status"],
    _count: {
      _all: true,
    },
    _sum: {
      sellPrice: true,
      totalPrice: true,
      profit: true,
    },
    orderBy:{
      status: "desc"
    }
  })

  console.log(orderStatusCounts, "orderStatusCounts")

  // Top selling products
  const topProductsId = await prisma.orderItem.groupBy({
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

  const topProducts = await prisma.product.findMany({
    where: {
      id: { in: topProductsId.map((v) => v.productId) },
    },
  })

  const topUsersId = await prisma.order.groupBy({
    by: ["userId"],
    _count: {
      userId: true,
    },
    orderBy: {
      _count: {
        userId: "desc",
      },
    },
    take: 10,
  })

  const topUsers = await prisma.user.findMany({
    where: {
      id: { in: topUsersId.map((v) => v.userId) },
    },
    include: {
      _count: { select: { order: true } },
    },
    omit: {
      password: true,
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

  // Recent orders
  const recentOrders = await prisma.order.findMany({
    where: isUser ? {} : { userId: session?.user?.id },
    take: 10,
  })

  return NextResponse.json({
    orderStatusCounts,
    topProducts,
    topUsers,
    pendingWithdrawals,
    recentOrders,
  })
}
