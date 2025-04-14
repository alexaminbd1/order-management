import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "react-toastify"

const deleteOrder = async ({ id }: { id: number }) => {
  const res = await axios.delete(`/api/v1/order/${id}`)
  return res.data
}

export default function DeleteOrder({ id }: { id: number }) {
  const router = useRouter()
  const { isPending, isError, mutate, isSuccess } = useMutation({
    mutationFn: () => deleteOrder({ id }),
    onSuccess: () => {
      toast("Order Delete Success!")
      router.push("/orders")
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
    <>Order Delete Success</>
  ) : (
    <button onClick={() => mutate()}>Delete Order</button>
  )
}
