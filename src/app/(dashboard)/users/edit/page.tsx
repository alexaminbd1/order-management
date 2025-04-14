import ProtectRouteMessage from "@/components/protect-route-message"
import UserEditIndex from "./user-edit-index"
import { auth } from "@/auth"

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string  }>
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return <ProtectRouteMessage />
  const { id } = await searchParams
  return (
    <div>
      <UserEditIndex id={id} />
    </div>
  )
}
