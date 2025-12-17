
import { createClient } from '@supabase/supabase-js';
import { User, Product, Category, Order, AppSettings, ReferralCommissionLog, EPin, WalletRequest, WalletTransaction } from '../types';

const supabaseUrl = 'https://xszjkgornpwkdcahmzns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemprZ29ybnB3a2RjYWhtem5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODcwMTksImV4cCI6MjA4MTU2MzAxOX0.vd63_ocF_XUYGmPIWXtjH6x8LJRW2sHcte7LHT2TupA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const IS_SUPABASE_CONNECTED = true;

const getLocal = <T>(key: string, fallback: T): T => {
  const s = localStorage.getItem(key);
  if (!s) return fallback;
  try {
    const parsed = JSON.parse(s);
    return (parsed === null || parsed === undefined) ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const LOCAL_KEYS = {
  USERS: 'rc_users', PRODUCTS: 'rc_products', CATEGORIES: 'rc_categories',
  ORDERS: 'rc_orders', SETTINGS: 'rc_settings', COMMISSIONS: 'rc_commissions',
  EPINS: 'rc_epins', WALLET_REQS: 'rc_wallet_reqs', WALLET_HIST: 'rc_wallet_hist'
};

const logSupaError = (context: string, error: any) => {
  const msg = error?.message || "Unknown error";
  const code = error?.code || "No Code";
  
  // Table not found (PGRST205) or Column not found (PGRST204)
  if (code === 'PGRST205' || code === 'PGRST204' || msg.includes('relation') || msg.includes('column')) {
    const table = context.includes('User') ? 'members' : 
                 context.includes('Setting') ? 'app_settings' : 'required tables';
    
    console.warn(`⚠️ Supabase Setup Required: Table "${table}" is missing or out of sync.`);
    console.groupCollapsed(`👉 Click here for the SQL to fix this error [${context}]`);
    console.log(`Run this in your Supabase SQL Editor:`);
    console.log(`
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY, name TEXT, email TEXT UNIQUE, role TEXT, 
    referrer_id UUID, wallet_balance DECIMAL DEFAULT 0, referral_code TEXT UNIQUE, 
    joined_at TIMESTAMPTZ DEFAULT NOW(), mobile TEXT, address TEXT, 
    pan_number TEXT, upi_id TEXT, bank_details JSONB
);
CREATE TABLE IF NOT EXISTS app_settings (
    id INTEGER PRIMARY KEY, app_name TEXT, logo_url TEXT, 
    is_registration_open BOOLEAN, referral_levels JSONB, 
    admin_upi_id TEXT, admin_upi_qr_url TEXT
);
INSERT INTO app_settings (id, app_name) VALUES (1, 'Earn Cart') ON CONFLICT (id) DO NOTHING;
    `);
    console.groupEnd();
  } else {
    console.error(`❌ Supabase Error [${context}]: ${msg} (Code: ${code})`);
  }
};

/**
 * MAPPING UTILITIES
 */
const mapToDb = (obj: any, table?: string): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const mapped: any = {};
  for (const key in obj) {
    // Password should never go to the cloud for security and to avoid schema errors
    if (key === 'password') continue;

    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    mapped[snakeKey] = obj[key];
  }
  return mapped;
};

const mapFromDb = (obj: any): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const mapped: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
    mapped[camelKey] = obj[key];
  }
  return mapped;
};

