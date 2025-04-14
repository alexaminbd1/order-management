"use client"
import axios from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { useQuery } from "@tanstack/react-query"
import { SkeletonCard } from "../skelaton-card"
import ProductCard from "../product/product-card"
import OrderInputForm from "./order-input-form"
import { ScrollArea } from "../ui/scroll-area"
import { useState } from "react"
import OrderItem from "./order-item"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface IProducts {
  total: number
  products: {
    id: number
    name: string
    about: string
    delivery: number
    image: string | null
    price: number
    status: string
    suggestPrice: number
    maxPrice: number
  }[]
}

export interface ICart {
  id: number
  quantity: number
  title: string
  price: number
  profit: number
  sell: number
}

const getProducts = async ({ text }: { text?: string }): Promise<IProducts> => {
  const res = await axios.get(`/api/v1/products?text=${text ? text : ""}`)
  return res.data
}

export default function OrderCreate() {
  const [text, setText] = useState<string>("")
  const { data, isLoading } = useQuery({
    queryKey: ["products", text],
    queryFn: () => getProducts({ text }),
  })
  const [cart, setCart] = useState<ICart[]>([])

  return (
    <div className="grid sm:grid-cols-3 gap-5 h-screen">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>All Active Products List</CardTitle>
          <CardDescription>
            <p>
              Select the customer ordered products. You can select multiple
              products at a time. If any customer orders a product in various
              quantities, select the amount in the order side.
            </p>
            <div className="flex gap-2 mt-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search Products By Name...."
              />
              <Button onClick={() => setText("")}>Clear Search</Button>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid sm:grid-cols-3 gap-5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            ""
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            {data?.products.map((v) => (
              <div key={v.id}>
                <ProductCard
                  id={v.id}
                  image={v.image}
                  price={v.price}
                  title={v.name}
                  suggestPrice={v.suggestPrice}
                  tag={v.status}
                  about={v.about}
                  maxPrice={v.maxPrice}
                  setCart={setCart}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product list</CardTitle>
          <CardDescription>....</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:h-[85vh] justify-between gap-3 ">
          <ScrollArea className=" h-full bg-gray-100/20 rounded-xl p-4">
            {cart && cart.length > 0 ? (
              cart.map((v) => (
                <OrderItem key={v.id} cart={v} removeCard={setCart} />
              ))
            ) : (
              <>No product add cart please add products.</>
            )}
          </ScrollArea>

          <OrderInputForm cart={cart} />
        </CardContent>
      </Card>
    </div>
  )
}
