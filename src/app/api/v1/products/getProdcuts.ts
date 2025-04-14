import { prisma } from "@/prisma"
import { ProductStatus } from "@prisma/client"

interface Filter {
  status?: ProductStatus;
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" };
    about?: { contains: string; mode: "insensitive" };
  }>;
}

export const getProduct = async ({
  take,
  skip,
  status,
  text,
}: {
  take?: number
  skip?: number
  status?: string
  text?: string
}) => {
  const filter: Filter = {
    
  }
  filter.status = status ? (status as ProductStatus) : undefined
  if (text) {
    filter.OR = [
      { name: { contains: text, mode: "insensitive" } },
      { about: { contains: text, mode: "insensitive" } },
    ]
  }

  const products = await prisma.product.findMany({
    where: filter,
    take,
    skip,
    include:{
      _count:{select: {orders: true}}
    },
    orderBy: { createdAt : 'desc'},
  })
  const total = await prisma.product.count({
    where: filter,
  })
  return { total, products }
}
