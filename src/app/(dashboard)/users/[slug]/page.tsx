import SingleUserIndex from "./single-user-index"
import { auth } from "@/auth"

import ProtectRouteMessage from "@/components/protect-route-message"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return <ProtectRouteMessage />
  const { slug } = await params
  return <SingleUserIndex id={slug} />
}
