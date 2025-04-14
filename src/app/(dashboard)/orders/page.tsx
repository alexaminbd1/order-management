import { Suspense } from "react"
import { DataTable } from "./data-table"

export default async function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable />
      </Suspense>
    </div>
  )
}
