"use client"

import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CircleEllipsis, CirclePlus, Loader } from "lucide-react"
import { Button } from "../ui/button"
import { PaginationWithLinks } from "../pagination-with-links"
import { useQueryState } from "nuqs"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import WithdrawalCreate from "./withdrawal-create"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
import { toast } from "react-toastify"

interface IData {
  total: number
  message: string
  withdrawal: IWithdraw[]
}

interface IWithdraw {
  id: number
  amount: number
  type: string
  accountNumber: string
  message: string
  comment: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    currentBalance: number
    phone: string
  }
}

interface IUser {
  total: number
  users: {
    id: string
    name: string
  }[]
}

const getUser = async ({ text }: { text: string }) => {
  const res = await axios.get(`/api/v1/user?take=10&text=${text}`)
  return res.data
}

export default function WithdrawalList() {
  const [searchUsers, setSearchUser] = useState<string>()
  const [user, setUser] = useQueryState("user")
  const [create, setCreate] = useState(false)
  const [update, setUpdate] = useState(false)
  const [status, setStatus] = useQueryState("status")
  const searchParams = useSearchParams()
  const take = searchParams.get("take") || 50
  const page = searchParams.get("page")

  const [selectData, setSelectData] = useState<IWithdraw>()
  const [selectStatus, setSelectStatus] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [loading, setLoading] = useState(false)

  const sendData = async ({ id }: { id?: string }) => {
    try {
      if (!selectStatus && selectData?.id) {
        toast("Status and id is required for update!")
        return
      }
      setLoading(true)
      await axios.patch(`/api/v1/withdrawal?status=${selectStatus}&id=${id}`, {
        message,
      })
      setUpdate(false)
      toast("Status Update Success!")
      setLoading(false)
      setSelectStatus("")
    } catch {
      toast("Status is required for update!")
      return
    }
  }

  const { data: session } = useSession()

  const {
    data: User,
    isLoading: userLoading,
    isError: userError,
  } = useQuery<IUser>({
    queryKey: ["user", searchUsers],
    queryFn: () => getUser({ text: searchUsers ? searchUsers : "" }),
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ["withdraw", take, page, status, user],
    queryFn: () => fetchSearchResults(),
  })

  const fetchSearchResults = async (): Promise<IData> => {
    const res = await axios.get(
      `api/v1/withdrawal?take=${take}&skip=${
        page && Number(page) > 1 ? (Number(page) - 1) * Number(take) : 0
      }&status=${status ? status : ""}&user=${user ? user : ""}`
    )
    return res.data
  }

  return (
    <>
      <div className="flex gap-5 p-4">
        <Popover>
          {session?.user?.role === "ADMIN" ? (
            <PopoverTrigger>
              <Button>User Filter</Button>
            </PopoverTrigger>
          ) : (
            ""
          )}
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
                <RadioGroupItem value="PENDING" id="PENDING" />
                <Label htmlFor="PENDING">PENDING</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="APPROVE" id="APPROVE" />
                <Label htmlFor="APPROVE">APPROVE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="REJECT" id="REJECT" />
                <Label htmlFor="REJECT">REJECT</Label>
              </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>
        <Button onClick={() => setCreate(true)}>
          <CirclePlus /> Create Request
        </Button>
      </div>

      <Card>
        <CardHeader className="px-7">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Users</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {session?.user?.role === "ADMIN" ? (
                  <TableHead className="text-right">Action</TableHead>
                ) : (
                  <TableHead className="text-right">Message</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <h2>Data is loading...</h2>
                </>
              ) : isError ? (
                <>Getting error</>
              ) : data && data.total > 0 ? (
                <>
                  {data?.withdrawal.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <div className="font-medium">{v.user.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {v.user.phone}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {v.type}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant="outline">
                          {v.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDistanceToNow(new Date(v.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">{v.amount}</TableCell>
                      {session?.user?.role == "ADMIN" ? (
                        <TableCell className="text-right">
                          <Button
                            onClick={() => {
                              setUpdate(true)
                              setSelectData(v)
                            }}
                            className="cursor-pointer"
                            type="button"
                          >
                            <CircleEllipsis />
                          </Button>
                        </TableCell>
                      ) : (
                        <TableCell className="hidden sm:table-cell">
                          {v.message ? v.message : "Null"}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  <h2 className="p-5 ">Data now found at this moment</h2>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <PaginationWithLinks
            page={page ? Number(page) : 1}
            pageSize={Number(take)}
            totalCount={Number(data?.total)}
          />
        </CardFooter>
      </Card>
      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <WithdrawalCreate setCreate={setCreate} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={update} onOpenChange={setUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Withdrawals Details</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl">Account Information</h2>
                <h2>Withdrawals Amount : {selectData?.amount}</h2>
                <h2>Withdrawals Type : {selectData?.type}</h2>
                {selectData?.accountNumber ? (
                  <h2>Account Number : {selectData.accountNumber}</h2>
                ) : (
                  ""
                )}
                <h2>
                  Withdrawals Comment :
                  {selectData?.comment ? selectData.comment : "Null"}
                </h2>
                <Separator />
                <h2 className="text-xl">User Information</h2>
                <h2>User Name : {selectData?.user.name}</h2>
                <h2>User Phone : {selectData?.user.phone}</h2>
                <h2>User Balance : {selectData?.user.currentBalance}</h2>
                <h2>Write Message :- </h2>
                <Textarea
                  onChange={(v) => setMessage(v.target.value)}
                  placeholder="If any message you Write"
                />
                <h2>Select Status</h2>
                <RadioGroup
                  onValueChange={(v) => setSelectStatus(v)}
                  defaultValue={selectData?.status}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PENDING" id="PENDING" />
                    <Label htmlFor="PENDING">PENDING</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="APPROVE" id="APPROVE" />
                    <Label htmlFor="APPROVE">APPROVE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="REJECT" id="REJECT" />
                    <Label htmlFor="REJECT">REJECT</Label>
                  </div>
                </RadioGroup>
                {selectData?.status !== "APPROVE" ? (
                  <>
                    {loading ? (
                      <Button>
                        <Loader className="animate-spin" /> Loading...
                      </Button>
                    ) : (
                      <Button
                        onClick={async () =>
                          sendData({ id: selectData?.id.toString() })
                        }
                      >
                        Update Request
                      </Button>
                    )}
                  </>
                ) : (
                  <Button onClick={() => setUpdate(false)}>Close</Button>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
