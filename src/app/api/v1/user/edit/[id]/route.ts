import { NextResponse } from "next/server"
import { getUserDetails } from "./getUserDetails"
import { updateUser } from "./updateUser"
import { updateUserSchema } from "@/lib/schema/users-schema"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id)
    return NextResponse.json(
      { error: "Id is required for getting user details" },
      { status: 502 }
    )
  try {
    const user = await getUserDetails({ id })
    return NextResponse.json({
      message: "Successfully get user details",
      details: user,
    })
  } catch {
    return NextResponse.json(
      { error: "Getting error find user details" },
      { status: 50 }
    )
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id)
    return NextResponse.json(
      { error: "Id is required for edit user details" },
      { status: 502 }
    )
  try {
    const { success, data } = updateUserSchema.safeParse(await request.json())
    if (!success)
      return NextResponse.json(
        { error: "Required data is missing for update user" },
        { status: 502 }
      )
    const user = await updateUser({ userId: id, data })
    return NextResponse.json({
      message: "User data update success!",
      details: user,
    })
  } catch {
    return NextResponse.json(
      { error: "Getting error find user details" },
      { status: 50 }
    )
  }
}
