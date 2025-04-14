import { prisma } from "@/prisma"

export const deleteProduct = async ({ id }: { id: number }) => {
  return await prisma.product.delete({ where: { id: id } })
}
