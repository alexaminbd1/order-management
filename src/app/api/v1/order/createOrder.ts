import { getUser } from "@/lib/custom-auth"
import { orderApiType } from "@/lib/schema/order-schema"
import { prisma } from "@/prisma"
import { OrderStatus } from "@prisma/client"

export const createOrder = async ({ data }: { data: orderApiType }) => {
  const user = await getUser()
  return prisma.order.create({
    data: {
      ...data,
      user: { connect: { id: user?.id } },
      status: data.status
        ? (data.status.toUpperCase() as OrderStatus)
        : "DRAFT",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  })
}
