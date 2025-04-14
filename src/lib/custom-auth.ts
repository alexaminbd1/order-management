import { auth } from "@/auth"
import { prisma } from "@/prisma"

export const getUser = async () => {
  const session = await auth()
  return await prisma.user.findUnique({
    where: { id: session?.user?.id },
    omit: {
      password: true,
    },
  })
}

export const isAdmin = async () => {
  const user = await getUser()
  if (user?.roles === "ADMIN" || user?.roles === 'MANAGER') return true
  return false
}
