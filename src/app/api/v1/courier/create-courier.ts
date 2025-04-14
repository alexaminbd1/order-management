import { courierType } from "@/lib/schema/courier-schema"
import { prisma } from "@/prisma"
import { CourierStatus } from "@prisma/client"

export const createCourier = async (data: courierType) => {
  return await prisma.courier.create({
    data: {
      ...data,
      status: data.status ? (data.status as CourierStatus) : "PENDING",
    },
  })
}
