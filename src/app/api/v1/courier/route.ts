import { NextResponse } from "next/server"
import { courierSchema } from "@/lib/schema/courier-schema"
import { createCourier } from "./create-courier"
import { getCourier } from "./get-courier"
// import { isAdmin } from "@/lib/custom-auth"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const take = url.searchParams.get("take")
  const skip = url.searchParams.get("skip")
  const status = url.searchParams.get("status")
  const text = url.searchParams.get("text")
  const { courier, total } = await getCourier({
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : 0,
    status: status ? decodeURI(status as string) : "",
    text: text ? decodeURI(text as string) : "",
  })
  return NextResponse.json({ total, courier })
}

export async function POST(req: Request) {
  // const test = await isAdmin()
  // if (!test)
  //   return NextResponse.json(
  //     { message: "This server only for admin" },
  //     { status: 401 }
  //   )
  try {
    const { data, success } = courierSchema.safeParse(await req.json())
    if (!success)
      return NextResponse.json(
        { error: "Courier create required data is missing" },
        { status: 422 }
      )

    const create = await createCourier(data)
    if (!create)
      return NextResponse.json(
        { error: "Courier create fail" },
        { status: 501 }
      )
    return NextResponse.json(
      { message: "Courier create successfully" },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: "Courier create fail" }, { status: 501 })
  }
}

// export async function PUT(req: Request) {}
// export async function DELETE(req: Request) {}
