import { userType } from "@/lib/schema/users-schema"
import { prisma,  } from "@/prisma"
import { RoleType, UserStatus,  } from "@prisma/client"
import bcrypt from 'bcryptjs'

export const createUser = async (data: userType) => {
  return await prisma.user.create({
    data: {
      ...data,
      roles: data.roles ? data.roles as RoleType : "USER",
      password: bcrypt.hashSync(data.password, 10),
      currentBalance: 0,
      status: data.status ? data.status as UserStatus : "PENDING",
      totalOrderAmount: 0,
    },
  })
}
