
import { createClient } from '@supabase/supabase-js';
import { User, Product, Category, Order, AppSettings, ReferralCommissionLog, EPin, WalletRequest, WalletTransaction } from '../types';

// These are injected via the environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const IS_SUPABASE_CONNECTED = !!supabase;

if (IS_SUPABASE_CONNECTED) {
  console.log("🚀 Supabase Connection Found. Syncing with Cloud...");
} else {
  console.warn("⚠️ Supabase Credentials Missing. Running in LocalStorage mode.");
}

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

export const db = {
  async getUsers(): Promise<User[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        return (data as User[]) || [];
      } catch (e) {
        console.error("Supabase Error [getUsers]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.USERS, []);
  },

  async saveUsers(users: User[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('profiles').upsert(users);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveUsers]:", e);
      }
    }
    setLocal(LOCAL_KEYS.USERS, users);
  },

  async getSettings(): Promise<AppSettings | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle();
        if (error) throw error;
        return data as AppSettings;
      } catch (e) {
        console.error("Supabase Error [getSettings]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.SETTINGS, null);
  },

  async saveSettings(settings: AppSettings) {
    if (supabase) {
      try {
        const { error } = await supabase.from('app_settings').upsert({ id: 1, ...settings });
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveSettings]:", e);
      }
    }
    setLocal(LOCAL_KEYS.SETTINGS, settings);
  },

  async getProducts(): Promise<Product[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        return (data as Product[]) || [];
      } catch (e) {
        console.error("Supabase Error [getProducts]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.PRODUCTS, []);
  },

  async saveProducts(products: Product[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('products').upsert(products);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveProducts]:", e);
      }
    }
    setLocal(LOCAL_KEYS.PRODUCTS, products);
  },

  async getCategories(): Promise<Category[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return (data as Category[]) || [];
      } catch (e) {
        console.error("Supabase Error [getCategories]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.CATEGORIES, []);
  },

  async saveCategories(cats: Category[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('categories').upsert(cats);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveCategories]:", e);
      }
    }
    setLocal(LOCAL_KEYS.CATEGORIES, cats);
  },

  async getOrders(): Promise<Order[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        return (data as Order[]) || [];
      } catch (e) {
        console.error("Supabase Error [getOrders]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.ORDERS, []);
  },

  async saveOrders(orders: Order[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('orders').upsert(orders);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveOrders]:", e);
      }
    }
    setLocal(LOCAL_KEYS.ORDERS, orders);
  },

  async getCommissions(): Promise<ReferralCommissionLog[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('commissions').select('*');
        if (error) throw error;
        return (data as ReferralCommissionLog[]) || [];
      } catch (e) {
        console.error("Supabase Error [getCommissions]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.COMMISSIONS, []);
  },

  async saveCommissions(logs: ReferralCommissionLog[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('commissions').upsert(logs);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveCommissions]:", e);
      }
    }
    setLocal(LOCAL_KEYS.COMMISSIONS, logs);
  },

  async getEpins(): Promise<EPin[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('epins').select('*');
        if (error) throw error;
        return (data as EPin[]) || [];
      } catch (e) {
        console.error("Supabase Error [getEpins]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.EPINS, []);
  },

  async saveEpins(pins: EPin[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('epins').upsert(pins);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveEpins]:", e);
      }
    }
    setLocal(LOCAL_KEYS.EPINS, pins);
  },

  async getWalletRequests(): Promise<WalletRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('wallet_requests').select('*');
        if (error) throw error;
        return (data as WalletRequest[]) || [];
      } catch (e) {
        console.error("Supabase Error [getWalletRequests]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.WALLET_REQS, []);
  },

  async saveWalletRequests(reqs: WalletRequest[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('wallet_requests').upsert(reqs);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveWalletRequests]:", e);
      }
    }
    setLocal(LOCAL_KEYS.WALLET_REQS, reqs);
  },

  async getWalletHistory(): Promise<WalletTransaction[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('wallet_history').select('*');
        if (error) throw error;
        return (data as WalletTransaction[]) || [];
      } catch (e) {
        console.error("Supabase Error [getWalletHistory]:", e);
      }
    }
    return getLocal(LOCAL_KEYS.WALLET_HIST, []);
  },

  async saveWalletHistory(hist: WalletTransaction[]) {
    if (supabase) {
      try {
        const { error } = await supabase.from('wallet_history').upsert(hist);
        if (error) throw error;
      } catch (e) {
        console.error("Supabase Error [saveWalletHistory]:", e);
      }
    }
    setLocal(LOCAL_KEYS.WALLET_HIST, hist);
  }
};
