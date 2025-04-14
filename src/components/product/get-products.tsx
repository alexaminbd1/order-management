"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { SkeletonList } from "../skelaton-card"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

interface IGettingProducts {
  total: number
  products: IProduct[]
}

interface IProduct {
  id: number
  name: string
  status: string
  price: number
  totalSells?: number
  createdAt: string
  image: string | null
}

export default function GetProducts() {
  const route = useRouter()
  const getProducts = async (): Promise<IGettingProducts> => {
    const products = await axios.get("/api/v1/products")
    return products.data
  }
  const { data, isLoading, } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  })
  const deleteProduct = async ({ id }: { id: number }) => {
    try {
      const res = await axios.delete(`/api/v1/products?id=${id}`)
      if (res.status == 200) {
        toast("Product Delete success!", { type: "success" })
        return
      }
    } catch {
      return toast("Product Delete fail!", { type: "warning" })
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
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
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <SkeletonList />
          ) : data?.products ? (
            <>
              {data.products.map((v) => (
                <TableBody key={v.id}>
                  <TableRow>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={v.image ? v.image : "/dome-imaeg.jpeg"}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{v.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {v.price}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">25</TableCell>
                    <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(v.createdAt), {
                      addSuffix: true
                      })}
                    </TableCell>
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
                            onClick={() =>
                              route.push(`/products/edit?id=${v.id}`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              deleteProduct({ id: v.id })
                            }}
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
          ) : (
            <></>
          )}
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Getting total {data?.total ?? 0} products
        </div>
      </CardFooter>
    </Card>
  )
}
