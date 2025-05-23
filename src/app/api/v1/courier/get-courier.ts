import { prisma } from "@/prisma"

type CourierFilter = {
  OR?: Array<
    | { name: { contains: string; mode: "insensitive" } }
    | { apiKey: { contains: string; mode: "insensitive" } }
    | { secretKey: { contains: string; mode: "insensitive" } }
  >
}

export const getCourier = async ({
  take,
  skip,
  text,
}: {
  take?: number
  skip?: number
  status?: string
  text?: string
}) => {
  const filter: CourierFilter = {}
  if (text) {
    filter.OR = [
      { name: { contains: text, mode: "insensitive" } },
      { apiKey: { contains: text, mode: "insensitive" } },
      { secretKey: { contains: text, mode: "insensitive" } },
    ]
  }

  const courier = await prisma.courier.findMany({
    where: filter,
    skip,
    take,
    include: {
      _count: { select: { products: true } },
    },
  })
  const total = await prisma.courier.count({
    where: filter,
    take,
    skip,
  })
  return { courier, total }
}
