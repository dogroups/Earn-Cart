import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, CreditCard, Gift, Network, Package, LogOut,
  User as UserIcon, Plus, Minus, X, Menu, Key, Building2, MapPin, BadgeIndianRupee,
  Wallet
} from 'lucide-react';
import ReferralTree from '../components/ReferralTree';
import { TransactionType } from '../types';

export const UserPanel = () => {
  const { logout, settings, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'referrals' | 'orders' | 'profile' | 'wallet'>('shop');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={settings.logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
            <h1 className="text-xl font-bold text-gray-800">{settings.appName}</h1>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
             <button onClick={() => setActiveTab('shop')} className={`flex items-center gap-1 ${activeTab === 'shop' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                <Gift size={18} /> Shop
             </button>
             <button onClick={() => setActiveTab('cart')} className={`flex items-center gap-1 ${activeTab === 'cart' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                <ShoppingCart size={18} /> Cart
             </button>
             <button onClick={() => setActiveTab('wallet')} className={`flex items-center gap-1 ${activeTab === 'wallet' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                <Wallet size={18} /> Wallet
             </button>
             <button onClick={() => setActiveTab('referrals')} className={`flex items-center gap-1 ${activeTab === 'referrals' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                <Network size={18} /> My Team
             </button>
             <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-1 ${activeTab === 'orders' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                <Package size={18} /> Orders
             </button>
             <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-1 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                <UserIcon size={18} /> Profile
             </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
             <span className="text-gray-600">Bal: <span className="font-bold text-green-600">₹{currentUser?.walletBalance.toFixed(2)}</span></span>
             <button onClick={logout} className="text-gray-500 hover:text-red-500 flex items-center gap-1" title="Logout">
                <LogOut size={20}/> <span className="hidden lg:inline">Logout</span>
             </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setActiveTab('wallet')} className="text-sm text-gray-600 font-bold">₹{currentUser?.walletBalance.toFixed(2)}</button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 p-1">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white absolute top-full left-0 right-0 shadow-lg animate-in slide-in-from-top-5 z-40">
            <nav className="flex flex-col p-4 space-y-2">
               <button onClick={() => handleTabChange('shop')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'shop' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}>
                  <Gift size={20} /> Shop
               </button>
               <button onClick={() => handleTabChange('cart')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'cart' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}>
                  <ShoppingCart size={20} /> Cart
               </button>
               <button onClick={() => handleTabChange('wallet')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'wallet' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}>
                  <Wallet size={20} /> Wallet
               </button>
               <button onClick={() => handleTabChange('referrals')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'referrals' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}>
                  <Network size={20} /> My Team
               </button>
               <button onClick={() => handleTabChange('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}>
                  <Package size={20} /> Orders
               </button>
               <button onClick={() => handleTabChange('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}>
                  <UserIcon size={20} /> Profile
               </button>
               
               <div className="border-t pt-2 mt-2">
                 <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg">
                    <LogOut size={20} /> Logout
                 </button>
               </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
        {activeTab === 'shop' && <ShopView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'referrals' && <ReferralDashboard />}
        {activeTab === 'orders' && <MyOrders />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'wallet' && <WalletView />}
      </main>
    </div>
  );
};

const ShopView = () => {
  const { products, categories, addToCart } = useStore();
  const [catFilter, setCatFilter] = useState('All');

  const filtered = catFilter === 'All' ? products : products.filter(p => p.category === catFilter);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        <button 
          onClick={() => setCatFilter('All')} 
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${catFilter === 'All' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'}`}
        >
          All Items
        </button>
        {categories.map(c => (
           <button 
             key={c.id} 
             onClick={() => setCatFilter(c.name)} 
             className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${catFilter === c.name ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'}`}
           >
             {c.name}
           </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
            <div className="h-48 w-full bg-gray-200">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <span className="font-bold text-indigo-600">₹{product.price}</span>
              </div>
              <p className="text-gray-500 text-sm mt-1 mb-3 line-clamp-2">{product.description}</p>
              <button 
                onClick={() => addToCart(product.id)}
                className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 flex justify-center items-center gap-2"
              >
                <Plus size={16} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CartView = () => {
  const { cart, products, removeFromCart, clearCart, placeOrder } = useStore();

  const cartItems = cart.map(c => {
    const p = products.find(prod => prod.id === c.productId);
    return p ? { ...p, quantity: c.quantity } : null;
  }).filter(Boolean);

  const total = cartItems.reduce((sum, item: any) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4"/>
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden divide-y divide-gray-100">
        {cartItems.map((item: any) => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-gray-500 text-sm">₹{item.price} x {item.quantity}</p>
            </div>
            <div className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><X size={18}/></button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center bg-white p-6 rounded-lg shadow">
        <div>
          <p className="text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-indigo-600">₹{total.toFixed(2)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearCart} className="px-4 py-2 text-gray-600 hover:text-red-600">Clear</button>
          <button onClick={() => { placeOrder(); alert("Order Processed!"); }} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-medium">
            Checkout (Wallet)
          </button>
        </div>
      </div>
    </div>
  );
};

const WalletView = () => {
    const { currentUser, walletHistory, redeemEPin, requestUpiTopUp, settings, walletRequests } = useStore();
    const [addMethod, setAddMethod] = useState<'epin' | 'upi'>('epin');
    const [epinCode, setEpinCode] = useState('');
    const [upiAmount, setUpiAmount] = useState('');
    const [txnId, setTxnId] = useState('');

    const handleRedeem = () => {
        if(epinCode) {
            const res = redeemEPin(epinCode);
            alert(res.message);
            if(res.success) setEpinCode('');
        }
    };

    const handleUpiRequest = () => {
        if(upiAmount && txnId) {
            requestUpiTopUp(Number(upiAmount), txnId);
            alert("Request Sent! Admin will approve shortly.");
            setUpiAmount('');
            setTxnId('');
        }
    };

    const myHistory = walletHistory.filter(t => t.userId === currentUser?.id).reverse();
    const myRequests = walletRequests.filter(r => r.userId === currentUser?.id).reverse();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg opacity-90 mb-1">Available Balance</h3>
                    <p className="text-4xl font-bold">₹{currentUser?.walletBalance.toFixed(2)}</p>
                    <div className="mt-6 pt-4 border-t border-white/20">
                        <p className="text-sm font-semibold mb-2">Add Funds via:</p>
                        <div className="flex gap-2">
                            <button 
                              onClick={() => setAddMethod('epin')}
                              className={`flex-1 py-2 text-xs rounded font-bold transition ${addMethod === 'epin' ? 'bg-white text-indigo-600' : 'bg-white/20 hover:bg-white/30'}`}
                            >E-PIN</button>
                            <button 
                              onClick={() => setAddMethod('upi')}
                              className={`flex-1 py-2 text-xs rounded font-bold transition ${addMethod === 'upi' ? 'bg-white text-indigo-600' : 'bg-white/20 hover:bg-white/30'}`}
                            >UPI</button>
                        </div>
                    </div>
                </div>

                {/* Add Funds Form */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    {addMethod === 'epin' ? (
                        <div className="space-y-4 max-w-sm">
                            <h3 className="font-bold text-gray-800">Redeem E-Pin</h3>
                            <input 
                                className="w-full border p-3 rounded-lg font-mono tracking-widest uppercase" 
                                placeholder="ENTER E-PIN CODE"
                                value={epinCode}
                                onChange={e => setEpinCode(e.target.value)}
                            />
                            <button onClick={handleRedeem} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 w-full">
                                Redeem Now
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800">UPI Fund Request</h3>
                            <div className="bg-orange-50 p-4 rounded-lg text-sm text-orange-800 border border-orange-200 mb-4">
                                <p className="font-bold mb-2">Step 1: Send Money</p>
                                
                                {settings.adminUpiQrUrl && (
                                    <div className="mb-4 flex justify-center bg-white p-2 rounded w-fit mx-auto border">
                                        <img src={settings.adminUpiQrUrl} alt="Scan to Pay" className="h-40 w-40 object-contain" />
                                    </div>
                                )}

                                <p>Admin UPI ID: <span className="font-mono bg-white px-2 py-0.5 rounded border">{settings.adminUpiId || 'Not Configured'}</span></p>
                                <p className="mt-1 text-xs opacity-80">Scan the QR code or use the UPI ID to transfer the amount.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Amount Sent</label>
                                    <input type="number" className="w-full border p-2 rounded" placeholder="0.00" value={upiAmount} onChange={e => setUpiAmount(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Transaction ID / Ref No.</label>
                                    <input className="w-full border p-2 rounded" placeholder="UPI Ref ID" value={txnId} onChange={e => setTxnId(e.target.value)} />
                                </div>
                            </div>
                            <button onClick={handleUpiRequest} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mt-2">
                                Submit Request
                            </button>

                            <div className="mt-4 pt-4 border-t">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">My Requests</h4>
                                <div className="space-y-2">
                                    {myRequests.slice(0, 3).map((r: any) => (
                                        <div key={r.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                            <span>₹{r.amount} (Txn: {r.transactionId})</span>
                                            <span className={`font-bold ${r.status === 'APPROVED' ? 'text-green-600' : r.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}>{r.status}</span>
                                        </div>
                                    ))}
                                    {myRequests.length === 0 && <p className="text-gray-400 text-xs">No pending requests.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="font-bold text-gray-800">Wallet Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Type</th>
                                <th className="p-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myHistory.map((t: any) => (
                                <tr key={t.id}>
                                    <td className="p-3 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="p-3">{t.description}</td>
                                    <td className="p-3"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{t.type}</span></td>
                                    <td className={`p-3 text-right font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.amount >= 0 ? '+' : '-'}₹{Math.abs(t.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {myHistory.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No transactions yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ReferralDashboard = () => {
  const { currentUser, users, commissions, settings } = useStore();
  
  const myEarnings = commissions
    .filter(c => c.beneficiaryId === currentUser?.id)
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">Total Earnings</h3>
          <p className="text-4xl font-bold mt-2">₹{myEarnings.toFixed(2)}</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm opacity-80 mb-1">Your Referral Code</p>
            <div className="flex items-center gap-2 bg-white/20 p-2 rounded">
              <code className="flex-1 font-mono text-lg">{currentUser?.referralCode}</code>
              <button className="text-xs bg-white text-indigo-600 px-2 py-1 rounded" onClick={() => navigator.clipboard.writeText(currentUser?.referralCode || '')}>Copy</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-800 mb-4">Commission Structure</h3>
          <ul className="space-y-2 text-sm">
            {settings.referralLevels.map(l => (
              <li key={l.level} className="flex justify-between border-b pb-2">
                <span>Level {l.level}</span>
                <span className="font-bold text-indigo-600">{l.commissionPercentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold text-gray-800 mb-4">My Network Tree</h3>
        {/* Pass currentUser ID as root to see their downline */}
        <ReferralTree users={users} rootUserId={currentUser?.id || ''} />
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { orders, currentUser } = useStore();
  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Order History</h2>
      {myOrders.length === 0 && <p className="text-gray-500">No orders placed yet.</p>}
      {myOrders.map(order => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
           <div className="flex justify-between items-start mb-2">
             <div>
               <p className="font-bold">Order #{order.id.substring(0,8)}</p>
               <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
             </div>
             <span className={`px-2 py-1 rounded text-xs font-bold ${
               order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
             }`}>{order.status}</span>
           </div>
           <div className="space-y-1">
             {order.items.map((i: any) => (
               <div key={i.productId} className="flex justify-between text-sm">
                 <span>{i.productName} (x{i.quantity})</span>
                 <span>₹{(i.priceAtPurchase * i.quantity).toFixed(2)}</span>
               </div>
             ))}
           </div>
           <div className="mt-3 pt-2 border-t flex justify-end">
             <span className="font-bold">Total: ₹{order.totalAmount.toFixed(2)}</span>
           </div>
        </div>
      ))}
    </div>
  );
};

const ProfileView = () => {
  const { currentUser, updateUserProfile } = useStore();
  const [activeSection, setActiveSection] = useState<'info' | 'password' | 'financial'>('info');

  if (!currentUser) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden h-fit">
        <div className="p-6 bg-slate-900 text-white text-center">
          <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-3">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-bold">{currentUser.name}</h3>
          <p className="text-sm opacity-70">{currentUser.email}</p>
        </div>
        <nav className="p-2">
          <button 
            onClick={() => setActiveSection('info')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 ${activeSection === 'info' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <UserIcon size={18} /> Personal Info
          </button>
          <button 
            onClick={() => setActiveSection('financial')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 ${activeSection === 'financial' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Building2 size={18} /> Bank & UPI
          </button>
          <button 
            onClick={() => setActiveSection('password')}
            className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 ${activeSection === 'password' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Key size={18} /> Change Password
          </button>
        </nav>
      </div>

      <div className="lg:col-span-3">
        {activeSection === 'info' && <PersonalInfoForm user={currentUser} onUpdate={updateUserProfile} />}
        {activeSection === 'financial' && <FinancialForm user={currentUser} onUpdate={updateUserProfile} />}
        {activeSection === 'password' && <PasswordForm user={currentUser} onUpdate={updateUserProfile} />}
      </div>
    </div>
  );
};

const PersonalInfoForm = ({ user, onUpdate }: any) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile || '',
    address: user.address || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user.id, formData);
    alert("Profile Updated Successfully");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><UserIcon size={24} className="text-indigo-600"/> Personal Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 cursor-not-allowed" 
              readOnly
              title="Name cannot be changed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 cursor-not-allowed"
              readOnly
              title="Email cannot be changed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input 
              type="tel" 
              value={formData.mobile} 
              onChange={e => setFormData({...formData, mobile: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
          <textarea 
            rows={3}
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Enter your full address..."
          />
        </div>
        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

const FinancialForm = ({ user, onUpdate }: any) => {
  const [formData, setFormData] = useState({
    panNumber: user.panNumber || '',
    upiId: user.upiId || '',
    bankDetails: {
      accountHolderName: user.bankDetails?.accountHolderName || '',
      accountNumber: user.bankDetails?.accountNumber || '',
      bankName: user.bankDetails?.bankName || '',
      ifsc: user.bankDetails?.ifsc || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user.id, formData);
    alert("Financial Details Updated Successfully");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Building2 size={24} className="text-indigo-600"/> Bank & KYE Details</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PAN & UPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">PAN Card Number</label>
            <input 
              type="text" 
              value={formData.panNumber}
              onChange={e => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="ABCDE1234F"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UPI ID</label>
            <input 
              type="text" 
              value={formData.upiId}
              onChange={e => setFormData({...formData, upiId: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="username@bank"
            />
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Bank Account Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
              <input 
                type="text" 
                value={formData.bankDetails.accountHolderName}
                onChange={e => setFormData({
                  ...formData, 
                  bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input 
                type="text" 
                value={formData.bankDetails.bankName}
                onChange={e => setFormData({
                  ...formData, 
                  bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input 
                type="text" 
                value={formData.bankDetails.accountNumber}
                onChange={e => setFormData({
                  ...formData, 
                  bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input 
                type="text" 
                value={formData.bankDetails.ifsc}
                onChange={e => setFormData({
                  ...formData, 
                  bankDetails: { ...formData.bankDetails, ifsc: e.target.value.toUpperCase() }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Save Financial Details</button>
        </div>
      </form>
    </div>
  );
};

const PasswordForm = ({ user, onUpdate }: any) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.current !== user.password) {
      alert("Current password is incorrect");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match");
      return;
    }
    if (passwords.new.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }
    
    onUpdate(user.id, { password: passwords.new });
    setPasswords({ current: '', new: '', confirm: '' });
    alert("Password Changed Successfully");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Key size={24} className="text-indigo-600"/> Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input 
            type="password" 
            value={passwords.current}
            onChange={e => setPasswords({...passwords, current: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input 
            type="password" 
            value={passwords.new}
            onChange={e => setPasswords({...passwords, new: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input 
            type="password" 
            value={passwords.confirm}
            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="pt-4">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Update Password</button>
        </div>
      </form>
    </div>
  );
};