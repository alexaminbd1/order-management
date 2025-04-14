"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  withdrawalSchema,
  withdrawalType,
} from "@/lib/schema/withdrawal-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import axios, { AxiosError } from "axios"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

const postData = async (data: withdrawalType) => {
  const response = await axios.post("/api/v1/withdrawal", data)
  return response.data
}

export default function WithdrawalCreate({
  setCreate,
}: {
  setCreate: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const route = useRouter()
  const form = useForm({
    resolver: zodResolver(withdrawalSchema),
  })
  const CType = form.watch("type")

  const { mutate, isPending } = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast(data.message, { type: "success" })
      setCreate(false)
      route.push("/payout-requests")
    },
    onError: (error: AxiosError<{ error: string }>) => {
      if (axios.isAxiosError(error) && error.response) {
        toast(error.response.data.error, { type: "error" });
      } else {
        toast("An unexpected error occurred", { type: "error" });
      }
      setCreate(false);
    },
  
  })

  const onSubmit = (data: withdrawalType) => {
    mutate(data)
  }
  return (
    <Form {...form}>
      <form
        className="mx-5 p-4 flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount </FormLabel>
              <FormControl>
                <Input
                  min={10}
                  type="number"
                  placeholder="500"
                  {...field}
                  onChange={(v) => field.onChange(parseInt(v.target.value))}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Hand Cash</SelectItem>
                  <SelectItem value="bkash">Bkash</SelectItem>
                  <SelectItem value="nagod">Nagod</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Please select your seeable payment method
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {CType == "nagod" || CType == "bkash" || CType == "bank" ? (
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="01700000000" {...field} />
                </FormControl>
                <FormDescription>
                  Please provide the correct {CType} number. The authorities
                  will not be held responsible if the number is incorrect.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          ""
        )}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Bank name and route number" {...field} />
              </FormControl>
              <FormDescription>
                If you have anything to say about payment, you can say it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPending ? (
          <Button size={"lg"} disabled>
            <Loader className="animate-spin" /> Loading...
          </Button>
        ) : (
          <Button size={"lg"} type="submit">
            Create Request
          </Button>
        )}
      </form>
    </Form>
  )
}
