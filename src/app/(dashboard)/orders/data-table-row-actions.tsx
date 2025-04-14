"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import DeleteOrder from "./[id]/delete-order"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  id: string
}

export function DataTableRowActions<TData>({
  id,
}: DataTableRowActionsProps<TData>) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/orders/${id}`}>
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </Link>
        {/* <DropdownMenuItem>Send To Delivery</DropdownMenuItem>
        <DropdownMenuItem>Send To Cancel</DropdownMenuItem>
        <DropdownMenuItem>Download PDF</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <DeleteOrder id={Number(id)} />
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
