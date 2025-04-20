export type DashboardData = {
  orderStatusCounts: OrderStatusCount[];
  topProducts: TopProduct[];
  topUsers: TopUser[];
  pendingWithdrawals: PendingWithdrawals;
  recentOrders: RecentOrder[];
};

type OrderStatusCount = {
  _count: {
    _all: number;
  };
  _sum: {
    sellPrice?: number;
    totalPrice?: number;
    profit: number;
  };
  status: "CANCEL" | "DELIVERY" | "PENDING" | "DRAFT" // Extendable if new statuses appear
};

type TopProduct = {
  id: number;
  name: string;
  about: string;
  image: string | null;
  price: number;
  byPrice: number;
  maxPrice: number;
  suggestPrice: number;
  status: "ACTIVE" | "INACTIVE" | string;
  userId: string;
  courierId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type TopUser = {
  id: string;
  name: string;
  phone: string;
  image: string | null;
  paymentType: string | null;
  paymentNumber: string | null;
  payOutAmount: number;
  totalOrderAmount: number;
  currentBalance: number;
  deliveryCharge: number;
  status: "ACTIVE" | "INACTIVE" | string;
  roles: "USER" | "ADMIN" | string;
  createdAt: string;
  updatedAt: string;
  _count: {
    order: number;
  };
};

type PendingWithdrawals = {
  _sum: {
    amount: number;
  };
};

type RecentOrder = {
  id: number;
  name: string;
  phone: string;
  address: string;
  district: string;
  note: string | null;
  consignment_id: string;
  tracking_code: string;
  isDelivery: boolean;
  totalPrice: number;
  sellPrice: number;
  delivery: number;
  profit: number;
  status: "CANCEL" | "DELIVERY" | "PENDING" | "DRAFT" | string;
  courierId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
