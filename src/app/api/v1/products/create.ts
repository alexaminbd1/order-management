import { productType } from "@/lib/schema/products-schema"
import { prisma } from "@/prisma"
import { ProductStatus } from "@prisma/client"

export const createProduct = async ({
  data,
  id,
}: {
  data: productType
  id: string
}) => {
  console.log(data, "PRODUCT DATA")
  return await prisma.product.create({
    data: {
      ...data,
      status: data.status ? (data.status as ProductStatus) : "DRAFT",
      courier: { connect: { id: Number(data.courier) } },
      user: {
        connect: { id },
      },
    },
  })
}
