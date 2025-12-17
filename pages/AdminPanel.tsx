import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Users, ShoppingBag, Settings, Network, DollarSign, Package, 
  Trash2, Plus, Edit2, CheckCircle, XCircle, Wand2, LogOut, Menu, X,
  Key, Wallet, ArrowDownCircle, ArrowUpCircle, AlertCircle, Upload, QrCode
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateProductDescription } from '../services/geminiService';
import ReferralTree from '../components/ReferralTree';
import { Product, User, RequestStatus } from '../types';

export const AdminPanel = () => {
  const { 
    settings, updateSettings, products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, deleteCategory, orders, updateOrderStatus, users, 
    commissions, currentUser, logout, generateEPins, epins, walletRequests, 
    processWalletRequest, adminAdjustWallet, deleteUser, updateUserProfile 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'shop' | 'settings' | 'customers' | 'referrals' | 'wallet'>('stats');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const NavItems = () => (
    <>
      <NavButton active={activeTab === 'stats'} onClick={() => handleNavClick('stats')} icon={<DollarSign size={20}/>} label="Dashboard" />
      <NavButton active={activeTab === 'shop'} onClick={() => handleNavClick('shop')} icon={<ShoppingBag size={20}/>} label="Shop Settings" />
      <NavButton active={activeTab === 'wallet'} onClick={() => handleNavClick('wallet')} icon={<Wallet size={20}/>} label="Wallet & E-Pins" />
      <NavButton active={activeTab === 'referrals'} onClick={() => handleNavClick('referrals')} icon={<Network size={20}/>} label="Referral System" />
      <NavButton active={activeTab === 'customers'} onClick={() => handleNavClick('customers')} icon={<Users size={20}/>} label="Customers" />
      <NavButton active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} icon={<Settings size={20}/>} label="App Settings" />
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-2 font-bold text-xl">
           <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center">A</div>
           <span>Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-slate-800 z-10 p-4 overflow-y-auto animate-in slide-in-from-top-2">
          <nav className="space-y-2">
            <NavItems />
            <div className="border-t border-slate-700 my-4 pt-4">
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-700 transition-colors">
                <LogOut size={20} /> <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
           <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center">A</div>
            <span>Admin Panel</span>
           </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItems />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 pt-20 md:pt-6">
        {activeTab === 'stats' && <DashboardStats orders={orders} commissions={commissions} users={users} />}
        {activeTab === 'shop' && (
           <ShopSettings 
             products={products} 
             categories={categories} 
             orders={orders} 
             onAddProduct={addProduct} 
             onUpdateProduct={updateProduct} 
             onDeleteProduct={deleteProduct} 
             onAddCategory={addCategory} 
             onDeleteCategory={deleteCategory}
             onUpdateStatus={updateOrderStatus} 
           />
        )}
        {activeTab === 'settings' && <AppSettingsPanel settings={settings} onUpdate={updateSettings} />}
        {activeTab === 'customers' && (
           <CustomerList 
             users={users} 
             onDelete={deleteUser} 
             onUpdate={updateUserProfile} 
             onAdjustWallet={adminAdjustWallet} 
           />
        )}
        {activeTab === 'referrals' && <ReferralSettingsPanel settings={settings} onUpdate={updateSettings} commissions={commissions} users={users} rootId={currentUser?.id || ''} />}
        {activeTab === 'wallet' && (
           <WalletSettings 
             epins={epins} 
             onGenerate={generateEPins} 
             requests={walletRequests} 
             onProcessRequest={processWalletRequest} 
           />
        )}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const DashboardStats = ({ orders, commissions, users }: any) => {
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
  const totalCommission = commissions.reduce((sum: number, c: any) => sum + c.amount, 0);
  
  const salesData = orders.slice(0, 10).map((o: any) => ({
    name: new Date(o.createdAt).toLocaleDateString(),
    amount: o.totalAmount
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} color="bg-green-500" />
        <StatCard title="Commissions Paid" value={`₹${totalCommission.toFixed(2)}`} color="bg-indigo-500" />
        <StatCard title="Total Users" value={users.length} color="bg-orange-500" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Recent Sales Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: any) => (
  <div className={`${color} text-white p-6 rounded-xl shadow-lg`}>
    <h3 className="text-sm opacity-90 uppercase tracking-wider font-semibold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
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

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2 overflow-x-auto">
        <button onClick={() => setView('products')} className={`pb-2 px-1 whitespace-nowrap ${view === 'products' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Products</button>
        <button onClick={() => setView('categories')} className={`pb-2 px-1 whitespace-nowrap ${view === 'categories' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Categories</button>
        <button onClick={() => setView('orders')} className={`pb-2 px-1 whitespace-nowrap ${view === 'orders' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Orders & Delivery</button>
      </div>

      {view === 'categories' && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
           <h3 className="font-bold text-lg">Manage Categories</h3>
           <div className="flex gap-2 max-w-md">
             <input 
               className="border p-2 rounded flex-1" 
               placeholder="New Category Name" 
               value={newCatName}
               onChange={e => setNewCatName(e.target.value)}
             />
             <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             {categories.map((c: any) => (
               <div key={c.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                 <span>{c.name}</span>
                 <button onClick={() => onDeleteCategory(c.id)} className="text-red-500 hover:bg-red-100 p-1 rounded"><Trash2 size={16}/></button>
               </div>
             ))}
           </div>
        </div>
      )}

      {view === 'products' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold">Inventory</h3>
             <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
               <Plus size={16} /> Add Product
             </button>
           </div>
           
           {(isAdding || isEditing) && (
             <ProductForm 
               product={isEditing} 
               categories={categories}
               onSave={(p) => {
                 if (isEditing) onUpdateProduct(p);
                 else onAddProduct({ ...p, id: crypto.randomUUID() });
                 setIsAdding(false);
                 setIsEditing(null);
               }}
               onCancel={() => { setIsAdding(false); setIsEditing(null); }}
             />
           )}

           <div className="bg-white rounded-lg shadow overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="p-4 text-sm font-semibold text-gray-600">Product</th>
                   <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                   <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
                   <th className="p-4 text-sm font-semibold text-gray-600">Stock</th>
                   <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {products.map((p: any) => (
                   <tr key={p.id} className="hover:bg-gray-50">
                     <td className="p-4 font-medium flex items-center gap-3">
                        <img src={p.imageUrl} className="w-10 h-10 rounded object-cover border" alt="" />
                        {p.name}
                     </td>
                     <td className="p-4 text-gray-500">{p.category}</td>
                     <td className="p-4">₹{p.price}</td>
                     <td className="p-4">{p.stock}</td>
                     <td className="p-4 flex gap-2">
                       <button onClick={() => setIsEditing(p)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16}/></button>
                       <button onClick={() => onDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
      
      {view === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Management</h3>
          <div className="grid gap-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">By {order.userName} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  <div className="mt-1">
                    {order.items.map((i:any) => (
                      <span key={i.productId} className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">{i.quantity}x {i.productName}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{order.totalAmount.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>{order.status}</span>
                    
                    {order.status !== 'DELIVERED' && (
                      <button 
                        onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Confirm Delivery
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
  const [form, setForm] = useState(product || { name: '', category: categories[0]?.name || '', price: 0, stock: 0, description: '', imageUrl: '' });
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
    <div className="bg-white p-6 rounded-lg shadow-lg border border-indigo-100 mb-6">
      <h4 className="font-bold mb-4">{product ? 'Edit Product' : 'New Product'}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <select className="border p-2 rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          {categories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <input type="number" className="border p-2 rounded" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
        <input type="number" className="border p-2 rounded" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
        
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="h-12 w-12 rounded object-cover border" />}
            </div>
        </div>

        <div className="md:col-span-2 relative">
          <textarea className="border p-2 rounded w-full h-24" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button 
             onClick={handleAiGenerate} 
             disabled={loadingAi}
             className="absolute bottom-2 right-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200"
          >
            <Wand2 size={12} /> {loadingAi ? 'Generating...' : 'AI Generate'}
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600">Cancel</button>
        <button onClick={() => onSave(form)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Product</button>
      </div>
    </div>
  );
};

const AppSettingsPanel = ({ settings, onUpdate }: any) => {
  const [form, setForm] = useState(settings);
  
  const handleSave = () => {
    onUpdate(form);
    alert("Settings Saved!");
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
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Application Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">App Name</label>
          <input 
            type="text" 
            value={form.appName} 
            onChange={e => setForm({...form, appName: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    {form.logoUrl && <img src={form.logoUrl} alt="Logo Preview" className="h-10 w-10 object-contain" />}
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin UPI QR Code</label>
                <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleQrUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    {form.adminUpiQrUrl && <img src={form.adminUpiQrUrl} alt="QR Preview" className="h-10 w-10 object-contain border rounded" />}
                </div>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Admin UPI ID (For Wallet Requests)</label>
          <input 
            type="text" 
            value={form.adminUpiId || ''} 
            onChange={e => setForm({...form, adminUpiId: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            placeholder="admin@upi"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">User Registration</h4>
            <p className="text-sm text-gray-500">Allow new users to sign up.</p>
          </div>
          <button 
            onClick={() => setForm({...form, isRegistrationOpen: !form.isRegistrationOpen})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${form.isRegistrationOpen ? 'bg-green-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.isRegistrationOpen ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="pt-4">
          <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">Save Changes</button>
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

  return (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-bold">Registered Customers</h3>
    </div>
    
    <div className="overflow-x-auto">
        <table className="w-full text-left">
        <thead className="bg-gray-50">
            <tr>
            <th className="p-4 text-sm text-gray-600">Name</th>
            <th className="p-4 text-sm text-gray-600">Email</th>
            <th className="p-4 text-sm text-gray-600">Role</th>
            <th className="p-4 text-sm text-gray-600">Wallet</th>
            <th className="p-4 text-sm text-gray-600">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {users.map((u: any) => (
            <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4"><span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">{u.role}</span></td>
                <td className="p-4 font-mono">₹{u.walletBalance.toFixed(2)}</td>
                <td className="p-4 flex gap-2">
                    <button onClick={() => setEditingUser(u)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Edit"><Edit2 size={18}/></button>
                    <button onClick={() => setWalletModal(u)} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Manage Wallet"><Wallet size={18}/></button>
                    <button onClick={() => onDelete(u.id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Delete"><Trash2 size={18}/></button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>

    {/* Edit User Modal */}
    {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="font-bold text-lg mb-4">Edit User</h3>
                <form onSubmit={handleEditSave} className="space-y-3">
                    <input className="border p-2 w-full rounded" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} placeholder="Name" />
                    <input className="border p-2 w-full rounded" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} placeholder="Email" />
                    <input className="border p-2 w-full rounded" value={editingUser.mobile || ''} onChange={e => setEditingUser({...editingUser, mobile: e.target.value})} placeholder="Mobile" />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )}

    {/* Wallet Management Modal */}
    {walletModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="font-bold text-lg mb-2">Manage Wallet: {walletModal.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Current Balance: ₹{walletModal.walletBalance.toFixed(2)}</p>
                <div className="space-y-3">
                    <input type="number" className="border p-2 w-full rounded" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
                    <input className="border p-2 w-full rounded" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Reason / Description" />
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => handleWalletAdjust('CREDIT')} className="flex-1 bg-green-600 text-white py-2 rounded flex justify-center gap-2"><ArrowUpCircle/> Credit</button>
                        <button onClick={() => handleWalletAdjust('DEBIT')} className="flex-1 bg-red-600 text-white py-2 rounded flex justify-center gap-2"><ArrowDownCircle/> Debit</button>
                    </div>
                    <button onClick={() => setWalletModal(null)} className="w-full text-center text-gray-500 mt-2 text-sm">Cancel</button>
                </div>
            </div>
        </div>
    )}
  </div>
  );
};

const ReferralSettingsPanel = ({ settings, onUpdate, commissions, users, rootId }: any) => {
  const [levels, setLevels] = useState(settings.referralLevels);

  const handleLevelChange = (lvl: number, val: number) => {
    setLevels(levels.map((l: any) => l.level === lvl ? { ...l, commissionPercentage: val } : l));
  };

  const saveLevels = () => {
    onUpdate({ ...settings, referralLevels: levels });
    alert("Commission rates updated!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Commission Rates (Multi-Level)</h3>
          <div className="space-y-3">
            {levels.map((l: any) => (
              <div key={l.level} className="flex items-center gap-4">
                <span className="w-20 font-medium text-gray-600">Level {l.level}</span>
                <input 
                  type="number" 
                  value={l.commissionPercentage} 
                  onChange={e => handleLevelChange(l.level, Number(e.target.value))}
                  className="border p-2 rounded w-24"
                />
                <span className="text-gray-500">%</span>
              </div>
            ))}
            <button onClick={saveLevels} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Update Rates</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Referral Tree (Preview)</h3>
          <ReferralTree users={users} rootUserId={rootId} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Recent Commission Payouts</h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Beneficiary</th>
              <th className="p-3">Source User</th>
              <th className="p-3">Level</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
             {commissions.slice(0, 5).map((c: any) => (
               <tr key={c.id}>
                 <td className="p-3">{users.find((u:any) => u.id === c.beneficiaryId)?.name || 'Unknown'}</td>
                 <td className="p-3">{users.find((u:any) => u.id === c.sourceUserId)?.name || 'Unknown'}</td>
                 <td className="p-3">{c.level}</td>
                 <td className="p-3 font-bold text-green-600">+₹{c.amount.toFixed(2)}</td>
                 <td className="p-3 text-gray-500">{new Date(c.date).toLocaleDateString()}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
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
            alert("E-Pins Generated!");
            setGenAmount('');
            setGenCount('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b pb-2">
                <button onClick={() => setTab('epins')} className={`pb-2 ${tab === 'epins' ? 'border-b-2 border-indigo-600 font-bold' : 'text-gray-500'}`}>E-Pins Management</button>
                <button onClick={() => setTab('requests')} className={`pb-2 ${tab === 'requests' ? 'border-b-2 border-indigo-600 font-bold' : 'text-gray-500'}`}>Wallet Requests</button>
            </div>

            {tab === 'epins' ? (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold text-lg mb-4">Generate E-Pins</h3>
                        <div className="flex gap-4 items-end flex-wrap">
                            <div>
                                <label className="block text-sm text-gray-600">Amount (₹)</label>
                                <input type="number" className="border p-2 rounded w-32" value={genAmount} onChange={e => setGenAmount(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Count</label>
                                <input type="number" className="border p-2 rounded w-24" value={genCount} onChange={e => setGenCount(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Validity (Days)</label>
                                <input type="number" className="border p-2 rounded w-24" value={validity} onChange={e => setValidity(e.target.value)} />
                            </div>
                            <button onClick={handleGenerate} className="bg-indigo-600 text-white px-6 py-2 rounded h-10">Generate</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-bold text-lg mb-4">E-Pin List</h3>
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="p-3">Code</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Created</th>
                                        <th className="p-3">Expires</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {epins.slice().reverse().map((pin: any) => (
                                        <tr key={pin.code} className="border-t">
                                            <td className="p-3 font-mono">{pin.code}</td>
                                            <td className="p-3">₹{pin.amount}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs ${pin.isUsed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {pin.isUsed ? 'USED' : 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="p-3">{new Date(pin.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3">{pin.expiresAt ? new Date(pin.expiresAt).toLocaleDateString() : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Pending Wallet Requests (UPI)</h3>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">User</th>
                                <th className="p-3">Txn ID</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req: any) => (
                                <tr key={req.id} className="border-t">
                                    <td className="p-3">{req.userName}</td>
                                    <td className="p-3 font-mono text-sm">{req.transactionId}</td>
                                    <td className="p-3 font-bold">₹{req.amount}</td>
                                    <td className="p-3 text-sm text-gray-500">{new Date(req.date).toLocaleDateString()}</td>
                                    <td className="p-3"><span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{req.status}</span></td>
                                    <td className="p-3">
                                        {req.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => onProcessRequest(req.id, RequestStatus.APPROVED)} className="bg-green-600 text-white p-1 rounded"><CheckCircle size={16}/></button>
                                                <button onClick={() => onProcessRequest(req.id, RequestStatus.REJECTED)} className="bg-red-600 text-white p-1 rounded"><XCircle size={16}/></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-gray-500">No requests found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};