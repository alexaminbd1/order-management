import { auth } from "@/auth"
import ProtectRouteMessage from "@/components/protect-route-message"
import UserList from "@/components/user/users-list"
import React from "react"

export default async function page({}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return <ProtectRouteMessage />
  return (
    <div>
      <UserList />
    </div>
  )
}
