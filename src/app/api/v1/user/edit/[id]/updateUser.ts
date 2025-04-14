import { updateUserType } from "@/lib/schema/users-schema"
import { prisma } from "@/prisma"
import { RoleType, UserStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

export const updateUser = async ({
  userId,
  data,
}: {
  userId: string
  data: updateUserType
}) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...data,
      status: data.status as UserStatus,
      password: data.password ? bcrypt.hashSync(data.password, 10) : undefined,
      roles: data.roles as RoleType,
    },
  })
}
