import { NextRequest, NextResponse } from "next/server"
import { getOrders } from "./getOrders"
import { orderSchemaApi } from "@/lib/schema/order-schema"
import { createOrder } from "./createOrder"
import { getUser } from "@/lib/custom-auth"
// import axios from "axios"
// import { prisma } from "@/prisma"

export async function GET(request: NextRequest) {
  try {
    const exUser = await getUser()
    if (!exUser)
      return NextResponse.json(
        {
          error: "if you want to see order must be need to login first!",
        },
        { status: 409 }
      )

    const url = new URL(await request.url)
    const take = url.searchParams.get("take")
    const skip = url.searchParams.get("skip")
    const status = url.searchParams.get("status")
    const text = url.searchParams.get("text")
    const user = url.searchParams.get("user")
    const from = url.searchParams.get("from")
    const to = url.searchParams.get("to")

    const { orders, totalOrders } = await getOrders({
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : 0,
      status: status ? decodeURI(status as string) : "",
      text: text ? decodeURI(text as string) : "",
      userId: user ? decodeURI(user as string) : "",
      user: exUser.id,
      form: from as string,
      to: to as string,
    })
    return NextResponse.json({
      message: "Success Getting Order",
      totalOrders,
      orders,
    })
  } catch (error) {
    console.log(error, "Getting product error")
    return NextResponse.json({
      error: "Getting error thats way can not get nay orders",
    })
  }
}

export async function POST(request: Request) {
  const isUser = await getUser()
  if (!isUser)
    return NextResponse.json(
      {
        error: "Login is required for create order",
      },
      { status: 401 }
    )
  try {
    // const commingData = await request.json()
    const { success, data , error} = orderSchemaApi.safeParse(await request.json())
    console.log(data, "data", error, "--")
    if (!success)
      return NextResponse.json(
        {
          error: "Required data is missing please provide data!",
        },
        { status: 401 }
      )
    const order = await createOrder({ data })

    return NextResponse.json({ message: "Order Create Success!", order })
  } catch (error) {
    console.log(error, "error order create")
    return NextResponse.json({
      error: "Getting error on order create!",
    })
  }
}
