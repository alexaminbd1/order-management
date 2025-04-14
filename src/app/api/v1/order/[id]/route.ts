import { isAdmin } from "@/lib/custom-auth"
import { NextResponse } from "next/server"
import { getOrder } from "./getOrder"
import { prisma } from "@/prisma"
import { OrderStatus } from "@prisma/client"
import axios from "axios"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    if (!id)
      return NextResponse.json(
        { error: "Id is required for getting order details" },
        { status: 401 }
      )
    const res = await getOrder({ id: Number(id) })
    if (!res)
      return NextResponse.json(
        { error: "No order found by your id" },
        { status: 401 }
      )
    return NextResponse.json({ orderDetails: res })
  } catch {
    return NextResponse.json(
      { error: "Something error is found or product details not found" },
      { status: 501 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isA = await isAdmin()
  if (!isA)
    return NextResponse.json(
      { error: "Only Admin can update order status!" },
      { status: 401 }
    )
  const typeList = ["DELIVERY", "CANCEL", "SEND"]
  const url = new URL(await request.url)
  const type = url.searchParams.get("type")
  const courier = url.searchParams.get("courier")

  const { id } = await params

  if (!typeList.includes(type ? type.toUpperCase() : ""))
    return NextResponse.json(
      { error: "Id and type is required for update order details" },
      { status: 401 }
    )
  try {
    const order = await prisma.order.findUnique({ where: { id: Number(id) } })
    if (!order)
      return NextResponse.json(
        { error: "Order Details is not found by user id" },
        { status: 401 }
      )
    if (
      type?.toUpperCase() === "CANCEL" ||
      type?.toUpperCase() === "DELIVERY"
    ) {
      if (order.status !== "PENDING")
        return NextResponse.json(
          {
            error:
              "Only PENDING order can update there status DELIVERY or CANCEL!",
          },
          { status: 401 }
        )
      const update = await prisma.order.update({
        where: { id: Number(id) },
        data: {
          status: type.toUpperCase() as OrderStatus,
        },
      })
      const updateUser = await prisma.user.update({
        where: { id: order.userId },
        data: {
          currentBalance:
            type.toUpperCase() === "DELIVERY"
              ? { increment: order.profit }
              : type.toUpperCase() === "CANCEL"
              ? { decrement: order.delivery }
              : {},
        },
      })

      if (!update && !updateUser)
        return NextResponse.json(
          { error: "Order and user update fail!" },
          { status: 401 }
        )
      return NextResponse.json({
        message: "Order and user data update success!",
      })
    }

    if (type?.toUpperCase() === "SEND" && Number(courier) > 0) {
      const getCourierApi = await prisma.courier.findUnique({
        where: { id: Number(courier) },
      })
      if (!getCourierApi)
        return NextResponse.json(
          { error: "Invalid courier id!" },
          { status: 401 }
        )
      const sendCourier = await axios.post(
        "https://portal.packzy.com/api/v1/create_order",
        {
          invoice: `OM-${order.id}`,
          recipient_name: order.name,
          recipient_phone: order.phone,
          recipient_address: order.address,
          cod_amount: order.sellPrice,
        },
        {
          headers: {
            "Api-Key": getCourierApi?.apiKey,
            "Secret-Key": getCourierApi?.secretKey,
          },
        }
      )
      const updateOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          consignment_id:
            sendCourier.data.consignment.consignment_id.toString(),
          tracking_code: sendCourier.data.consignment.tracking_code,
          isDelivery: true,
          status: "PENDING",
          courierId: getCourierApi.id,
        },
      })
      if (!updateOrder)
        return NextResponse.json(
          { error: "Order update fail!" },
          { status: 401 }
        )
      return NextResponse.json({
        message: "Data send in courier also oder update success!",
      })
    }
    return NextResponse.json({ error: "Something is missing.....!" })
  } catch {
    return NextResponse.json({ error: "Something is wrong!" }, { status: 401 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    if (!id)
      return NextResponse.json(
        { error: "Id is required for delete order" },
        { status: 401 }
      )
    const res = await prisma.order.delete({ where: { id: Number(id) } })
    if (!res)
      return NextResponse.json({ error: "Order delete fail" }, { status: 401 })
    return NextResponse.json({ message: "Order Delete success!" })
  } catch {
    return NextResponse.json(
      { error: "Something error is found or product details not found" },
      { status: 501 }
    )
  }
}
