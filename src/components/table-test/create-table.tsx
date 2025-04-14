"use client"
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React from "react"

type IPerson = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columns: ColumnDef<IPerson>[] = [
  {
    header: "First Name",
    accessorKey: "firstName",
  },
  {
    header: "Last Name",
    accessorKey: "lastName",
  },
  {
    header: "Age",
    accessorKey: "age",
  },
  {
    header: "Visits",
    accessorKey: "visits",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Progress",
    accessorKey: "progress",
  },
]

const data: IPerson[] = [
  {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    visits: 100,
    status: "Married",
    progress: 50,
  },
  {
    firstName: "Rakib Shake",
    lastName: "Doe",
    age: 30,
    visits: 100,
    status: "Married",
    progress: 50,
  },
  {
    firstName: "Naime Molla",
    lastName: "Doe",
    age: 30,
    visits: 100,
    status: "Married",
    progress: 50,
  },
]

export default function CreateTable() {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id}>{h.column.columnDef.header as string}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.getValue() as string}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
