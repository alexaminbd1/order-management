"use client"

import Image from "next/image"
import { useQueryState } from "nuqs"
import { CirclePlus, MoreHorizontal, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "../ui/input"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { PaginationWithLinks } from "../pagination-with-links"
import { Skeleton } from "../ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "react-toastify"

interface Idata {
  total: number
  users: {
    id: string
    roles: string
    status: string
    order?: string
    name: string
    phone: string
    image: string
    currentBalance: number
    deliveryCharge: number
    _count:{
      order: number
    }
  }[]
}

export default function UserList() {
  const [text, setText] = useQueryState("text")
  const [role, setRole] = useQueryState("role")
  const searchParams = useSearchParams()
  const take = searchParams.get("take") || "50"
  const page = searchParams.get("page")

  const router = useRouter()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users", text, take, page, role],
    queryFn: () => fetchSearchResults(),
  })

  const fetchSearchResults = async (): Promise<Idata> => {
    const res = await axios.get(
      `/api/v1/user?take=${take}&skip=${
        page && Number(page) > 1 ? (Number(page) - 1) * Number(take) : 0
      }&text=${text ? text : ""}`
    )
    return res.data
  }

  const deleteProduct = async ({ id }: { id: string }) => {
    try {
      const res = await axios.delete(`/api/v1/user/${id}`)
      if (res.status == 200) {
        toast("User Delete success!", { type: "success" })
        refetch()
        return
      }
    } catch {
      return toast("User Delete fail!", { type: "warning" })
    }
  }

  return (
    <div className="">
      <div className="flex gap-5 p-4">
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            onChange={(v) => setText(encodeURIComponent(v.target.value))}
          />
        </div>
        <Select onValueChange={setRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select User Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="MANAGER">MANAGER</SelectItem>
          </SelectContent>
        </Select>
        <Link href={"/create-user"}>
          <Button>
            <CirclePlus /> Create User
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>List of all users</CardTitle>
          <CardDescription>
            Manage your users and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Balance</TableHead>
                <TableHead className="hidden md:table-cell">Charge</TableHead>
                <TableHead className="hidden md:table-cell">Order</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </>
            ) : isError ? (
              <h2>Getting error</h2>
            ) : (
              <>
                {data?.users.map((d) => (
                  <TableBody key={d.id}>
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Image"
                          className="aspect-square rounded-md object-cover bg-green-100"
                          height="64"
                          src="/placeholder.svg"
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <h2 className="font-bold">{d.name}</h2>
                        <h2>{d.phone}</h2>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{d.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{d.roles}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {d.currentBalance}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {d.deliveryCharge}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{d._count.order}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => router.push(`/users/${d.id}`)}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(`/users/edit?id=${d.id}`)
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteProduct({ id: d.id })}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
              </>
            )}
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Total Geting {data?.total ? data.total : 0} user.
          </div>
          <PaginationWithLinks
            page={page ? Number(page) : 1}
            pageSize={Number(take)}
            totalCount={Number(data?.total)}
          />
        </CardFooter>
      </Card>
    </div>
  )
}
