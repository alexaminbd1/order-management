import { productType } from "@/lib/schema/products-schema"
import { prisma } from "@/prisma"
import { ProductStatus } from "@prisma/client"

export const updateProduct = ({
  id,
  data,
}: {
  id: number
  data: productType
}) => {
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      status: data.status as ProductStatus,
      courier: { connect: { id: Number(data.courier) } },
    },
  })
}
