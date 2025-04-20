"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { columns } from "./columns"
import { IData } from "./schema"
import { LoaderPinwheel } from "lucide-react"
import { PaginationWithLinks } from "@/components/pagination-with-links"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useQueryState } from "nuqs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/date-rang"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

interface IUser {
  total: number
  users: {
    id: string
    name: string
  }[]
}

const getOrder = async ({
  page,
  take,
  text,
  user,
  status,
  startDate,
  endDate,
}: {
  page?: number
  take?: number
  text?: string
  user?: string
  status?: string
  startDate: Date | undefined
  endDate: Date | undefined
}) => {
  const res = await axios.get(
    `/api/v1/order?take=${take}&skip=${
      page && Number(page) > 1 ? (Number(page) - 1) * Number(take) : 0
    }&text=${
      text ? text : ""
    }&user=${user}&status=${status}&form=${startDate}&to=${endDate}`
  )
  return res.data
}

const getUser = async ({ text }: { text: string }) => {
  const res = await axios.get(`/api/v1/user?take=10&text=${text}`)
  return res.data
}

export function DataTable() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [searchUsers, setSearchUser] = React.useState<string>()
  const [text, setText] = useQueryState("text")
  const [user, setUser] = useQueryState("user")
  const [status, setStatus] = useQueryState("status")
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const searchParams = useSearchParams()
  const take = searchParams.get("take") || 50
  const page = searchParams.get("page")

  const { data, isError, isLoading } = useQuery<IData>({
    queryKey: ["order", take, page, text, user, status, date?.from, date?.to],
    queryFn: () =>
      getOrder({
        take: Number(take),
        page: Number(page),
        text: text ? text : "",
        user: user ? user : "",
        status: status ? status : "",
        startDate: date?.from,
        endDate: date?.to,
      }),
  })

  const table = useReactTable({
    data: data?.orders ? data.orders : [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    manualFiltering: true,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  const {
    data: User,
    isLoading: userLoading,
    isError: userError,
  } = useQuery<IUser>({
    queryKey: ["user", searchUsers],
    queryFn: () => getUser({ text: searchUsers ? searchUsers : "" }),
  })
  return (
    <div className="space-y-4">
      {/* <DataTableToolbar table={table} /> */}
      <div className="flex gap-2">
        <Input
          onChange={(v) => setText(v.target.value)}
          className="w-96"
          placeholder="Search Order ..."
        />
        <Popover>
          <PopoverTrigger>
            <Button>User Filter</Button>
          </PopoverTrigger>
          <PopoverContent>
            <input
              onChange={(v) => setSearchUser(v.target.value)}
              className="focus:outline-0"
              placeholder="Search Users"
            />
            <Separator className="my-2" />
            {userLoading ? (
              <>User Loading...</>
            ) : userError ? (
              <>Getting error</>
            ) : (
              <div className="flex flex-col gap-2">
                <RadioGroup
                  onValueChange={(v) =>
                    v === "all" ? setUser(null) : setUser(v)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Users</Label>
                  </div>
                  {User?.users.map((value) => (
                    <div key={value.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.id} id={value.id} />
                      <Label htmlFor={value.id}>{value.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button>Filter Status</Button>
          </PopoverTrigger>
          <PopoverContent>
            <RadioGroup
              onValueChange={(v) =>
                v === "all" ? setStatus(null) : setStatus(v)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Order</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DRAFT" id="DRAFT" />
                <Label htmlFor="DRAFT">DRAFT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PENDING" id="PENDING" />
                <Label htmlFor="PENDING">PENDING</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DELIVERY" id="DELIVERY" />
                <Label htmlFor="DELIVERY">DELIVERY</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CANCEL" id="CANCEL" />
                <Label htmlFor="CANCEL">CANCEL</Label>
              </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="px-4 py-2"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <div className="h-[50vh] items-center justify-center flex flex-col">
                <LoaderPinwheel className="animate-spin" />
                <h2 className="text-xl">Loading...</h2>
              </div>
            ) : isError ? (
              <>Getting error</>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="px-4 py-2" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationWithLinks
        page={page ? Number(page) : 1}
        pageSize={Number(take)}
        totalCount={data?.totalOrders || 0}
      />
    </div>
  )
}
