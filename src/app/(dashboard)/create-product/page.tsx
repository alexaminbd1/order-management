import { auth } from "@/auth"
import CreateProduct from "@/components/product/product-create"
import ProtectRouteMessage from "@/components/protect-route-message"
import React from "react"

export default async function page() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return <ProtectRouteMessage />
  return (
    <div>
      <CreateProduct />
    </div>
  )
}
