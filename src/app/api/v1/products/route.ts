import { productSchema } from "@/lib/schema/products-schema"
import { NextRequest, NextResponse } from "next/server"
import { createProduct } from "./create"
import { getUser } from "@/lib/custom-auth"
import { getProduct } from "./getProdcuts"
import { updateProduct } from "./updateProduct"
import { deleteProduct } from "./deleteProduct"

export async function GET(req: Request) {
  try {
    const result = await getUser()
    if (!result)
      return NextResponse.json(
        { error: "Need login for getting withdrawal request" },
        { status: 401 }
      )
    const url = new URL(await req.url)
    const take = url.searchParams.get("take")
    const skip = url.searchParams.get("skip")
    const status = url.searchParams.get("status")
    const text = url.searchParams.get("text")

    const { total, products } = await getProduct({
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : 0,
      status: status ? decodeURI(status as string) : "",
      text: text ? decodeURI(text as string) : "",
    })

    return NextResponse.json(
      { message: "Success", total, products },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: "Products Not found!" }, { status: 501 })
  }
}
export async function POST(req: NextRequest) {
  const user = await getUser()
  if (user && user.roles !== "ADMIN" && user.roles !== "MANAGER") {
    return NextResponse.json(
      { error: "Only Admin or manager can create new product!" },
      { status: 405 }
    )
  }
  try {
    const { success, data } = await productSchema.safeParse(await req.json())
    if (!success)
      return Response.json(
        {
          error: "Product create required data is missing!",
        },
        { status: 405 }
      )
    await createProduct({ data, id: user?.id as string })
    return new Response(JSON.stringify({ message: "Product create success" }), {
      status: 201,
    })
  } catch {
    return Response.json(
      {
        error: "Product create fail!",
      },
      { status: 501 }
    )
  }
}

export async function PATCH(request: Request) {
  const url = new URL(await request.url)
  const id = url.searchParams.get("id")
  if (!id)
    return NextResponse.json(
      {
        error: "Product id is required for update product",
      },
      { status: 501 }
    )
  try {
    const { success, data } = productSchema.safeParse(await request.json())
    if (!success)
      return NextResponse.json(
        {
          error: "Required data is missing for update product",
        },
        { status: 501 }
      )
    const update = await updateProduct({ data, id: Number(id) })

    return NextResponse.json({
      message: "Product data update success!",
      details: update,
    })
  } catch {
    return NextResponse.json(
      {
        error: "Product update fail!",
      },
      { status: 501 }
    )
  }
}

export async function DELETE(request: Request) {
  const url = new URL(await request.url)
  const id = url.searchParams.get("id")

  if (!id)
    return NextResponse.json(
      {
        error: "Product id is required for delete",
      },
      { status: 501 }
    )
  try {
    const res = await deleteProduct({ id: Number(id) })
    return NextResponse.json({
      message: "Product Delete Success!",
      details: res,
    })
  } catch (error) {
    console.log(error, "Error delete --")
    return NextResponse.json(
      {
        error: "Product delete fail!",
      },
      { status: 501 }
    )
  }
}
