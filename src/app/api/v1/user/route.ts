import { userSchema } from "@/lib/schema/users-schema"
import { createUser } from "./create-user"
import { getUsers } from "./get-users"
import { NextResponse } from "next/server"
import { getUser } from "@/lib/custom-auth"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const take = url.searchParams.get("take")
  const skip = url.searchParams.get("skip")
  const status = url.searchParams.get("status")
  const role = url.searchParams.get("role")
  const text = url.searchParams.get("text")
  const { users, total } = await getUsers({
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : 0,
    status: status ? decodeURI(status as string) : "",
    text: text ? decodeURI(text as string) : "",
    role : role ? decodeURI(role as string) : "",
  })
  return NextResponse.json({ total, users })
}
export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (user && user.roles !== "ADMIN" && user.roles !== "MANAGER") {
      return NextResponse.json(
        { error: "Only Admin or manager can create new user account!" },
        { status: 405 }
      )
    }
    const { success, data } = userSchema.safeParse(await request.json())
    if (!success)
      return NextResponse.json(
        { error: "User create required data is missing!" },
        { status: 422 }
      )
    const res = await createUser(data)
    if (!res)
      return NextResponse.json({ error: "User create fail" }, { status: 501 })
    return NextResponse.json(
      { message: "User create success!" },
      { status: 201 }
    )
  } catch (error) {
    console.log(error, "KKKKK")
    return NextResponse.json({ error: "User create fail" }, { status: 500 })
  }
}
