export type DashboardData = {
  orderStatusCounts: {
    _count: {
      _all: number
    }
    _sum: {
      sellPrice: number
      totalPrice: number
      profit: number
    }
    status: string
  }[]
  topProducts: {
    id: number
    name: string
    about: string
    image: string | null
    price: number
    byPrice: number
    maxPrice: number
    suggestPrice: number
    status: string
    userId: string
    courierId: number
    createdAt: string
    updatedAt: string
  }[]
  topUsers: {
    id: string
    name: string
    phone: string
    image: string | null
    paymentType: string | null
    paymentNumber: string | null
    payOutAmount: number
    totalOrderAmount: number
    currentBalance: number
    deliveryCharge: number
    status: string
    roles: string
    createdAt: string
    updatedAt: string
    _count: {
      order: number
    }
  }[]
  pendingWithdrawals: {
    _sum: {
      amount: number
    }
  }
  recentOrders: {
    id: number
    name: string
    phone: string
    address: string
    district: string
    note: string | null
    consignment_id: string
    tracking_code: string
    isDelivery: boolean
    totalPrice: number
    sellPrice: number
    delivery: number
    profit: number
    status: string
    courierId: number
    userId: string
    createdAt: string
    updatedAt: string
  }[]
}
