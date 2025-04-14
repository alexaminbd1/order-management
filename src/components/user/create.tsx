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
import { userSchema, userType } from "@/lib/schema/users-schema"
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
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { LoaderCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const postData = async (data: userType) => {
  const response = await axios.post("/api/v1/user", data)
  return response.data
}

export default function CreateUser() {
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast(data.message, { type: "success" })
      router.push("/users")
    },
    onError: (data) => {
      console.log("Data posted fail:", data.message)
    },
  })

  const onSubmit = (data: userType) => {
    console.log(data)
    mutate(data)
  }
  const form = useForm<userType>({
    resolver: zodResolver(userSchema),
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="grid gap-4 col-span-2">
            <Card className="">
              <CardHeader>
                <CardTitle>User Details And Login Information</CardTitle>
                <CardDescription>
                  This information is very important for creating a user
                  account, so fill out the form with the information carefully.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Alex Amin" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please enter the user full name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="01600000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the user valid phone number. This phone number
                        will be required for login.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please enter a strong password to create your account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Optional Information</CardTitle>
                <CardDescription>
                  Providing this user information is not mandatory. You can
                  provide it or not if you want.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Bkash | Nadod | Cash" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the method through which user can accept payment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Number</FormLabel>
                      <FormControl>
                        <Input placeholder="01600000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your payment account number such as bKash Rocket
                        Nagad or bank account number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payOutAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Cash Out Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="200"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the minimum amount user can cash out.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryCharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Charge</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="90"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the amount of delivery charge you want the user to
                        pay.
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
              <CardTitle>User Other Info</CardTitle>
              <CardDescription>
                Select more important security-related settings for the user.
              </CardDescription>
              <CardContent className="grid gap-5">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Account Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select User Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="MANAGER">MANAGER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
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
                  name="status"
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
                          <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="BAN">BAN</SelectItem>
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
                  <Button>Create Account</Button>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </form>
    </Form>
  )
}
