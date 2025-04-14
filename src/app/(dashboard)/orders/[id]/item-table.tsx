"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Item } from "./orderDetailsType"

export default function ItemTable({ items }: { items: Item[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead className="hidden sm:table-cell">Quantity</TableHead>
          <TableHead className="hidden sm:table-cell">Price</TableHead>
          <TableHead className="hidden md:table-cell">Sell Price</TableHead>
          <TableHead >Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((v) => (
          <TableRow key={v.id} className="">
            <TableCell>
              <div className="font-medium">{v.product.name}</div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{v.quantity}</div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {v.product.price}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge className="text-xs" variant="secondary">
                {v.price}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {v.product.price * v.quantity}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
