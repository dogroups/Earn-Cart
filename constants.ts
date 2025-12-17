import { AppSettings, UserRole, User, Product, Category } from './types';

export const INITIAL_SETTINGS: AppSettings = {
  appName: 'Earn Cart',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
  isRegistrationOpen: true,
  referralLevels: [
    { level: 1, commissionPercentage: 10 },
    { level: 2, commissionPercentage: 5 },
    { level: 3, commissionPercentage: 3 },
    { level: 4, commissionPercentage: 2 },
    { level: 5, commissionPercentage: 1 },
  ]
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Electronics' },
  { id: 'cat_2', name: 'Fashion' },
  { id: 'cat_3', name: 'Home & Garden' }
];

// Mock Admin User
export const DEFAULT_ADMIN: User = {
  id: 'admin_001',
  name: 'Super Admin',
  email: 'admin@test.com',
  password: 'admin',
  role: UserRole.ADMIN,
  walletBalance: 0,
  referralCode: 'ADMIN1',
  joinedAt: new Date().toISOString()
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    description: 'High quality noise cancelling headphones.',
    imageUrl: 'https://picsum.photos/300/300?random=1',
    stock: 50
  },
  {
    id: 'p2',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 249.50,
    description: 'Track your fitness goals.',
    imageUrl: 'https://picsum.photos/300/300?random=2',
    stock: 30
  },
  {
    id: 'p3',
    name: 'Cotton T-Shirt',
    category: 'Fashion',
    price: 29.99,
    description: '100% organic cotton, breathable fabric.',
    imageUrl: 'https://picsum.photos/300/300?random=3',
    stock: 100
  }
];