type User = {
  id: string
  name: string
  phone: string
  image: string | null
  password: string
  paymentType: string | null
  paymentNumber: string | null
  payOutAmount: number
  totalOrderAmount: number
  currentBalance: number
  deliveryCharge: number | null
  status: "ACTIVE" | "INACTIVE"
  roles: "ADMIN" | "USER"
  createdAt: string
  updatedAt: string
}

export type Item = {
  id: number
  quantity: number
  price: number
  orderId: number
  productId: number
  product: {
    id: number
    name: string
    price: number
  }
}

type Courier = {
  id: number
  charge: number
  name: string
  apiKey: string
  secretKey: string
}

type OrderDetails = {
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
  status: string // Modify based on your possible statuses
  userId: string
  createdAt: string
  updatedAt: string
  user: User
  courier: Courier | null
  items: Item[]
}

export type IData = {
  orderDetails: OrderDetails
}
