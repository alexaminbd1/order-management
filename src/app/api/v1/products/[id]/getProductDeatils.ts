import { prisma } from "@/prisma"

export const getProductDetails = async ({ id }: { id: number }) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  })
}
