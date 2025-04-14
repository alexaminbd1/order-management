import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "lucide-react"
import React from "react"

interface IData {
  delivery_status: string
  status: number
}

const getOrderStatus = async ({
  apiKey,
  inVoiceId,
  secret,
}: {
  apiKey: string
  secret: string
  inVoiceId: string
}) => {
  const res = await axios.get(
    `https://portal.packzy.com/api/v1/status_by_invoice/OM-${inVoiceId}`,
    {
      headers: {
        "Api-Key": apiKey,
        "Secret-Key": secret,
      },
    }
  )
  console.log(res.data, "Test data ----")
  return res.data
}

export default function CheckStatus({
  courierApi,
  courierSecret,
  orderId,
}: {
  courierApi: string
  courierSecret: string
  orderId: string
}) {
  const { data, isLoading, isError, refetch } = useQuery<IData>({
    queryKey: ["orderStatus", orderId],
    queryFn: () =>
      getOrderStatus({
        apiKey: courierApi,
        inVoiceId: orderId,
        secret: courierSecret,
      }),
    enabled: false,
  })
  return isLoading ? (
    <Button disabled>
      <Loader className="animate-spin" /> Loading...
    </Button>
  ) : isError ? (
    <Button onClick={() => refetch()}>
      <Loader />
      Getting Error
    </Button>
  ) : data ? (
    <Button onClick={() => refetch()}>{data.delivery_status}</Button>
  ) : (
    <Button onClick={() => refetch()}>Check</Button>
  )
}
