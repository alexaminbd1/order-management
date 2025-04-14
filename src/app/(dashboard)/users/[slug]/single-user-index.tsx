"use client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { SingleUserType } from "./single-user-type"
import OrderSummary from "./order-summary"
import { Loader } from "lucide-react"
import RecentOrderSingleUser from "./recent-orders"

export default function SingleUserIndex({ id }: { id: string }) {
  const getUserData = async ({ id }: { id: string }) => {
    const user = await axios.get(`/api/v1/user/${id}`)
    return user.data
  }
  const { data, isLoading, isError } = useQuery<SingleUserType>({
    queryKey: ["user", id],
    queryFn: () => getUserData({ id }),
  })
  return isLoading ? (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader className="animate-spin size-10" />
      <h2 className="text-xl font-bold">Loading...</h2>
    </div>
  ) : isError ? (
    <>Getting Error</>
  ) : data ? (
    <div className="md:p-5 p-2 flex flex-col md:gap-4 gap-2">
      <h2 className="text-2xl font-semibold">
        Welcome to {data.details.userRecent.name} Details Page!
      </h2>
      <h2>
        Current Balance:
        <span className="font-bold">
          {data.details.userRecent.currentBalance} Taka
        </span>
      </h2>
      <h2>
        This User Role:- {data.details.userRecent.roles} And Status :-
        {data.details.userRecent.status}
      </h2>
      <OrderSummary
        totalCancel={data.details.orderSummary.totalCancel}
        totalDelivery={data.details.orderSummary.totalDelivery}
        totalDraft={data.details.orderSummary.totalDraft}
        totalOrder={data.details.orderSummary.totalOrder}
        totalPending={data.details.orderSummary.totalPending}
      />
      <RecentOrderSingleUser
        userId={data.details.userRecent.id}
        data={data.details.userRecent.order}
      />
    </div>
  ) : (
    <h2>Something is worng</h2>
  )
}
