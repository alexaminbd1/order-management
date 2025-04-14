import { NextResponse } from "next/server"
import { getProductDetails } from "./getProductDeatils"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log(id, "IDD....")
  if (!id)
    return NextResponse.json(
      { error: "Product is required for getting product details!" },
      { status: 405 }
    )
  try {
    const details = await getProductDetails({ id: Number(id) })
    return NextResponse.json({ message: "Success Product dat", details })
  } catch (error) {
    console.log(error, "error--- server")
    return NextResponse.json({
      error: "Getting error find single products details!",
    })
  }
}
