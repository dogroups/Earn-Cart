
import React, { useState } from 'react';
import { User as UserIcon, Building2, Key, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ProfileViewProps {
  user: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const { updateUserProfile } = useStore();
  const [activeSection, setActiveSection] = useState<'info' | 'password' | 'financial'>('info');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden h-fit">
        <div className="p-6 bg-slate-900 text-white text-center">
          <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-sm opacity-70">{user.email}</p>
          <div className="mt-2 text-xs bg-white/20 inline-block px-2 py-1 rounded">
            Role: {user.role}
          </div>
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
        {activeSection === 'info' && <PersonalInfoForm user={user} onUpdate={updateUserProfile} />}
        {activeSection === 'financial' && <FinancialForm user={user} onUpdate={updateUserProfile} />}
        {activeSection === 'password' && <PasswordForm user={user} onUpdate={updateUserProfile} />}
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
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Building2 size={24} className="text-indigo-600"/> Bank & KYC Details</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
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
