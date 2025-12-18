
import { createClient } from '@supabase/supabase-js';
import { User, Product, Category, Order, AppSettings, ReferralCommissionLog, EPin, WalletRequest, WalletTransaction } from '../types';

/**
 * Supabase Project Details
 * URL: https://xszjkgornpwkdcahmzns.supabase.co
 * Project ID: xszjkgornpwkdcahmzns
 */
const supabaseUrl = 'https://xszjkgornpwkdcahmzns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemprZ29ybnB3a2RjYWhtem5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODcwMTksImV4cCI6MjA4MTU2MzAxOX0.vd63_ocF_XUYGmPIWXtjH6x8LJRW2sHcte7LHT2TupA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// We now consider Supabase as the primary source since keys are explicitly provided
export const IS_SUPABASE_CONNECTED = true;

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

const getLocal = <T>(key: string, fallback: T): T => {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : fallback;
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Helper to log detailed Supabase errors
 */
const logError = (context: string, error: any) => {
  console.error(`Supabase Error [${context}]:`, error.message || error);
  if (error.details) console.error("Details:", error.details);
  if (error.hint) console.error("Hint:", error.hint);
};

export const db = {
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return (data as User[]) || [];
    } catch (e) { 
      logError("Fetch Users", e);
      return getLocal(LOCAL_KEYS.USERS, []);
    }
  },

  async saveUsers(users: User[]) {
    if (users.length > 0) {
      try {
        // Ensure bankDetails is treated as a JSON object for Supabase compatibility
        const sanitizedUsers = users.map(u => ({
          ...u,
          bankDetails: u.bankDetails ? JSON.parse(JSON.stringify(u.bankDetails)) : null
        }));
        
        const { error } = await supabase.from('profiles').upsert(sanitizedUsers, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) { logError("Save Profiles", e); }
    }
    setLocal(LOCAL_KEYS.USERS, users);
  },

  async getSettings(): Promise<AppSettings | null> {
    try {
      const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      return data as AppSettings;
    } catch (e) { 
      logError("Fetch Settings", e);
      return getLocal(LOCAL_KEYS.SETTINGS, null);
    }
  },

  async saveSettings(settings: AppSettings) {
    try {
      const { error } = await supabase.from('app_settings').upsert({ id: 1, ...settings }, { onConflict: 'id' });
      if (error) throw error;
    } catch (e) { logError("Save Settings", e); }
    setLocal(LOCAL_KEYS.SETTINGS, settings);
  },

  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return (data as Product[]) || [];
    } catch (e) { 
      logError("Fetch Products", e);
      return getLocal(LOCAL_KEYS.PRODUCTS, []);
    }
  },

  async saveProducts(products: Product[]) {
    if (products.length > 0) {
      try {
        const { error } = await supabase.from('products').upsert(products, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) { logError("Save Products", e); }
    }
    setLocal(LOCAL_KEYS.PRODUCTS, products);
  },

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return (data as Category[]) || [];
    } catch (e) { 
      logError("Fetch Categories", e);
      return getLocal(LOCAL_KEYS.CATEGORIES, []);
    }
  },

  async saveCategories(cats: Category[]) {
    if (cats.length > 0) {
      try {
        const { error } = await supabase.from('categories').upsert(cats, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) { logError("Save Categories", e); }
    }
    setLocal(LOCAL_KEYS.CATEGORIES, cats);
  },

  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      return (data as Order[]) || [];
    } catch (e) { 
      logError("Fetch Orders", e);
      return getLocal(LOCAL_KEYS.ORDERS, []);
    }
  },

  async saveOrders(orders: Order[]) {
    if (orders.length > 0) {
      try {
        const { error } = await supabase.from('orders').upsert(orders, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) { logError("Save Orders", e); }
    }
    setLocal(LOCAL_KEYS.ORDERS, orders);
  },

  async getCommissions(): Promise<ReferralCommissionLog[]> {
    try {
      const { data, error } = await supabase.from('commissions').select('*');
      if (error) throw error;
      return (data as ReferralCommissionLog[]) || [];
    } catch (e) { 
      logError("Fetch Commissions", e);
      return getLocal(LOCAL_KEYS.COMMISSIONS, []);
    }
  },

  async saveCommissions(logs: ReferralCommissionLog[]) {
    if (logs.length > 0) {
      try {
        const { error } = await supabase.from('commissions').upsert(logs, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) { logError("Save Commissions", e); }
    }
    setLocal(LOCAL_KEYS.COMMISSIONS, logs);
  },

  async getEpins(): Promise<EPin[]> {
    try {
      const { data, error } = await supabase.from('epins').select('*');
      if (error) throw error;
      return (data as EPin[]) || [];
    } catch (e) { 
      logError("Fetch Epins", e);
      return getLocal(LOCAL_KEYS.EPINS, []);
    }
  },

  async saveEpins(pins: EPin[]) {
    if (pins.length > 0) {
      try {
        const { error } = await supabase.from('epins').upsert(pins, { onConflict: 'code' });
        if (error) throw error;
      } catch (e) { logError("Save Epins", e); }
    }
    setLocal(LOCAL_KEYS.EPINS, pins);
  },

  async getWalletRequests(): Promise<WalletRequest[]> {
    try {
      const { data, error } = await supabase.from('wallet_requests').select('*');
      if (error) throw error;
      return (data as WalletRequest[]) || [];
    } catch (e) { 
      logError("Fetch Wallet Requests", e);
      return getLocal(LOCAL_KEYS.WALLET_REQS, []);
    }
  },

  async saveWalletRequests(reqs: WalletRequest[]) {
    if (reqs.length > 0) {
      try {
        const { error } = await supabase.from('wallet_requests').upsert(reqs, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) { logError("Save WalletRequests", e); }
    }
    setLocal(LOCAL_KEYS.WALLET_REQS, reqs);
  },

  async getWalletHistory(): Promise<WalletTransaction[]> {
    try {
      const { data, error } = await supabase.from('wallet_history').select('*');
      if (error) throw error;
      return (data as WalletTransaction[]) || [];
    } catch (e) { 
      logError("Fetch Wallet History", e);
      return getLocal(LOCAL_KEYS.WALLET_HIST, []);
    }
  },

  async saveWalletHistory(hist: WalletTransaction[]) {
    if (hist.length > 0) {
      try {
        const { error } = await supabase.from('wallet_history').upsert(hist, { onConflict: 'id' });
        if (error) throw error;
      } catch (e) { logError("Save WalletHistory", e); }
    }
    setLocal(LOCAL_KEYS.WALLET_HIST, hist);
  }
};
