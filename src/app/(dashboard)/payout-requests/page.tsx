import WithdrawalList from "@/components/withdrawal/withdeawal-list"
import React, { Suspense } from "react"

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <WithdrawalList />
      </Suspense>
    </div>
  )
}
