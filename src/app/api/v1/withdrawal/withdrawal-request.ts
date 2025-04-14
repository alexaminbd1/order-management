import { prisma } from "@/prisma"
import { WithdrawalStatus } from "@prisma/client"

export const withdrawalRequest = async ({
  take,
  skip,
  status,
  id,
  role,
  user,
}: {
  take?: number
  skip?: number
  status?: string
  text?: string
  id: string
  role: string
  user?: string[]
}) => {
  const filter = {
    user: role == "USER" ? { id: id } : user ? { id: { in: user } } : {},
    status: status ? (status as WithdrawalStatus) : undefined,
  }

  const withdrawal = await prisma.withdrawal.findMany({
    where: filter,
    include: {
      user: { select: { name: true, currentBalance: true, phone: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
    skip,
  })
  const total = await prisma.withdrawal.count({
    where: filter,
    take,
    skip,
  })
  return { total, withdrawal }
}

// if(role === "ADMIN" || role === "MANAGER"){
//   user? { some: { id: { equals : id } } } : {}
// }
//   role === "ADMIN" || role === "MANAGER" ? {
//     user? { some: { id: { equals : id } } } : ''
//   } : { some: { id: { equals : id } } }
