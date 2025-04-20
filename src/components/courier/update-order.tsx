import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "react-toastify"
import { Button } from "../ui/button"
import { Loader } from "lucide-react"

const getData = async ({
  id,
  type,
  courier,
}: {
  id: string
  type: string
  courier?: string
}) => {
  const res = await axios.patch(
    `/api/v1/order/${id}?type=${type}&courier=${courier}`
  )
  return res.data
}

export default function UpdateOrder({
  id,
  type,
  btText,
  courier,
}: {
  id: string
  type: string
  btText?: string
  courier?: string
}) {
  const router = useRouter()
  const { isPending, isError, mutate, isSuccess } = useMutation({
    mutationFn: () => getData({ id, type, courier: courier ? courier : "" }),
    onSuccess: () => {
      toast("Successfully Update!")
      router.back()
    },
  })
  return isPending ? (
    <Button disabled>
      <Loader className="animate-spin" /> Loading...
    </Button>
  ) : isError ? (
    <Button onClick={() => mutate()}>
      <Loader />
      Getting Error
    </Button>
  ) : isSuccess ? (
    <>Success Done</>
  ) : (
    <button onClick={() => mutate()}>{btText ? btText : "Send Data"}</button>
  )
}
