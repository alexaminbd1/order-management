import { prisma } from "@/prisma"

export const getUserDetails = async ({ id }: { id: string }) => {
  return await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  })
}
