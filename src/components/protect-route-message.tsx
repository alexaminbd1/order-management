import { Frown } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export default function ProtectRouteMessage() {
  return (
    <div className="h-screen flex flex-col gap-2 items-center justify-center">
      <Frown className="size-10"/>
      <h2 className="text-xl font-bold">
        Sorry Dear User Only Admin Can Access This Page
      </h2>
      <Link href={"/dashboard"}>
        <Button>GO Back To Hme</Button>
      </Link>
    </div>
  )
}
