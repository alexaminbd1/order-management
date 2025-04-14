import React, { use } from "react"
import OrderIndex from "./order-index"

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = use(params)
  return <OrderIndex id={Number(id)} />
}
