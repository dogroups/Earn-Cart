export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface BankDetails {
  accountNumber: string;
  ifsc: string;
  bankName: string;
  accountHolderName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  referrerId?: string;
  walletBalance: number;
  referralCode: string;
  joinedAt: string;
  
  // Profile Details
  mobile?: string;
  address?: string;
  panNumber?: string;
  bankDetails?: BankDetails;
  upiId?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string; // Can be URL or Base64
  stock: number;
}

export interface Category {
  id: string;
  name: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  productName: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface ReferralSetting {
  level: number;
  commissionPercentage: number;
}

export interface AppSettings {
  appName: string;
  logoUrl: string; // URL or Base64
  isRegistrationOpen: boolean;
  referralLevels: ReferralSetting[];
  adminUpiId?: string; // For users to send money
  adminUpiQrUrl?: string; // For QR Code Image
}

export interface ReferralCommissionLog {
  id: string;
  orderId: string;
  beneficiaryId: string;
  sourceUserId: string;
  level: number;
  amount: number;
  date: string;
}

// --- New Types for Wallet & E-Pins ---

export interface EPin {
  code: string;
  amount: number;
  isUsed: boolean;
  generatedBy: string; // Admin ID
  usedBy?: string; // User ID
  createdAt: string;
  expiresAt?: string;
}

export enum TransactionType {
  DEPOSIT_UPI = 'DEPOSIT_UPI',
  DEPOSIT_EPIN = 'DEPOSIT_EPIN',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT',
  PURCHASE = 'PURCHASE',
  COMMISSION = 'COMMISSION',
  WITHDRAWAL = 'WITHDRAWAL'
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface WalletRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  transactionId: string; // UPI Ref ID
  status: RequestStatus;
  date: string;
  method: 'UPI';
}