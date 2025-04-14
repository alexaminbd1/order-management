"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Activity } from "lucide-react"
import React from "react"
import { DashboardTypeData } from "./dash-type"

export default function DasIndex() {
  const getDashboards = async (): Promise<DashboardTypeData> => {
    const products = await axios.get("/api/v1/dashboard")
    return products.data
  }
  const { data, isLoading, } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboards(),
  })
  return (
    <div className="flex gap-3">
      {
        data?.orderStatusCounts.map((v,i)=> (
          <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{v._count._all}</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{v.status}</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
        ))
      }
    </div>
  )
}
