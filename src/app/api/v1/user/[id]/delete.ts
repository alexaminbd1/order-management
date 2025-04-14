import { prisma } from "@/prisma"

export const deleteUser = async ({ id }: { id: string }) => {
  return await prisma.user.delete({ where: { id } })
}
