import { NextResponse } from "next/server"
import { getUserDetails } from "./get-user-details"
import { deleteUser } from "./delete"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id)
    return NextResponse.json(
      { error: "Id is required for data" },
      { status: 402 }
    )
  try {
    const res = await getUserDetails({ id })
    return NextResponse.json({ message: "Success ", details: res })
  } catch {
    return NextResponse.json({ error: "Getting error" })
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id)
    return NextResponse.json(
      { error: "Id is required for delete" },
      { status: 402 }
    )
  try {
    const res = await deleteUser({ id })
    return NextResponse.json({ message: "Successfully user delete", details: res })
  } catch {
    return NextResponse.json({ error: "Getting error" })
  }
}
