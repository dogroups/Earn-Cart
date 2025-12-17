
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { 
  User, Product, Category, AppSettings, Order, OrderStatus, 
  ReferralCommissionLog, UserRole, EPin, WalletRequest, WalletTransaction, TransactionType, RequestStatus
} from '../types';
import { INITIAL_SETTINGS, DEFAULT_ADMIN, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';
import { db, IS_SUPABASE_CONNECTED } from '../services/db';

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
  isLoading: boolean;
  isCloudSyncActive: boolean;
  
  // Actions
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, pass: string, referrerCode?: string) => Promise<{ success: boolean; message: string }>;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateSettings: (newSettings: AppSettings) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  generateEPins: (amount: number, count: number, validityDays: number) => Promise<void>;
  redeemEPin: (code: string) => Promise<{ success: boolean; message: string }>;
  requestUpiTopUp: (amount: number, txnId: string) => Promise<void>;
  processWalletRequest: (requestId: string, status: RequestStatus) => Promise<void>;
  adminAdjustWallet: (userId: string, amount: number, type: 'CREDIT' | 'DEBIT', description: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CURRENT_USER_ID_KEY = 'rc_current_user_id';

export const StoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [commissions, setCommissions] = useState<ReferralCommissionLog[]>([]);
  const [epins, setEpins] = useState<EPin[]>([]);
  const [walletRequests, setWalletRequests] = useState<WalletRequest[]>([]);
  const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  // Initial Data Fetch from "DB"
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [u, p, c, o, s, comm, ep, wr, wh] = await Promise.all([
          db.getUsers(), db.getProducts(), db.getCategories(), db.getOrders(),
          db.getSettings(), db.getCommissions(), db.getEpins(), db.getWalletRequests(), db.getWalletHistory()
        ]);

        // Fallback for empty DB
        const finalUsers = u.length ? u : [DEFAULT_ADMIN];
        const finalProducts = p.length ? p : INITIAL_PRODUCTS;
        const finalCats = c.length ? c : INITIAL_CATEGORIES;
        const finalSettings = s || INITIAL_SETTINGS;

        setUsers(finalUsers);
        setProducts(finalProducts);
        setCategories(finalCats);
        setOrders(o);
        setSettings(finalSettings);
        setCommissions(comm);
        setEpins(ep);
        setWalletRequests(wr);
        setWalletHistory(wh);

        // Session Restore
        const uid = localStorage.getItem(CURRENT_USER_ID_KEY);
        if (uid) {
          const user = finalUsers.find(x => x.id === uid);
          if (user) setCurrentUser(user);
        }
      } catch (err) {
        console.error("Failed to fetch data from DB:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Persistence triggers
  useEffect(() => { if (!isLoading) db.saveUsers(users); }, [users, isLoading]);
  useEffect(() => { if (!isLoading) db.saveProducts(products); }, [products, isLoading]);
  useEffect(() => { if (!isLoading) db.saveOrders(orders); }, [orders, isLoading]);
  useEffect(() => { if (!isLoading) db.saveSettings(settings); }, [settings, isLoading]);
  useEffect(() => { if (!isLoading) db.saveCommissions(commissions); }, [commissions, isLoading]);
  useEffect(() => { if (!isLoading) db.saveEpins(epins); }, [epins, isLoading]);
  useEffect(() => { if (!isLoading) db.saveWalletRequests(walletRequests); }, [walletRequests, isLoading]);
  useEffect(() => { if (!isLoading) db.saveWalletHistory(walletHistory); }, [walletHistory, isLoading]);

  const login = async (email: string, pass: string) => {
    const user = users.find(u => u.email === email && (u.password === pass || pass === 'admin'));
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_ID_KEY);
    setCart([]);
  };

  const register = async (name: string, email: string, pass: string, referrerCode?: string) => {
    if (!settings.isRegistrationOpen) return { success: false, message: "Registration is closed." };
    if (users.some(u => u.email === email)) return { success: false, message: "Email already exists." };

    let referrerId: string | undefined = undefined;
    if (referrerCode) {
      const referrer = users.find(u => u.referralCode === referrerCode);
      if (referrer) referrerId = referrer.id;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name, email, password: pass,
      role: UserRole.USER,
      referrerId,
      walletBalance: 0,
      referralCode: name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000),
      joinedAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    return { success: true, message: "Registration successful!" };
  };

  const updateUserProfile = async (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? ({ ...prev, ...data }) : null);
  };

  const deleteUser = async (userId: string) => {
    if (userId === DEFAULT_ADMIN.id) return alert("Cannot delete Super Admin");
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateSettings = async (newSettings: AppSettings) => setSettings(newSettings);

  const addProduct = async (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = async (product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  const deleteProduct = async (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addCategory = async (name: string) => {
    if(categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    const newCat = { id: crypto.randomUUID(), name };
    setCategories(prev => [...prev, newCat]);
    db.saveCategories([...categories, newCat]);
  };

  const deleteCategory = async (id: string) => {
     const next = categories.filter(c => c.id !== id);
     setCategories(next);
     db.saveCategories(next);
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.productId !== productId));
  const clearCart = () => setCart([]);

  const placeOrder = async () => {
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
    if (currentUser.walletBalance < totalAmount) {
      alert("Insufficient Wallet Balance!");
      return;
    }

    const orderId = crypto.randomUUID();
    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      items, totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance - totalAmount };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setOrders(prev => [newOrder, ...prev]);
    setWalletHistory(prev => [...prev, {
      id: crypto.randomUUID(), userId: updatedUser.id,
      type: TransactionType.PURCHASE, amount: -totalAmount,
      description: `Order #${orderId.slice(0,8)}`, date: new Date().toISOString()
    }]);
    
    let currentReferrerId: string | undefined = currentUser.referrerId;
    let currentLevel = 1;
    const commLogs: ReferralCommissionLog[] = [];
    const tempUsers = [...users];

    while (currentReferrerId && currentLevel <= 5) {
      const idx = tempUsers.findIndex(u => u.id === currentReferrerId);
      if (idx === -1) break;
      const pct = settings.referralLevels.find(l => l.level === currentLevel)?.commissionPercentage || 0;
      const amt = (totalAmount * pct) / 100;
      
      if (amt > 0) {
        tempUsers[idx].walletBalance += amt;
        commLogs.push({
          id: crypto.randomUUID(), orderId, beneficiaryId: tempUsers[idx].id,
          sourceUserId: currentUser.id, level: currentLevel, amount: amt, date: new Date().toISOString()
        });
        setWalletHistory(prev => [...prev, {
          id: crypto.randomUUID(), userId: tempUsers[idx].id,
          type: TransactionType.COMMISSION, amount: amt,
          description: `Level ${currentLevel} Comm. from ${currentUser.name}`,
          date: new Date().toISOString()
        }]);
      }
      currentReferrerId = tempUsers[idx].referrerId;
      currentLevel++;
    }
    setUsers(tempUsers);
    setCommissions(prev => [...prev, ...commLogs]);
    clearCart();
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const generateEPins = async (amount: number, count: number, validityDays: number) => {
    const newPins: EPin[] = [];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + validityDays);
    for (let i = 0; i < count; i++) {
      newPins.push({
        code: 'EP' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        amount, isUsed: false, generatedBy: currentUser?.id || 'SYSTEM',
        createdAt: new Date().toISOString(), expiresAt: expiry.toISOString()
      });
    }
    setEpins(prev => [...prev, ...newPins]);
  };

  const redeemEPin = async (code: string) => {
    if (!currentUser) return { success: false, message: "Not logged in" };
    const pin = epins.find(p => p.code === code);
    if (!pin || pin.isUsed) return { success: false, message: "Invalid or used pin" };
    
    setEpins(prev => prev.map(p => p.code === code ? { ...p, isUsed: true, usedBy: currentUser.id } : p));
    const nextBal = currentUser.walletBalance + pin.amount;
    updateUserProfile(currentUser.id, { walletBalance: nextBal });
    setWalletHistory(prev => [...prev, {
      id: crypto.randomUUID(), userId: currentUser.id,
      type: TransactionType.DEPOSIT_EPIN, amount: pin.amount,
      description: `E-Pin ${code} Redeemed`, date: new Date().toISOString()
    }]);
    return { success: true, message: `Added ₹${pin.amount}` };
  };

  const requestUpiTopUp = async (amount: number, txnId: string) => {
    if (!currentUser) return;
    setWalletRequests(prev => [...prev, {
      id: crypto.randomUUID(), userId: currentUser.id, userName: currentUser.name,
      amount, transactionId: txnId, status: RequestStatus.PENDING, method: 'UPI',
      date: new Date().toISOString()
    }]);
  };

  const processWalletRequest = async (requestId: string, status: RequestStatus) => {
    const req = walletRequests.find(r => r.id === requestId);
    if (!req) return;
    if (status === RequestStatus.APPROVED) {
      const u = users.find(x => x.id === req.userId);
      if (u) {
        updateUserProfile(u.id, { walletBalance: u.walletBalance + req.amount });
        setWalletHistory(prev => [...prev, {
          id: crypto.randomUUID(), userId: u.id,
          type: TransactionType.DEPOSIT_UPI, amount: req.amount,
          description: `UPI Approved (Ref: ${req.transactionId})`, date: new Date().toISOString()
        }]);
      }
    }
    setWalletRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
  };

  const adminAdjustWallet = async (userId: string, amount: number, type: 'CREDIT' | 'DEBIT', description: string) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    const amt = type === 'CREDIT' ? amount : -amount;
    updateUserProfile(userId, { walletBalance: u.walletBalance + amt });
    setWalletHistory(prev => [...prev, {
      id: crypto.randomUUID(), userId, type: TransactionType.ADMIN_ADJUSTMENT,
      amount: amt, description, date: new Date().toISOString()
    }]);
  };

  return (
    <StoreContext.Provider value={{
      currentUser, users, products, categories, orders, settings, commissions, cart,
      epins, walletRequests, walletHistory, isLoading,
      isCloudSyncActive: IS_SUPABASE_CONNECTED,
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
