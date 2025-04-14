import { auth } from "@/auth"
import ProtectRouteMessage from "@/components/protect-route-message"
import CreateUser from "@/components/user/create"
import React from "react"

export default async function page() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return <ProtectRouteMessage />
  return (
    <div>
      <CreateUser />
    </div>
  )
}
