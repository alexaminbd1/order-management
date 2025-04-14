import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { IData } from "./orderDetailsType"
import ItemTable from "./item-table"
import { PDFDownloadLink } from "@react-pdf/renderer"
import Invoice from "@/components/invoice"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CheckStatus from "../check-status"
import UpdateOrder from "@/components/courier/update-order"
import { useSession } from "next-auth/react"
import Link from "next/link"
import DeleteOrder from "./delete-order"

interface ICourier {
  total: number
  courier: {
    id: string
    name: string
  }[]
}

const getCourier = async (): Promise<ICourier> => {
  const res = await axios.get("/api/v1/courier")
  return res.data
}

export default function OrderDetails({ data }: { data: IData }) {
  const {
    id,
    status,
    address,
    district,
    name,
    user,
    phone,
    items,
    totalPrice,
    sellPrice,
    createdAt,
    delivery,
    profit,
    courier,
    userId,
    consignment_id
  } = data.orderDetails
  const updateItems = items.map((v) => {
    return {
      title: v.product.name,
      quantity: v.quantity,
      rate: v.price,
    }
  })
  console.log(updateItems, "updateItems")
  const { data: getCo, isLoading } = useQuery({
    queryKey: ["courier"],
    queryFn: getCourier,
  })
  const [selectData, setSelectData] = useState<string>()
  const { data: session } = useSession()

  return (
    <div className="md:flex gap-3">
      <Card className="basis-2/3">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>...</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl">Order Toolbar</h2>
          <div className="flex gap-3 my-4">
            {updateItems.length > 0 ? (
              <>
                <Button>
                  <PDFDownloadLink
                    document={
                      <Invoice
                        createdAt={createdAt}
                        customer={{
                          address: `${district}, ${address}`,
                          name: name,
                          phone: phone,
                        }}
                        invoice_no={`#OM-${id}`}
                        items={updateItems}
                      />
                    }
                    fileName={`OM-${id}.pdf`}
                  >
                    {(info) =>
                      info.loading ? "Creating Invoice..." : "Download Invoice"
                    }
                  </PDFDownloadLink>
                </Button>
              </>
            ) : (
              ""
            )}
            {status === "DRAFT" && session?.user?.role === "ADMIN" ? (
              <>
                <Select onValueChange={(v) => setSelectData(v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select " />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <>Courier Loading...</>
                    ) : (
                      <>
                        {getCo?.courier.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {v.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                <Button disabled={selectData ? false : true}>
                  <UpdateOrder
                    id={id.toString()}
                    type="SEND"
                    btText="Send Courier"
                    courier={selectData ? selectData : ""}
                  />
                </Button>
              </>
            ) : status === "PENDING" && courier ? (
              <>
                {session?.user?.role === "ADMIN" ? (
                  <div className="flex gap-2">
                    <Button>
                      <UpdateOrder
                        id={id.toString()}
                        type="DELIVERY"
                        btText="DELIVERY"
                      />
                    </Button>
                    <Button>
                      <UpdateOrder
                        id={id.toString()}
                        type="Cancel"
                        btText="Order Cancel"
                      />
                    </Button>
                    <CheckStatus
                      courierApi={courier.apiKey}
                      courierSecret={courier.secretKey}
                      orderId={id.toLocaleString()}
                    />
                  </div>
                ) : (
                  <CheckStatus
                    courierApi={courier.apiKey}
                    courierSecret={courier.secretKey}
                    orderId={id.toLocaleString()}
                  />
                )}
              </>
            ) : status === "DELIVERY" ? (
              <h2>Product Delivery Success and user get reword!</h2>
            ) : (
              ""
            )}
          </div>

          <h2 className="text-xl">Order Product List and Details</h2>
          <ItemTable items={items} />
          <Separator className="my-4" />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl">Order Summary</h2>
            <h2>Total Sell : {sellPrice} Tk</h2>
            <h2>Total Price : {totalPrice} Tk</h2>
            <h2>Courier Charge : {delivery} Tk</h2>
            <h2>Total Profit : {profit} Tk</h2>
          </div>
        </CardContent>
        <CardFooter>
          <h2>....</h2>
        </CardFooter>
      </Card>
      <Card className="basis-1/3">
        <CardHeader>
          <CardTitle>Customer And Seller Details</CardTitle>
          <CardDescription>...</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl">Customer Information</h2>
          <div className="flex flex-col gap-2 p-2">
            <h2>Order Id: #OM-{id}</h2>
            <h2>Order Status: {status}</h2>
            {
            consignment_id ? <h2>Parcel Id: {status}</h2> : ""
            }
            <h2>Customer Name: {name}</h2>
            <h2>Customer Address: {address}</h2>
            <h2>Customer Phone: {phone}</h2>
            <h2>Customer District: {district}</h2>
            <Button>
              <DeleteOrder id={id} />
            </Button>
          </div>
          <Separator />
          <h2 className="text-xl">Seller Information</h2>
          <div className="flex flex-col gap-2 p-2">
            <h2>Seller Name: {user.name}</h2>
            <h2>Seller Balance: {user.currentBalance}</h2>
            <h2>Customer Phone: {user.roles}</h2>
            <Link href={`/users/${userId}`}>
              <Button>View More</Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <h2>....</h2>
        </CardFooter>
      </Card>
    </div>
  )
}
