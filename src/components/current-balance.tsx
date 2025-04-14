import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader, RefreshCw } from "lucide-react"
import React from "react"

interface IUser {
  user: {
    id: string
    name: string
    phone: string
    image: string | null
    paymentType: string | null
    paymentNumber: string | null
    payOutAmount: number
    totalOrderAmount: number
    currentBalance: number
    deliveryCharge: number | null
    status: string
    roles: string
    createdAt: string
    updatedAt: string
  }
}

const getUser = async () => {
  const res = await axios.get("/api/v1/me")
  return res.data
}

export default function CurrentBalance() {
  const { data, isError, isLoading, refetch } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: getUser,
  })
  return isLoading ? (
    <div className="flex gap-2 items-center">
      <Loader className="animate-spin" /> <h2>Balance Is Loading</h2>
    </div>
  ) : isError ? (
    <div className="flex gap-2 items-center">
      Getting Error
      <RefreshCw className="cursor-pointer" onClick={() => refetch()} />
    </div>
  ) : data ? (
    <div className="flex gap-2 items-center">
      <h2 className="text-lg font-semibold">
        Current Balance :- {data.user.currentBalance}
      </h2>
      <RefreshCw className="cursor-pointer size-5" onClick={() => refetch()} />
    </div>
  ) : (
    "Some Thing is error"
  )
}
