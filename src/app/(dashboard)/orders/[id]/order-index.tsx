"use client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "lucide-react"
import { IData } from "./orderDetailsType"
import OrderDetails from "./orderDetails"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

const getData = async (id: number): Promise<IData> => {
  const data = await axios.get(`/api/v1/order/${id}`)
  return data.data
}

export default function OrderIndex({ id }: { id: number }) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getData(id),
  })
  return isLoading ? (
    <>
      <div className="h-screen flex justify-center items-center">
        <Loader size={48} className="animate-spin" />
      </div>
    </>
  ) : isError ? (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold">No Product found by your id</h2>
      <Button onClick={() => redirect("/orders")}>Go To Orders</Button>
    </div>
  ) : data ? (
    <OrderDetails data={data} />
  ) : (
    <h2>Some thing is Getting error ...</h2>
  )
}
