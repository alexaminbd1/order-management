import { auth } from "@/auth"
import GetProducts from "@/components/product/get-products"
import ProtectRouteMessage from "@/components/protect-route-message"
import React from "react"

export default async function page() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return <ProtectRouteMessage />
  return (
    <div>
      <GetProducts />
    </div>
  )
}
