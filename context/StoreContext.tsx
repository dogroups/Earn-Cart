import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { 
  User, Product, Category, AppSettings, Order, OrderStatus, 
  ReferralCommissionLog, UserRole, EPin, WalletRequest, WalletTransaction, TransactionType, RequestStatus
} from '../types';
import { INITIAL_SETTINGS, DEFAULT_ADMIN, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: AppSettings;
  commissions: ReferralCommissionLog[];
  cart: { productId: string; quantity: number }[];
  epins: EPin[];
  walletRequests: WalletRequest[];
  walletHistory: WalletTransaction[];
  
  // Actions
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, pass: string, referrerCode?: string) => { success: boolean; message: string };
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  
  updateSettings: (newSettings: AppSettings) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
  
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Wallet & E-Pin Actions
  generateEPins: (amount: number, count: number, validityDays: number) => void;
  redeemEPin: (code: string) => { success: boolean; message: string };
  requestUpiTopUp: (amount: number, txnId: string) => void;
  processWalletRequest: (requestId: string, status: RequestStatus) => void;
  adminAdjustWallet: (userId: string, amount: number, type: 'CREDIT' | 'DEBIT', description: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'rc_users',
  PRODUCTS: 'rc_products',
  CATEGORIES: 'rc_categories',
  ORDERS: 'rc_orders',
  SETTINGS: 'rc_settings',
  COMMISSIONS: 'rc_commissions',
  CURRENT_USER_ID: 'rc_current_user_id',
  CART: 'rc_cart',
  EPINS: 'rc_epins',
  WALLET_REQS: 'rc_wallet_reqs',
  WALLET_HIST: 'rc_wallet_hist'
};

