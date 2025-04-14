"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Orders } from "./schema"
import { DataTableRowActions } from "./data-table-row-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import CheckStatus from "./check-status"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export const columns: ColumnDef<Orders>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Id" />
    ),
    cell: ({ row }) => (
      <Link
        className="w-[150px] capitalize cursor-pointer"
        href={`/orders/${row.getValue("orderId")}`}
      >
        {row.getValue("orderId")}
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            By - {row.getValue("userName")}
          </span>
          <h3>
            {row.original.customerName} - {row.original.customerPhone}
          </h3>
        </div>
      )
    },
  },

  {
    accessorKey: "status",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Status" />
    // ),
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <Badge>
            <span className="capitalize"> {row.getValue("status")}</span>
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "courierApi",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Courier Status" />
    // ),
    header: "Courier Status",
    cell: ({ row }) => {
      const { courierApi, courierSecret, orderId } = row.original
      if (!row.original.isDelivery && row.original.status == "DRAFT") {
        return (
          <Link href={`/orders/${orderId}`}>
            <Button>Send Courier</Button>
          </Link>
        )
      }
      if (courierApi && courierSecret && orderId) {
        return (
          <CheckStatus
            courierApi={courierApi}
            courierSecret={courierSecret}
            orderId={orderId}
          />
        )
      }
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "sellPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("sellPrice")
      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn(
              "capitalize",
              type === "income" ? "text-green-500" : "text-red-500"
            )}
          >
            {row.getValue("sellPrice")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">
            {formatDistanceToNow(new Date(row.getValue("createdAt")), {
              addSuffix: true,
            })}
          </span>
        </div>
      )
    },

    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id))
      const [startDate, endDate] = value
      return rowDate >= startDate && rowDate <= endDate
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions id={row.original.orderId} row={row} />
    ),
  },
]
