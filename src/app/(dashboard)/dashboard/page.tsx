import React from "react"
import DasIndex from "./das-index"

export default async function page() {

  return (
    <div>
      <div className="flex gap-2 justify-between">
        <DasIndex />
      </div>
    </div>
  )
}