export const db = {
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase.from('members').select('*');
      if (error) throw error;
      return (data || []).map(mapFromDb) as User[];
    } catch (e: any) {
      logSupaError('getUsers', e);
      return getLocal(LOCAL_KEYS.USERS, []);
    }
  },

  async saveUsers(users: User[]) {
    try {
      const sanitized = (users || []).map(u => {
        const mapped = mapToDb(u, 'members');
        if (!mapped.referrer_id || String(mapped.referrer_id).length < 10) {
          mapped.referrer_id = null;
        }
        return mapped;
      });
      const { error } = await supabase.from('members').upsert(sanitized);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveUsers', e);
    }
    setLocal(LOCAL_KEYS.USERS, users);
  },

  async getSettings(): Promise<AppSettings | null> {
    try {
      const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      return data ? mapFromDb(data) : null;
    } catch (e: any) {
      logSupaError('getSettings', e);
      return getLocal(LOCAL_KEYS.SETTINGS, null);
    }
  },

  async saveSettings(settings: AppSettings) {
    try {
      const mapped = mapToDb(settings, 'app_settings');
      const { error } = await supabase.from('app_settings').upsert({ ...mapped, id: 1 });
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveSettings', e);
    }
    setLocal(LOCAL_KEYS.SETTINGS, settings);
  },

  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return (data || []).map(mapFromDb) as Product[];
    } catch (e: any) {
      logSupaError('getProducts', e);
      return getLocal(LOCAL_KEYS.PRODUCTS, []);
    }
  },

  async saveProducts(products: Product[]) {
    try {
      const mapped = (products || []).map(p => mapToDb(p, 'products'));
      const { error } = await supabase.from('products').upsert(mapped);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveProducts', e);
    }
    setLocal(LOCAL_KEYS.PRODUCTS, products);
  },

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return (data || []).map(mapFromDb) as Category[];
    } catch (e: any) {
      logSupaError('getCategories', e);
      return getLocal(LOCAL_KEYS.CATEGORIES, []);
    }
  },

  async saveCategories(cats: Category[]) {
    try {
      const mapped = (cats || []).map(c => mapToDb(c, 'categories'));
      const { error } = await supabase.from('categories').upsert(mapped);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveCategories', e);
    }
    setLocal(LOCAL_KEYS.CATEGORIES, cats);
  },

  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapFromDb) as Order[];
    } catch (e: any) {
      logSupaError('getOrders', e);
      return getLocal(LOCAL_KEYS.ORDERS, []);
    }
  },

  async saveOrders(orders: Order[]) {
    try {
      const mapped = (orders || []).map(o => mapToDb(o, 'orders'));
      const { error } = await supabase.from('orders').upsert(mapped);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveOrders', e);
    }
    setLocal(LOCAL_KEYS.ORDERS, orders);
  },

  async getCommissions(): Promise<ReferralCommissionLog[]> {
    try {
      const { data, error } = await supabase.from('commissions').select('*');
      if (error) throw error;
      return (data || []).map(mapFromDb) as ReferralCommissionLog[];
    } catch (e: any) {
      logSupaError('getCommissions', e);
      return getLocal(LOCAL_KEYS.COMMISSIONS, []);
    }
  },

  async saveCommissions(logs: ReferralCommissionLog[]) {
    try {
      const mapped = (logs || []).map(l => mapToDb(l, 'commissions'));
      const { error } = await supabase.from('commissions').upsert(mapped);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveCommissions', e);
    }
    setLocal(LOCAL_KEYS.COMMISSIONS, logs);
  },

  async getEpins(): Promise<EPin[]> {
    try {
      const { data, error } = await supabase.from('epins').select('*');
      if (error) throw error;
      return (data || []).map(mapFromDb) as EPin[];
    } catch (e: any) {
      logSupaError('getEpins', e);
      return getLocal(LOCAL_KEYS.EPINS, []);
    }
  },

  async saveEpins(pins: EPin[]) {
    try {
      const mapped = (pins || []).map(p => mapToDb(p, 'epins'));
      const { error } = await supabase.from('epins').upsert(mapped);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveEpins', e);
    }
    setLocal(LOCAL_KEYS.EPINS, pins);
  },

  async getWalletRequests(): Promise<WalletRequest[]> {
    try {
      const { data, error } = await supabase.from('wallet_requests').select('*');
      if (error) throw error;
      return (data || []).map(mapFromDb) as WalletRequest[];
    } catch (e: any) {
      logSupaError('getWalletRequests', e);
      return getLocal(LOCAL_KEYS.WALLET_REQS, []);
    }
  },

  async saveWalletRequests(reqs: WalletRequest[]) {
    try {
      const mapped = (reqs || []).map(r => mapToDb(r, 'wallet_requests'));
      const { error } = await supabase.from('wallet_requests').upsert(mapped);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveWalletRequests', e);
    }
    setLocal(LOCAL_KEYS.WALLET_REQS, reqs);
  },

  async getWalletHistory(): Promise<WalletTransaction[]> {
    try {
      const { data, error } = await supabase.from('wallet_history').select('*');
      if (error) throw error;
      return (data || []).map(mapFromDb) as WalletTransaction[];
    } catch (e: any) {
      logSupaError('getWalletHistory', e);
      return getLocal(LOCAL_KEYS.WALLET_HIST, []);
    }
  },

  async saveWalletHistory(hist: WalletTransaction[]) {
    try {
      const mapped = (hist || []).map(h => mapToDb(h, 'wallet_history'));
      const { error } = await supabase.from('wallet_history').upsert(mapped);
      if (error) throw error;
    } catch (e: any) {
      logSupaError('saveWalletHistory', e);
    }
    setLocal(LOCAL_KEYS.WALLET_HIST, hist);
  }
};
