import { getUser } from "@/lib/custom-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getUser()
    if (!user)
      return NextResponse.json({ error: "User Not found you my be not login" })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: "User Not found you my be not login" })
  }
}
