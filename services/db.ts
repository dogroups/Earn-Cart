import { createClient } from '@supabase/supabase-js';
import { User, Product, Category, Order, AppSettings, ReferralCommissionLog, EPin, WalletRequest, WalletTransaction } from '../types';

// These are expected to be injected via environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase only if credentials exist to avoid crash
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- Mock / LocalStorage Fallback Logic ---
// This ensures the app remains functional even if DB isn't connected yet.

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getLocal = <T>(key: string, fallback: T): T => {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : fallback;
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const LOCAL_KEYS = {
  USERS: 'rc_users',
  PRODUCTS: 'rc_products',
  CATEGORIES: 'rc_categories',
  ORDERS: 'rc_orders',
  SETTINGS: 'rc_settings',
  COMMISSIONS: 'rc_commissions',
  EPINS: 'rc_epins',
  WALLET_REQS: 'rc_wallet_reqs',
  WALLET_HIST: 'rc_wallet_hist'
};

// --- Unified Database Interface ---

export const db = {
  async getUsers(): Promise<User[]> {
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error) return data as User[];
    }
    await delay(200);
    return getLocal(LOCAL_KEYS.USERS, []);
  },

  async saveUsers(users: User[]) {
    if (supabase) {
      await supabase.from('profiles').upsert(users);
    } else {
      setLocal(LOCAL_KEYS.USERS, users);
    }
  },

  async getSettings(): Promise<AppSettings | null> {
    if (supabase) {
      const { data, error } = await supabase.from('app_settings').select('*').single();
      if (!error) return data as AppSettings;
    }
    return getLocal(LOCAL_KEYS.SETTINGS, null);
  },

  async saveSettings(settings: AppSettings) {
    if (supabase) {
      await supabase.from('app_settings').upsert({ id: 1, ...settings });
    } else {
      setLocal(LOCAL_KEYS.SETTINGS, settings);
    }
  },

  async getProducts(): Promise<Product[]> {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error) return data as Product[];
    }
    return getLocal(LOCAL_KEYS.PRODUCTS, []);
  },

  async saveProducts(products: Product[]) {
    if (supabase) {
      await supabase.from('products').upsert(products);
    } else {
      setLocal(LOCAL_KEYS.PRODUCTS, products);
    }
  },

  async getCategories(): Promise<Category[]> {
    if (supabase) {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error) return data as Category[];
    }
    return getLocal(LOCAL_KEYS.CATEGORIES, []);
  },

  async saveCategories(cats: Category[]) {
    if (supabase) {
      await supabase.from('categories').upsert(cats);
    } else {
      setLocal(LOCAL_KEYS.CATEGORIES, cats);
    }
  },

  async getOrders(): Promise<Order[]> {
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error) return data as Order[];
    }
    return getLocal(LOCAL_KEYS.ORDERS, []);
  },

  async saveOrders(orders: Order[]) {
    if (supabase) {
      await supabase.from('orders').upsert(orders);
    } else {
      setLocal(LOCAL_KEYS.ORDERS, orders);
    }
  },

  async getCommissions(): Promise<ReferralCommissionLog[]> {
    if (supabase) {
      const { data, error } = await supabase.from('commissions').select('*');
      if (!error) return data as ReferralCommissionLog[];
    }
    return getLocal(LOCAL_KEYS.COMMISSIONS, []);
  },

  async saveCommissions(logs: ReferralCommissionLog[]) {
    if (supabase) {
      await supabase.from('commissions').upsert(logs);
    } else {
      setLocal(LOCAL_KEYS.COMMISSIONS, logs);
    }
  },

  async getEpins(): Promise<EPin[]> {
    if (supabase) {
      const { data, error } = await supabase.from('epins').select('*');
      if (!error) return data as EPin[];
    }
    return getLocal(LOCAL_KEYS.EPINS, []);
  },

  async saveEpins(pins: EPin[]) {
    if (supabase) {
      await supabase.from('epins').upsert(pins);
    } else {
      setLocal(LOCAL_KEYS.EPINS, pins);
    }
  },

  async getWalletRequests(): Promise<WalletRequest[]> {
    if (supabase) {
      const { data, error } = await supabase.from('wallet_requests').select('*');
      if (!error) return data as WalletRequest[];
    }
    return getLocal(LOCAL_KEYS.WALLET_REQS, []);
  },

  async saveWalletRequests(reqs: WalletRequest[]) {
    if (supabase) {
      await supabase.from('wallet_requests').upsert(reqs);
    } else {
      setLocal(LOCAL_KEYS.WALLET_REQS, reqs);
    }
  },

  async getWalletHistory(): Promise<WalletTransaction[]> {
    if (supabase) {
      const { data, error } = await supabase.from('wallet_history').select('*');
      if (!error) return data as WalletTransaction[];
    }
    return getLocal(LOCAL_KEYS.WALLET_HIST, []);
  },

  async saveWalletHistory(hist: WalletTransaction[]) {
    if (supabase) {
      await supabase.from('wallet_history').upsert(hist);
    } else {
      setLocal(LOCAL_KEYS.WALLET_HIST, hist);
    }
  }
};