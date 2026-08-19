// ─── Core Enums (synced with Prisma schema) ──────────────────────────

export type Role = 'USER' | 'ADMIN';

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export type LoyaltyLevel =
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND';

export type PromoType = 'PERCENTAGE' | 'FIXED';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'promo';

export type ProductCategory =
  | 'GAMES'
  | 'GAME_TOPUP'
  | 'VOUCHER'
  | 'PULSA'
  | 'PAKET_DATA'
  | 'PLN'
  | 'GIFT_CARD'
  | 'STREAMING'
  | 'EWALLET_TOPUP';

// ─── Models ──────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string | null;
  description?: string | null;
  image: string;
  bannerImage?: string | null;
  publisher?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  sortOrder?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  denominations: Denomination[];
}

export interface Denomination {
  id: string;
  productId: string;
  label: string;
  value: number;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  stock: number;
  isActive: boolean;
  isPopular: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number | null;
  flashSaleEnd?: string | Date | null;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  userId: string;
  productId?: string | null;
  productName: string;
  category: string;
  denominationId?: string | null;
  quantity: number;
  amount: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  status: TransactionStatus;
  gameUserId?: string | null;
  gameServerId?: string | null;
  phoneNumber?: string | null;
  accountNumber?: string | null;
  email?: string | null;
  targetAccount?: string | null;
  promoCode?: string | null;
  notes?: string | null;
  paymentProof?: string | null;
  paidAt?: string | Date | null;
  completedAt?: string | Date | null;
  expiresAt?: string | Date | null;
  product?: Product | null;
  denomination?: Denomination | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  walletBalance: number;
  loyaltyLevel: LoyaltyLevel;
  loyaltyPoints: number;
  referralCode?: string | null;
}

export interface Promo {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  type: PromoType;
  value: number;
  minPurchase: number;
  maxDiscount?: number | null;
  usageLimit: number;
  usageCount: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  mobileImage?: string | null;
  link?: string | null;
  position: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  image?: string | null;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string | Date | null;
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
  avatarBg?: string;
  role: string;
  rating: number;
  content: string;
  text?: string;
  verified?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  message: string;
  timestamp: Date;
}

// ─── Form / View types ───────────────────────────────────────────────

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

export interface ProductWithDenominations extends Omit<Product, 'denominations' | 'category'> {
  category: string;
  denominations: Denomination[];
}

/**
 * Product with full denomination data — used for TopUp listing page.
 */
export interface ProductWithActiveDenominations extends Omit<Product, 'denominations' | 'category'> {
  category: string;
  denominations: {
    price: number;
    isFlashSale: boolean;
  }[];
}

/**
 * Transaction with joined relations — used in admin dashboard.
 */
export interface TransactionWithRelations extends Omit<Transaction, 'product' | 'denomination'> {
  user?: { email: string | null } | null;
  product?: { name: string } | null;
  denomination?: { label: string } | null;
}
