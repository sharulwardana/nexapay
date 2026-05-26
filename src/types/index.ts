export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  description?: string;
  image: string;
  bannerImage?: string;
  publisher?: string;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  denominations: Denomination[];
}

export interface Denomination {
  id: string;
  productId: string;
  label: string;
  value: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  isActive: boolean;
  isPopular: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleEnd?: string;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  userId: string;
  productId: string;
  denominationId: string;
  quantity: number;
  amount: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  status: TransactionStatus;
  gameUserId?: string;
  gameServerId?: string;
  phoneNumber?: string;
  promoCode?: string;
  product?: Product;
  denomination?: Denomination;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  walletBalance: number;
  loyaltyLevel: LoyaltyLevel;
  loyaltyPoints: number;
  referralCode?: string;
}

export interface Promo {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promo';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  fee: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  message: string;
  timestamp: Date;
}

export type ProductCategory =
  | 'GAME_TOPUP'
  | 'VOUCHER'
  | 'PULSA'
  | 'PAKET_DATA'
  | 'PLN'
  | 'GIFT_CARD'
  | 'STREAMING'
  | 'EWALLET_TOPUP';

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

export type LoyaltyLevel =
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND';

export interface TopUpFormData {
  productId: string;
  denominationId: string;
  userId: string;
  serverId?: string;
  phoneNumber?: string;
  email?: string;
  paymentMethod: string;
  promoCode?: string;
}

export interface CheckoutData {
  product: Product;
  denomination: Denomination;
  paymentMethod: PaymentMethod;
  formData: TopUpFormData;
  promoDiscount: number;
  totalAmount: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalTransactions: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  transactionGrowth: number;
  userGrowth: number;
  recentTransactions: Transaction[];
  salesData: { date: string; revenue: number; transactions: number }[];
  topProducts: { name: string; revenue: number; count: number }[];
}
