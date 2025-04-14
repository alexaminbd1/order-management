import { getUser } from "@/lib/custom-auth"
import { withdrawalSchema } from "@/lib/schema/withdrawal-schema"
import { NextResponse } from "next/server"
import { createWithdrawal, paymentDecreasing } from "./create-withdrawal"
import { withdrawalRequest } from "./withdrawal-request"
import { prisma } from "@/prisma"
import { WithdrawalStatus } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const result = await getUser()
    if (!result)
      return NextResponse.json(
        { error: "Need login for getting withdrawal request" },
        { status: 401 }
      )
    const url = new URL(req.url)
    const take = url.searchParams.get("take")
    const skip = url.searchParams.get("skip")
    const status = url.searchParams.get("status")
    const text = url.searchParams.get("text")
    const user = url.searchParams.get("user")

    const { total, withdrawal } = await withdrawalRequest({
      id: result.id,
      role: result.roles,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : 0,
      status: status ? decodeURI(status as string) : "",
      text: text ? decodeURI(text as string) : "",
      // user: user ? decodeURI(text as string).split(",") : undefined,
      user: user ? user.split(",") : undefined,
    })

    return NextResponse.json(
      { message: "Welcome to withdrawal page", total, withdrawal },
      { status: 200 }
    )
  } catch (error) {
    console.log(error, "Getting error")
    return NextResponse.json(
      { error: "We can not find any withdrawal request" },
      { status: 501 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user)
      return NextResponse.json(
        { error: "Need login for withdrawal request" },
        { status: 401 }
      )
    const { success, data } = withdrawalSchema.safeParse(await request.json())
    if (!success)
      return NextResponse.json(
        { error: "Withdrawal request data is missing" },
        { status: 422 }
      )
    console.log(user.currentBalance > data.amount, "Loggg....")
    if (user.currentBalance < data.amount) {
      return NextResponse.json(
        { error: "Insufficient Balance!" },
        { status: 501 }
      )
    }
    if (Number(user.payOutAmount) > data.amount) {
      return NextResponse.json(
        {
          error: `Withdraw amount too low. Please increase the amount to a minimum of ${user.payOutAmount} tk`,
        },
        { status: 501 }
      )
    }
    const create = await createWithdrawal({ data, id: user.id })
    if (!create)
      return NextResponse.json(
        { error: "Withdrawal request create fail" },
        { status: 409 }
      )
    const update = await paymentDecreasing({ amount: data.amount, id: user.id })
    if (!update)
      return NextResponse.json({ error: "Amount update fail" }, { status: 409 })
    return NextResponse.json(
      { message: "Withdrawal request create successful" },
      { status: 201 }
    )
  } catch (error) {
    console.log(error, "Request error -- ")
    return NextResponse.json(
      { error: "Withdrawal request create fail" },
      { status: 501 }
    )
  }
}

export async function PATCH(request: Request) {
  const statusList = ["PENDING", "APPROVE", "REJECT"]
  const url = new URL(await request.url)
  const id = url.searchParams.get("id")
  const status = url.searchParams.get("status")
  const { message } = await request.json()

  if (!id && !statusList.includes(status?.toUpperCase() as string)) {
    return NextResponse.json(
      { error: "Id and status is required for update request data!" },
      { status: 409 }
    )
  }
  if (status?.toUpperCase() == "APPROVE" || status?.toUpperCase() == "REJECT") {
    try {
      const update = await prisma.withdrawal.update({
        where: { id: Number(id) },
        data: {
          message: message ? message : undefined,
          status: status?.toUpperCase() as WithdrawalStatus,
        },
      })
      if (!update)
        return NextResponse.json(
          {
            error: "Request update fail!",
          },
          { status: 401 }
        )
      return NextResponse.json({
        message: "Request update success!",
      })
    } catch {
      return NextResponse.json(
        {
          error: "Request update fail!",
        },
        { status: 401 }
      )
    }
  }
}

// export async function PUT(request: Request) {}
// export async function DELETE(request: Request) {}
