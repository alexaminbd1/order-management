type OrderSummary = {
  totalOrder: number
  totalDelivery: number
  totalPending: number
  totalCancel: number
  totalDraft: number
}

export type OrderType = {
  id: number
  name: string
  phone: string
  address: string
  district: string
  note: string | null
  consignment_id: string | null
  tracking_code: string | null
  isDelivery: boolean
  totalPrice: number
  sellPrice: number
  delivery: number
  profit: number
  status: string
  courierId: number | null
  userId: string
  createdAt: string
  updatedAt: string
}

type Withdrawal = {
  id: number
  amount: number
  type: string // You can extend more types as needed
  accountNumber: string
  comment: string
  message: string | null
  status: string // Adjust as per possible statuses
  userId: string
  updateUser: string | null
  createdAt: string
  updatedAt: string
}

type UserRecent = {
  id: string
  name: string
  phone: string
  image: string | null
  paymentType: string | null
  paymentNumber: string | null
  payOutAmount: number
  totalOrderAmount: number
  currentBalance: number
  deliveryCharge: number | null
  status: string
  roles: string
  createdAt: string
  order: OrderType[]
  withdrawal: Withdrawal[]
}

export type SingleUserType = {
  message: string
  details: {
    orderSummary: OrderSummary
    userRecent: UserRecent
  }
}
