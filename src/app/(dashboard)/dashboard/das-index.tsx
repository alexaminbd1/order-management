"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Activity, ArrowUpRight } from "lucide-react"
import React from "react"
import { DashboardData } from "./dash-type"
import { DatePickerWithRange } from "@/components/date-rang"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function DasIndex() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const getDashboards = async (): Promise<DashboardData> => {
    const products = await axios.get(
      `/api/v1/dashboard?to=${date?.to}&from=${date?.from}`
    )
    return products.data
  }
  const route = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboards(),
  })
  return (
    <div className="">
      <div className="flex justify-between p-3">
        <h2>Total Summary of your account</h2>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
        {data?.orderStatusCounts.map((v, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isLoading ? "Loading..." : v.status}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? 0 : v._count._all}
              </div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Order List</CardTitle>
              <CardDescription>Recent 10 order list</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href={`/orders`}>
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden xl:table-column">Type</TableHead>
                  <TableHead className="xl:table-column">Status</TableHead>
                  <TableHead className="xl:table-column">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentOrders.map((v) => (
                  <TableRow
                    onClick={() => route.push(`/orders/${v.id}`)}
                    key={v.id}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="font-medium">
                        <h2>{v.name}</h2>
                        <h2>{v.phone}</h2>
                      </div>
                      <div className="text-sm text-muted-foreground md:inline">
                        {v.status}
                      </div>
                    </TableCell>
                    <TableCell className="xl:table-column">Sale</TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="md:table-cell lg:hidden xl:table-column">
                      {v.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      {v.sellPrice} TK
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Top orders user </CardTitle>
              <CardDescription>Recent 10 order list</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href={`/orders`}>
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden xl:table-column">Type</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead className=" xl:table-column">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.topUsers.map((v) => (
                  <TableRow
                    onClick={() => route.push(`/users/${v.id}`)}
                    key={v.id}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="font-medium">
                        <h2>{v.name}</h2>
                        <h2>{v.phone}</h2>
                      </div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {v.p}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      Sale
                    </TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                      {v.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      {v._count.order} Order
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
