import { prisma } from "@/prisma"
import { Prisma, RoleType, UserStatus } from "@prisma/client"

export const getUsers = async ({
  take,
  skip,
  status,
  text,
  role,
}: {
  take?: number
  skip?: number
  status?: string
  text?: string
  role?: string
}) => {
  const filter: Prisma.UserWhereInput = {
    status: status ? (status.toLocaleUpperCase() as UserStatus) : undefined,
    roles: role ? (role.toLocaleUpperCase() as RoleType) : undefined,
    OR: text
      ? [
          {
            name: {
              contains: text ?? "",
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            phone: {
              contains: text ?? "",
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            id: {
              contains: text ?? "",
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ]
      : undefined,
  }

  const users = await prisma.user.findMany({
    where: filter,
    skip,
    take,
    include:{
      _count:{select: {order: true}}
    },
    omit: {
      password: true,
    },
    orderBy: [
      {
        roles: "asc",
      },
      { createdAt: "desc" },
    ],
  })
  const total = await prisma.user.count({
    where: filter,
  })
  return { users, total }
}
