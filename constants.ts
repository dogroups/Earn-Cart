
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
  { id: '11111111-1111-1111-1111-111111111111', name: 'Electronics' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Fashion' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Home & Garden' }
];

// Mock Admin User
export const DEFAULT_ADMIN: User = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Real UUID format
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
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    description: 'High quality noise cancelling headphones.',
    imageUrl: 'https://picsum.photos/300/300?random=1',
    stock: 50
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 249.50,
    description: 'Track your fitness goals.',
    imageUrl: 'https://picsum.photos/300/300?random=2',
    stock: 30
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
    name: 'Cotton T-Shirt',
    category: 'Fashion',
    price: 29.99,
    description: '100% organic cotton, breathable fabric.',
    imageUrl: 'https://picsum.photos/300/300?random=3',
    stock: 100
  }
];
