import ProtectRouteMessage from "@/components/protect-route-message"
import ProductEditIndex from "./product-edit-index"
import { auth } from "@/auth"

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return <ProtectRouteMessage />
  const { id } = await searchParams
  return (
    <div>
      <ProductEditIndex id={Number(id)} />
    </div>
  )
}