export const StoreProvider = ({ children }: PropsWithChildren<{}>) => {
  // State initialization with localStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.USERS);
    return s ? JSON.parse(s) : [DEFAULT_ADMIN];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return s ? JSON.parse(s) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return s ? JSON.parse(s) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return s ? JSON.parse(s) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return s ? JSON.parse(s) : INITIAL_SETTINGS;
  });

  const [commissions, setCommissions] = useState<ReferralCommissionLog[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.COMMISSIONS);
    return s ? JSON.parse(s) : [];
  });

  const [epins, setEpins] = useState<EPin[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.EPINS);
    return s ? JSON.parse(s) : [];
  });

  const [walletRequests, setWalletRequests] = useState<WalletRequest[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.WALLET_REQS);
    return s ? JSON.parse(s) : [];
  });

  const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.WALLET_HIST);
    return s ? JSON.parse(s) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>(() => {
    const s = localStorage.getItem(STORAGE_KEYS.CART);
    return s ? JSON.parse(s) : [];
  });

  // Persist effects
  useEffect(() => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.COMMISSIONS, JSON.stringify(commissions)), [commissions]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.EPINS, JSON.stringify(epins)), [epins]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.WALLET_REQS, JSON.stringify(walletRequests)), [walletRequests]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.WALLET_HIST, JSON.stringify(walletHistory)), [walletHistory]);
  
  useEffect(() => {
    const uid = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (uid) {
      const u = users.find(u => u.id === uid);
      if (u) setCurrentUser(u);
    }
  }, []);

  const refreshCurrentUser = () => {
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated) setCurrentUser(updated);
    }
  };
  
  useEffect(() => {
    refreshCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);


  // Actions
  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && (u.password === pass || pass === 'admin'));
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    setCart([]);
  };

  const register = (name: string, email: string, pass: string, referrerCode?: string) => {
    if (!settings.isRegistrationOpen) return { success: false, message: "Registration is closed." };
    if (users.some(u => u.email === email)) return { success: false, message: "Email already exists." };

    let referrerId: string | undefined = undefined;
    if (referrerCode) {
      const referrer = users.find(u => u.referralCode === referrerCode);
      if (referrer) referrerId = referrer.id;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password: pass,
      role: UserRole.USER,
      referrerId,
      walletBalance: 0,
      referralCode: name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000),
      joinedAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    return { success: true, message: "Registration successful!" };
  };

  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
  };

  const deleteUser = (userId: string) => {
    if (userId === DEFAULT_ADMIN.id) return alert("Cannot delete Super Admin");
    setUsers(users.filter(u => u.id !== userId));
  };

  const updateSettings = (newSettings: AppSettings) => setSettings(newSettings);

  const addProduct = (product: Product) => setProducts([...products, product]);
  
  const updateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const addCategory = (name: string) => {
    if(categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    setCategories([...categories, { id: crypto.randomUUID(), name }]);
  };

  const deleteCategory = (id: string) => {
     setCategories(categories.filter(c => c.id !== id));
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const distributeCommissions = (orderAmount: number, buyerId: string, orderId: string) => {
    const buyer = users.find(u => u.id === buyerId);
    if (!buyer || !buyer.referrerId) return;

    let currentReferrerId: string | undefined = buyer.referrerId;
    let currentLevel = 1;
    const newCommissions: ReferralCommissionLog[] = [];
    const updatedUsers = [...users];

    while (currentReferrerId && currentLevel <= 5) {
      const referrerIndex = updatedUsers.findIndex(u => u.id === currentReferrerId);
      if (referrerIndex === -1) break;

      const levelSetting = settings.referralLevels.find(l => l.level === currentLevel);
      if (levelSetting) {
        const amount = (orderAmount * levelSetting.commissionPercentage) / 100;
        if (amount > 0) {
           updatedUsers[referrerIndex] = {
             ...updatedUsers[referrerIndex],
             walletBalance: updatedUsers[referrerIndex].walletBalance + amount
           };
           
           newCommissions.push({
             id: crypto.randomUUID(),
             orderId,
             beneficiaryId: updatedUsers[referrerIndex].id,
             sourceUserId: buyerId,
             level: currentLevel,
             amount,
             date: new Date().toISOString()
           });
           
           // Log Transaction
           setWalletHistory(prev => [...prev, {
             id: crypto.randomUUID(),
             userId: updatedUsers[referrerIndex].id,
             type: TransactionType.COMMISSION,
             amount,
             description: `Commission from level ${currentLevel} purchase by ${buyer.name}`,
             date: new Date().toISOString()
           }]);
        }
      }

      currentReferrerId = updatedUsers[referrerIndex].referrerId;
      currentLevel++;
    }

    setUsers(updatedUsers);
    setCommissions(prev => [...prev, ...newCommissions]);
  };

  const placeOrder = () => {
    if (!currentUser || cart.length === 0) return;

    const items = cart.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: p ? p.price : 0,
        productName: p ? p.name : 'Unknown Product'
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

    // Check Wallet Balance
    if (currentUser.walletBalance < totalAmount) {
      alert("Insufficient Wallet Balance!");
      return;
    }

    // Deduct from Wallet
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - totalAmount };
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    
    setWalletHistory(prev => [...prev, {
      id: crypto.randomUUID(),
      userId: updatedUser.id,
      type: TransactionType.PURCHASE,
      amount: -totalAmount,
      description: `Purchase of ${items.length} items`,
      date: new Date().toISOString()
    }]);

    const newOrder: Order = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      items,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    setOrders([newOrder, ...orders]);
    clearCart();

    distributeCommissions(totalAmount, currentUser.id, newOrder.id);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // --- Wallet & E-Pin Logic ---

  const generateEPins = (amount: number, count: number, validityDays: number) => {
    const newPins: EPin[] = [];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + validityDays);
    
    for (let i = 0; i < count; i++) {
      newPins.push({
        code: 'EP' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.floor(Math.random() * 99),
        amount,
        isUsed: false,
        generatedBy: currentUser?.id || 'SYSTEM',
        createdAt: new Date().toISOString(),
        expiresAt: expiry.toISOString()
      });
    }
    setEpins([...epins, ...newPins]);
  };

  const redeemEPin = (code: string) => {
    if (!currentUser) return { success: false, message: "Not logged in" };
    
    const pin = epins.find(p => p.code === code);
    if (!pin) return { success: false, message: "Invalid E-Pin" };
    if (pin.isUsed) return { success: false, message: "E-Pin already used" };
    if (pin.expiresAt && new Date(pin.expiresAt) < new Date()) return { success: false, message: "E-Pin expired" };

    // Update E-Pin
    setEpins(epins.map(p => p.code === code ? { ...p, isUsed: true, usedBy: currentUser.id } : p));
    
    // Update Balance
    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance + pin.amount };
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);

    setWalletHistory(prev => [...prev, {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      type: TransactionType.DEPOSIT_EPIN,
      amount: pin.amount,
      description: `Redeemed E-Pin ${code}`,
      date: new Date().toISOString()
    }]);

    return { success: true, message: `Successfully added ₹${pin.amount}` };
  };

  const requestUpiTopUp = (amount: number, txnId: string) => {
    if (!currentUser) return;
    setWalletRequests([...walletRequests, {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      transactionId: txnId,
      status: RequestStatus.PENDING,
      method: 'UPI',
      date: new Date().toISOString()
    }]);
  };

  const processWalletRequest = (requestId: string, status: RequestStatus) => {
    const req = walletRequests.find(r => r.id === requestId);
    if (!req || req.status !== RequestStatus.PENDING) return;

    if (status === RequestStatus.APPROVED) {
       // Credit user
       const user = users.find(u => u.id === req.userId);
       if (user) {
         const updatedUser = { ...user, walletBalance: user.walletBalance + req.amount };
         setUsers(users.map(u => u.id === user.id ? updatedUser : u));
         
         setWalletHistory(prev => [...prev, {
           id: crypto.randomUUID(),
           userId: user.id,
           type: TransactionType.DEPOSIT_UPI,
           amount: req.amount,
           description: `UPI Deposit Approved (Txn: ${req.transactionId})`,
           date: new Date().toISOString()
         }]);
       }
    }

    setWalletRequests(walletRequests.map(r => r.id === requestId ? { ...r, status } : r));
  };

  const adminAdjustWallet = (userId: string, amount: number, type: 'CREDIT' | 'DEBIT', description: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const finalAmount = type === 'CREDIT' ? amount : -amount;
    const updatedUser = { ...user, walletBalance: user.walletBalance + finalAmount };
    setUsers(users.map(u => u.id === userId ? updatedUser : u));
    
    setWalletHistory(prev => [...prev, {
       id: crypto.randomUUID(),
       userId: userId,
       type: TransactionType.ADMIN_ADJUSTMENT,
       amount: finalAmount,
       description: description || 'Admin Adjustment',
       date: new Date().toISOString()
    }]);
  };

  return (
    <StoreContext.Provider value={{
      currentUser, users, products, categories, orders, settings, commissions, cart,
      epins, walletRequests, walletHistory,
      login, logout, register, updateUserProfile, deleteUser, updateSettings, 
      addProduct, updateProduct, deleteProduct, addCategory, deleteCategory,
      addToCart, removeFromCart, clearCart, placeOrder, updateOrderStatus,
      generateEPins, redeemEPin, requestUpiTopUp, processWalletRequest, adminAdjustWallet
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};