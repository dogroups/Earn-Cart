
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Users, ShoppingBag, Settings, Network, DollarSign, Package, 
  Trash2, Plus, Edit2, CheckCircle, XCircle, Wand2, LogOut, Menu, X,
  Key, Wallet, ArrowDownCircle, ArrowUpCircle, User as UserIcon,
  Cloud, HardDrive, RefreshCcw, TrendingUp, ChevronRight, Percent,
  Copy, Share2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateProductDescription } from '../services/geminiService';
import ReferralTree from '../components/ReferralTree';
import { ProfileView } from '../components/ProfileView';
import { Product, User, RequestStatus, OrderStatus, AppSettings, ReferralSetting, EPin } from '../types';

export const AdminPanel = () => {
  const { 
    settings, updateSettings, products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, deleteCategory, orders, updateOrderStatus, users, 
    commissions, currentUser, logout, generateEPins, epins, walletRequests, 
    processWalletRequest, adminAdjustWallet, deleteUser, updateUserProfile,
    isCloudSyncActive, forceCloudSync
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'shop' | 'commissions' | 'customers' | 'referrals' | 'wallet' | 'settings' | 'profile'>('stats');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleManualSync = async () => {
    if(confirm("This will push all current data to Supabase. Continue?")) {
      setIsSyncing(true);
      await forceCloudSync();
      setIsSyncing(false);
    }
  };

  const NavItems = () => (
    <>
      <NavButton active={activeTab === 'stats'} onClick={() => handleNavClick('stats')} icon={<DollarSign size={20}/>} label="Dashboard" />
      <NavButton active={activeTab === 'shop'} onClick={() => handleNavClick('shop')} icon={<ShoppingBag size={20}/>} label="Shop Settings" />
      <NavButton active={activeTab === 'commissions'} onClick={() => handleNavClick('commissions')} icon={<Percent size={20}/>} label="Commission Tiers" />
      <NavButton active={activeTab === 'wallet'} onClick={() => handleNavClick('wallet')} icon={<Wallet size={20}/>} label="Wallet & E-Pins" />
      <NavButton active={activeTab === 'referrals'} onClick={() => handleNavClick('referrals')} icon={<Network size={20}/>} label="Referral Tree" />
      <NavButton active={activeTab === 'customers'} onClick={() => handleNavClick('customers')} icon={<Users size={20}/>} label="Customers" />
      <NavButton active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} icon={<Settings size={20}/>} label="App Settings" />
      <NavButton active={activeTab === 'profile'} onClick={() => handleNavClick('profile')} icon={<UserIcon size={20}/>} label="My Profile" />
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 h-16 flex items-center border-b border-slate-800">
           <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center">A</div>
            <span>Admin Panel</span>
           </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItems />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Global Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-bold text-gray-800 capitalize">
              {activeTab === 'stats' ? 'Dashboard Overview' : activeTab.replace(/([A-Z])/g, ' $1')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isCloudSyncActive && (
              <button 
                onClick={handleManualSync}
                disabled={isSyncing}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <RefreshCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Syncing...' : 'Sync Cloud'}
              </button>
            )}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCloudSyncActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
              {isCloudSyncActive ? <Cloud size={12} /> : <HardDrive size={12} />}
              {isCloudSyncActive ? 'Cloud Active' : 'Local Storage'}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border">
              <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{currentUser?.name}</span>
            </div>
            <button 
              onClick={logout} 
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-slate-900/50 backdrop-blur-sm z-30" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-slate-900 p-4 shadow-xl" onClick={e => e.stopPropagation()}>
              <nav className="space-y-2">
                <NavItems />
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeTab === 'stats' && <DashboardStats orders={orders || []} commissions={commissions || []} users={users || []} />}
            {activeTab === 'shop' && (
               <ShopSettings 
                 products={products || []} 
                 categories={categories || []} 
                 orders={orders || []} 
                 onAddProduct={addProduct} 
                 onUpdateProduct={updateProduct} 
                 onDeleteProduct={deleteProduct} 
                 onAddCategory={addCategory} 
                 onDeleteCategory={deleteCategory}
                 onUpdateStatus={updateOrderStatus} 
               />
            )}
            {activeTab === 'commissions' && <CommissionTierSettings settings={settings} onUpdate={updateSettings} />}
            {activeTab === 'settings' && <AppSettingsPanel settings={settings} onUpdate={updateSettings} isCloudSyncActive={isCloudSyncActive} />}
            {activeTab === 'customers' && (
               <CustomerList 
                 users={users || []} 
                 onDelete={deleteUser} 
                 onUpdate={updateUserProfile} 
                 onAdjustWallet={adminAdjustWallet} 
               />
            )}
            {activeTab === 'referrals' && <ReferralTree users={users || []} rootUserId={currentUser?.id || ''} />}
            {activeTab === 'wallet' && (
               <WalletSettings 
                 epins={epins || []} 
                 onGenerate={generateEPins} 
                 requests={walletRequests || []} 
                 onProcessRequest={processWalletRequest} 
               />
            )}
            {activeTab === 'profile' && currentUser && <ProfileView user={currentUser} />}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const CommissionTierSettings = ({ settings, onUpdate }: any) => {
  const [form, setForm] = useState<AppSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleLevelChange = (levelNum: number, value: number) => {
    const updatedLevels = (form.referralLevels || []).map(lvl => 
      lvl.level === levelNum ? { ...lvl, commissionPercentage: value } : lvl
    );
    setForm({ ...form, referralLevels: updatedLevels });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(form);
    setIsSaving(false);
    alert("Commission structure updated successfully!");
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
              <Percent size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Referral Commission Structure</h2>
              <p className="text-gray-500 text-sm">Configure how much each level earns from downline purchases.</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-8 py-5 text-xs font-black uppercase text-gray-500 tracking-wider">Depth Level</th>
                  <th className="px-8 py-5 text-xs font-black uppercase text-gray-500 tracking-wider text-right">Commission Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(form.referralLevels || []).sort((a,b) => a.level - b.level).map((lvl) => (
                  <tr key={lvl.level} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg">
                          {lvl.level}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Level {lvl.level}</p>
                          <p className="text-xs text-gray-400 font-medium">Depth Tier {lvl.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={lvl.commissionPercentage}
                          onChange={(e) => handleLevelChange(lvl.level, Number(e.target.value))}
                          className="w-32 border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-right font-black text-lg shadow-sm transition-all focus:ring-4 focus:ring-indigo-50"
                        />
                        <span className="text-gray-400 font-black text-xl">%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
            <div className="text-amber-500 pt-1"><XCircle size={20} className="rotate-45" /></div>
            <div>
              <p className="text-sm font-bold text-amber-900">Important Note</p>
              <p className="text-xs text-amber-700 mt-1">Changes to commission tiers are applied instantly to all new orders.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <RefreshCcw size={20} className="animate-spin" /> : <CheckCircle size={20} />}
              {isSaving ? 'Updating...' : 'Save Structure'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ orders, commissions, users }: any) => {
  const ords = Array.isArray(orders) ? orders : [];
  const comms = Array.isArray(commissions) ? commissions : [];
  
  const totalRevenue = ords.filter(o => o.status !== 'CANCELLED').reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
  const totalCommission = comms.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
  
  const salesData = ords.slice(0, 10).map((o: any) => ({
    name: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A',
    amount: o.totalAmount || 0
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} color="bg-green-600" />
        <StatCard title="Commissions Paid" value={`₹${totalCommission.toFixed(2)}`} color="bg-indigo-600" />
        <StatCard title="Total Users" value={Array.isArray(users) ? users.length : 0} color="bg-orange-600" />
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Sales Activity</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: any) => (
  <div className={`${color} text-white p-6 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] duration-200`}>
    <h3 className="text-sm opacity-80 uppercase tracking-widest font-bold">{title}</h3>
    <p className="text-4xl font-black mt-3">{value}</p>
  </div>
);

const ShopSettings = ({ products, categories, orders, onAddProduct, onUpdateProduct, onDeleteProduct, onAddCategory, onDeleteCategory, onUpdateStatus }: any) => {
  const [view, setView] = useState<'products' | 'categories' | 'orders'>('products');
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = () => {
    if(newCatName.trim()) {
      onAddCategory(newCatName);
      setNewCatName('');
    }
  };

  const prods = Array.isArray(products) ? products : [];
  const cats = Array.isArray(categories) ? categories : [];
  const ords = Array.isArray(orders) ? orders : [];

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-200/50 p-1 rounded-xl w-fit">
        <button onClick={() => setView('products')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Products</button>
        <button onClick={() => setView('categories')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'categories' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Categories</button>
        <button onClick={() => setView('orders')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'orders' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Orders</button>
      </div>

      {view === 'categories' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
           <div>
             <h3 className="font-bold text-gray-800 text-lg mb-4">Manage Categories</h3>
             <div className="flex gap-2 max-w-md">
               <input 
                 className="flex-1 border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all" 
                 placeholder="Category Name" 
                 value={newCatName}
                 onChange={e => setNewCatName(e.target.value)}
               />
               <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Add</button>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {cats.map((c: any) => (
               <div key={c.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 group">
                 <span className="font-medium text-gray-700">{c.name}</span>
                 <button onClick={() => onDeleteCategory(c.id)} className="text-gray-400 group-hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={18}/></button>
               </div>
             ))}
           </div>
        </div>
      )}

      {view === 'products' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold text-gray-800">Product Catalog</h3>
             <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
               <Plus size={20} /> Add Product
             </button>
           </div>
           
           {(isAdding || isEditing) && (
             <ProductForm 
               product={isEditing} 
               categories={cats}
               onSave={(p: any) => {
                 if (isEditing) onUpdateProduct(p);
                 else onAddProduct({ ...p, id: crypto.randomUUID() });
                 setIsAdding(false);
                 setIsEditing(null);
               }}
               onCancel={() => { setIsAdding(false); setIsEditing(null); }}
             />
           )}

           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50/50">
                   <tr className="border-b border-gray-100">
                     <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                     <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                     <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                     <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                     <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {prods.map((p: any) => (
                     <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                       <td className="p-4 font-semibold flex items-center gap-4 text-gray-800">
                          <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover border border-gray-100" alt="" />
                          {p.name}
                       </td>
                       <td className="p-4 text-sm text-gray-500"><span className="px-2.5 py-1 bg-gray-100 rounded-lg">{p.category}</span></td>
                       <td className="p-4 font-bold text-gray-800">₹{p.price}</td>
                       <td className="p-4">
                         <span className={`text-sm font-bold ${p.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                           {p.stock} units
                         </span>
                       </td>
                       <td className="p-4 flex gap-2">
                         <button onClick={() => setIsEditing(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={18}/></button>
                         <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}
      
      {view === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Order Management</h3>
          <div className="grid gap-4">
            {ords.map((order: any) => (
              <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-indigo-200 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <span className="text-xs text-gray-400">• {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 mb-2">{order.userName}</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(order.items) && order.items.map((i:any) => (
                      <span key={i.productId} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md uppercase">{i.quantity}x {i.productName}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-none">
                  <p className="font-black text-2xl text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>{order.status}</span>
                    
                    {order.status !== 'DELIVERED' && (
                      <button 
                        onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                        className="text-xs font-bold bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ product, categories, onSave, onCancel }: any) => {
  const cats = Array.isArray(categories) ? categories : [];
  const [form, setForm] = useState(product || { name: '', category: cats[0]?.name || '', price: 0, stock: 0, description: '', imageUrl: '' });
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiGenerate = async () => {
    if (!form.name || !form.category) return alert("Please enter name and category first");
    setLoadingAi(true);
    const desc = await generateProductDescription(form.name, form.category);
    setForm({ ...form, description: desc });
    setLoadingAi(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 mb-8 animate-in zoom-in-95 duration-200">
      <h4 className="font-black text-xl mb-6 text-gray-800">{product ? 'Update Item' : 'Create New Item'}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Product Title</label>
          <input className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none" placeholder="e.g. Pro Headphones" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
          <select className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {cats.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Price (₹)</label>
          <input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stock Level</label>
          <input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none" placeholder="Units available" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
        </div>
        
        <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Product Media</label>
            <div className="flex items-center gap-6 p-4 border-2 border-dashed border-gray-200 rounded-2xl">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0" />}
            </div>
        </div>

        <div className="md:col-span-2 relative space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Marketing Description</label>
          <textarea className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none h-32" placeholder="Write details or use AI..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button 
             onClick={handleAiGenerate} 
             disabled={loadingAi}
             className="absolute bottom-4 right-4 text-xs font-bold bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 shadow-md transition-all active:scale-95"
          >
            <Wand2 size={14} /> {loadingAi ? 'AI Thinking...' : 'AI Writer'}
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8 border-t pt-6">
        <button onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-800">Dismiss</button>
        <button onClick={() => onSave(form)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Publish Item</button>
      </div>
    </div>
  );
};

const AppSettingsPanel = ({ settings, onUpdate, isCloudSyncActive }: any) => {
  const [form, setForm] = useState<AppSettings>(settings);
  
  const handleSave = () => {
    onUpdate(form);
    alert("Configurations updated!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, adminUpiQrUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Global Configuration</h2>
            <p className="text-gray-500 text-sm">Fine-tune your platform's core identity and operations.</p>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
              <Settings size={20} className="text-indigo-600" /> General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Platform Name</label>
                <input 
                  type="text" 
                  value={form.appName} 
                  onChange={e => setForm({...form, appName: e.target.value})}
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Admin UPI ID</label>
                <input 
                  type="text" 
                  value={form.adminUpiId || ''} 
                  onChange={e => setForm({...form, adminUpiId: e.target.value})}
                  className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none"
                  placeholder="payment@upi"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Platform Logo</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-white file:text-indigo-700 shadow-sm"/>
                        {form.logoUrl && <img src={form.logoUrl} alt="Logo" className="h-10 w-10 object-contain flex-shrink-0" />}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Payment QR Code</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                        <input type="file" accept="image/*" onChange={handleQrUpload} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-white file:text-indigo-700 shadow-sm"/>
                        {form.adminUpiQrUrl && <img src={form.adminUpiQrUrl} alt="QR" className="h-10 w-10 object-contain border bg-white rounded flex-shrink-0" />}
                    </div>
                </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div>
              <h4 className="font-bold text-indigo-900">Open for Registration</h4>
              <p className="text-xs text-indigo-600">Toggle public access for new user accounts.</p>
            </div>
            <button 
              onClick={() => setForm({...form, isRegistrationOpen: !form.isRegistrationOpen})}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${form.isRegistrationOpen ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition shadow-sm ${form.isRegistrationOpen ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="pt-4">
            <button onClick={handleSave} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]">Save All Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerList = ({ users, onDelete, onUpdate, onAdjustWallet }: any) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [walletModal, setWalletModal] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if(editingUser) {
        onUpdate(editingUser.id, editingUser);
        setEditingUser(null);
    }
  };

  const handleWalletAdjust = (type: 'CREDIT' | 'DEBIT') => {
      if(walletModal && amount) {
          onAdjustWallet(walletModal.id, Number(amount), type, desc);
          setWalletModal(null);
          setAmount('');
          setDesc('');
      }
  };

  const usrs = Array.isArray(users) ? users : [];

  return (
  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-800">User Management</h3>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{usrs.length} Total Users</span>
    </div>
    
    <div className="overflow-x-auto">
        <table className="w-full text-left">
        <thead className="bg-gray-50/50">
            <tr>
            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Member</th>
            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Assets</th>
            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Management</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
            {usrs.map((u: any) => (
            <tr key={u.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-500">{u.email}</div>
                  <div className="text-[10px] text-gray-400 font-bold">{u.mobile || 'No Phone'}</div>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-black text-gray-800">₹{(u.walletBalance || 0).toFixed(2)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingUser(u)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Profile"><Edit2 size={18}/></button>
                    <button onClick={() => setWalletModal(u)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Adjust Balance"><Wallet size={18}/></button>
                    {u.role !== 'ADMIN' && <button onClick={() => onDelete(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Terminate User"><Trash2 size={18}/></button>}
                  </div>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>

    {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4" onClick={() => setEditingUser(null)}>
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <h3 className="font-black text-2xl mb-6 text-gray-900 border-b pb-4">Update Account</h3>
                <form onSubmit={handleEditSave} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                      <input className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-indigo-500" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email</label>
                      <input className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-indigo-500" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Mobile</label>
                      <input className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-indigo-500" value={editingUser.mobile || ''} onChange={e => setEditingUser({...editingUser, mobile: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-2 font-bold text-gray-500">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    )}

    {walletModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4" onClick={() => setWalletModal(null)}>
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-3 bg-green-100 text-green-700 rounded-2xl"><Wallet size={24}/></div>
                   <h3 className="font-black text-2xl text-gray-900">Wallet Control</h3>
                </div>
                <p className="text-sm text-gray-500 mb-8 ml-1">{walletModal.name}'s balance: <span className="font-bold text-indigo-600">₹{(walletModal.walletBalance || 0).toFixed(2)}</span></p>
                <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Amount (INR)</label>
                      <input type="number" className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-green-500 font-black text-xl" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Note</label>
                      <input className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-green-500" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Reason for adjustment" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <button onClick={() => handleWalletAdjust('CREDIT')} className="bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"><ArrowUpCircle size={20}/> Add</button>
                        <button onClick={() => handleWalletAdjust('DEBIT')} className="bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"><ArrowDownCircle size={20}/> Deduct</button>
                    </div>
                    <button onClick={() => setWalletModal(null)} className="w-full text-center text-gray-400 pt-4 font-bold hover:text-gray-600 transition-colors">Dismiss</button>
                </div>
            </div>
        </div>
    )}
  </div>
  );
};

const WalletSettings = ({ epins, onGenerate, requests, onProcessRequest }: any) => {
    const [genAmount, setGenAmount] = useState('');
    const [genCount, setGenCount] = useState('');
    const [validity, setValidity] = useState('30');
    const [tab, setTab] = useState<'epins' | 'requests'>('epins');

    const handleGenerate = () => {
        if(genAmount && genCount) {
            onGenerate(Number(genAmount), Number(genCount), Number(validity));
            alert("Digital tokens minted!");
            setGenAmount('');
            setGenCount('');
        }
    };

    const handleCopy = (code: string) => {
      navigator.clipboard.writeText(code);
      alert("E-Pin copied to clipboard!");
    };

    const handleShare = async (pin: EPin) => {
      const shareData = {
        title: 'Earn Cart E-Pin',
        text: `Here is your Earn Cart E-Pin for ₹${pin.amount}: ${pin.code}`,
        url: window.location.origin
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          handleCopy(pin.code);
          alert("Sharing not supported. Code copied.");
        }
      } catch (err) {
        console.error("Error sharing:", err);
      }
    };

    const pins = Array.isArray(epins) ? epins : [];
    const reqs = Array.isArray(requests) ? requests : [];

    return (
        <div className="space-y-8">
            <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-2xl w-fit">
                <button onClick={() => setTab('epins')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tab === 'epins' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-800'}`}>Token Manager</button>
                <button onClick={() => setTab('requests')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${tab === 'requests' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-800'}`}>Deposit Queue</button>
            </div>

            {tab === 'epins' ? (
                <div className="space-y-8 animate-in slide-in-from-left-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <div className="border-b pb-4">
                          <h3 className="font-black text-xl text-gray-800">E-Pin Minting</h3>
                          <p className="text-sm text-gray-500">Generate high-security credit tokens for offline distribution.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Value (₹)</label>
                                <input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-indigo-500 font-bold" placeholder="500" value={genAmount} onChange={e => setGenAmount(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Quantity</label>
                                <input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-indigo-500 font-bold" placeholder="10" value={genCount} onChange={e => setGenCount(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Life span (Days)</label>
                                <input type="number" className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-indigo-500 font-bold" value={validity} onChange={e => setValidity(e.target.value)} />
                            </div>
                            <button onClick={handleGenerate} className="bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all">Generate</button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                           <h3 className="font-black text-xl text-gray-800">Active Token Registry</h3>
                        </div>
                        <div className="overflow-x-auto max-h-[600px]">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 sticky top-0">
                                    <tr>
                                        <th className="p-4 text-xs font-bold uppercase text-gray-500">Secure Code</th>
                                        <th className="p-4 text-xs font-bold uppercase text-gray-500">Asset Value</th>
                                        <th className="p-4 text-xs font-bold uppercase text-gray-500">Availability</th>
                                        <th className="p-4 text-xs font-bold uppercase text-gray-500">Expires</th>
                                        <th className="p-4 text-xs font-bold uppercase text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {pins.slice().reverse().map((pin: any) => (
                                        <tr key={pin.code} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-black text-indigo-700 tracking-widest uppercase">{pin.code}</td>
                                            <td className="p-4 font-black text-gray-800">₹{pin.amount}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${pin.isUsed ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                    {pin.isUsed ? 'Voided' : 'Valid'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[10px] font-bold text-gray-400 uppercase">{pin.expiresAt ? new Date(pin.expiresAt).toLocaleDateString() : 'Perpetual'}</td>
                                            <td className="p-4">
                                              {!pin.isUsed && (
                                                <div className="flex gap-2">
                                                  <button onClick={() => handleCopy(pin.code)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy"><Copy size={16}/></button>
                                                  <button onClick={() => handleShare(pin)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Share"><Share2 size={16}/></button>
                                                </div>
                                              )}
                                            </td>
                                        </tr>
                                    ))}
                                    {pins.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">Registry is empty.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-right-4">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-black text-xl text-gray-800">Approval Workflow</h3>
                        <p className="text-sm text-gray-500">Review and reconcile incoming manual transfers.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50/50">
                              <tr>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Applicant</th>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Payment ID</th>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Funds</th>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Status</th>
                                  <th className="p-4 text-xs font-bold uppercase text-gray-500">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                              {reqs.map((req: any) => (
                                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="p-4 font-bold text-gray-800">{req.userName}</td>
                                      <td className="p-4 font-black text-xs text-indigo-600 tracking-tighter">{req.transactionId}</td>
                                      <td className="p-4 font-black text-gray-900">₹{req.amount}</td>
                                      <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                          req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                          req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                          {req.status}
                                        </span>
                                      </td>
                                      <td className="p-4">
                                          {req.status === 'PENDING' ? (
                                              <div className="flex gap-2">
                                                  <button onClick={() => onProcessRequest(req.id, RequestStatus.APPROVED)} className="bg-green-600 text-white p-2 rounded-xl shadow-sm hover:bg-green-700 transition-colors"><CheckCircle size={18}/></button>
                                                  <button onClick={() => onProcessRequest(req.id, RequestStatus.REJECTED)} className="bg-red-600 text-white p-2 rounded-xl shadow-sm hover:bg-red-700 transition-colors"><XCircle size={18}/></button>
                                              </div>
                                          ) : <span className="text-xs text-gray-300 font-bold italic">Closed</span>}
                                      </td>
                                  </tr>
                              ))}
                              {reqs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No pending requests found.</td></tr>}
                          </tbody>
                      </table>
                    </div>
                </div>
            )}
        </div>
    );
};
