export type DashboardTypeData = {
    orderStatusCounts: {
      _count: {
        _all: number;
      };
      status: 'DRAFT' | 'PENDING' | 'CANCEL' | 'DELIVERY'; // Add more statuses as needed
    }[];
    totalProducts: boolean;
    topProducts: {
      _sum: {
        quantity: number;
      };
      productId: number;
    }[];
    totalProfit: {
      _sum: {
        profit: number;
      };
    };
    pendingWithdrawals: {
      _sum: {
        amount: number;
      };
    };
    transactionSummary: any[]; // Update to specific type if you know the structure
  };
  