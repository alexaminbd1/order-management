import { isAdmin } from "@/lib/custom-auth"
import { prisma } from "@/prisma"
import { OrderStatus, Prisma } from "@prisma/client"

export const getOrders = async ({
  take,
  skip,
  status,
  text,
  user,
  userId,
  form,
  to,
}: {
  take?: number
  skip?: number
  status?: string
  text?: string
  userId?: string
  user: string
  form?: string
  to?: string
}) => {
  console.log(form, to, "Log ----")
  const isResult = await isAdmin()
  const filter: Prisma.OrderWhereInput = {}
  if (userId && isResult) {
    filter.userId = { in: userId.split(",") }
  } else {
    filter.userId = isResult ? undefined : user
  }
  filter.status = status
    ? (status.toLocaleUpperCase() as OrderStatus)
    : undefined
  filter.OR = [
    { id: text && Number(text) > 0 ? Number(text) : undefined },
    { name: { contains: text, mode: "insensitive" } },
    { phone: { contains: text, mode: "insensitive" } },
    { consignment_id: { contains: text, mode: "insensitive" } },
    { tracking_code: { contains: text, mode: "insensitive" } },
  ]
  // filter.createdAt = {
  //   gte: new Date(form as string),
  //   lte: new Date(to as string),
  // }

  const order = await prisma.order.findMany({
    where: filter,
    select: {
      id: true,
      name: true,
      phone: true,
      user: {
        omit: { password: true },
      },
      isDelivery: true,
      status: true,
      courier: {
        omit: {
          updatedAt: true,
          createdAt: true,
          status: true,
        },
      },
      sellPrice: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
    skip,
  })
  const totalOrders = await prisma.order.count({
    where: filter,
  })

  const orders = await order.map((v) => {
    return {
      orderId: v.id,
      customerName: v.name,
      customerPhone: v.phone,
      isDelivery: v.isDelivery,
      status: v.status,
      userId: v.user.id,
      userName: v.user.name,
      userPhone: v.user.phone,
      courierApi: v.courier?.apiKey,
      courierSecret: v.courier?.secretKey,
      courierCharge: v.courier?.charge,
      courierName: v.courier?.name,
      courierId: v.courier?.id,
      sellPrice: v.sellPrice,
      createdAt: v.createdAt,
    }
  })
  return { totalOrders, orders }
}

// p6 + g5U54jJ1_
// bemvuc@travelmadeease.com
// ujjal@travelmadeease.com
