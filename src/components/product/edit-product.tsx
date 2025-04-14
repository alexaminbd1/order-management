"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Textarea } from "../ui/textarea"
import { productSchema, productType } from "@/lib/schema/products-schema"
import { LoaderCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { ImageUpload } from "../UploadForm"
import { useState } from "react"

interface ICourier {
  total: number
  courier: {
    id: string
    name: string
  }[]
}

const postData = async ({ data, id }: { data: productType; id: number }) => {
  const response = await axios.patch(`/api/v1/products?id=${id}`, data)
  return response.data.details
}
const getCourier = async (): Promise<ICourier> => {
  const res = await axios.get("/api/v1/courier")
  return res.data
}

export default function EditProduct({
  details,
  id,
}: {
  details: productType
  id: number
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    details.image ? details.image : null
  )
  const router = useRouter()
  const { data } = useQuery({
    queryKey: ["courier"],
    queryFn: getCourier,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      // Handle success
      toast(data.message, { type: "success" })
      router.push("/products")
    },
    onError: () => {
      // Handle success
      toast("Product update fail", { type: "error" })
    },
  })

  const onSubmit = (data: productType) => {
    const updateData = { ...data, image: imageUrl ? imageUrl : undefined }
    mutate({ data: updateData, id })
  }

  const form = useForm<productType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...details,
      image: undefined,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="grid gap-4 col-span-2">
            <Card className="">
              <CardHeader>
                <CardTitle>Update Or Edit Product Data</CardTitle>
                <CardDescription>
                  This information is very important for update a user account,
                  so fill out the form with the information carefully.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name Or Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Watermelon seeds.." {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter the product title or full name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Product</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Product details" {...field} />
                      </FormControl>
                      <FormDescription>
                        Write details about how to sell this product, you can
                        mention offers or anything else.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Package And Price</CardTitle>
                <CardDescription>
                  Providing this user information is not mandatory. You can
                  provide it or not if you want.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <FormField
                  control={form.control}
                  name="byPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Buy Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="150"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Please enter the purchase price of your product to
                        calculate profit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="499"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price of your product, what do you want to
                        charge your user?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Product Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="899"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the max price of your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="suggestPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggest Product Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="650"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the suggest price of your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Product Condition Other Info</CardTitle>
              <CardDescription>
                Select more important security-related settings for the user.
              </CardDescription>
              <CardContent className="grid gap-5">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Product Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                          <SelectItem value="DRAFT">DRAFT</SelectItem>
                          <SelectItem value="STOCK_OUT">STOCK_OUT</SelectItem>
                          <SelectItem value="CLOSED">CLOSED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select what type of account this will be.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Account Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select User Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.courier.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select what the account status will be after the account
                        is completed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isPending ? (
                  <Button disabled>
                    <LoaderCircle className="animate-spin" /> Loading...
                  </Button>
                ) : (
                  <Button>Update Product</Button>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </form>
    </Form>
  )
}
