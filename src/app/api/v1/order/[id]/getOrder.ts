import { prisma } from "@/prisma"

export const getOrder = async ({ id }: { id: number }) => {
  return await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      courier: {
        omit: {
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  })
}
