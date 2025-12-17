import React, { useState } from 'react';
import { User } from '../types';
import { ChevronRight, ChevronDown, Wallet } from 'lucide-react';

interface ReferralTreeProps {
  users: User[];
  rootUserId: string;
}

interface TreeNodeProps {
  user: User;
  users: User[];
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ user, users, level }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Find direct recruits
  const directReferrals = users.filter(u => u.referrerId === user.id);
  const hasChildren = directReferrals.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center py-2">
        {/* Indentation guides and toggle */}
        <div className="flex items-center mr-2">
           {hasChildren ? (
             <button 
               onClick={() => setIsExpanded(!isExpanded)} 
               className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
             >
               {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
             </button>
           ) : (
             <div className="w-7"></div> /* Spacer equivalent to button width */
           )}
        </div>

        {/* User Card */}
        <div className="flex-1 flex items-center gap-4 bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow min-w-[280px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${level === 0 ? 'bg-indigo-600' : 'bg-blue-400'}`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
             <div className="flex items-center gap-2">
               <span className="font-semibold text-gray-800">{user.name}</span>
               {level === 0 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">You</span>}
               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Level {level}</span>
             </div>
             <div className="text-xs text-gray-500 flex gap-3 mt-1">
               <span>Code: {user.referralCode}</span>
               <span className="flex items-center gap-1"><Wallet size={10} /> Bal: ₹{user.walletBalance.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="ml-4 pl-4 border-l-2 border-gray-100">
          {directReferrals.map(child => (
            <TreeNode key={child.id} user={child} users={users} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralTree: React.FC<ReferralTreeProps> = ({ users, rootUserId }) => {
  const rootUser = users.find(u => u.id === rootUserId);

  if (!rootUser) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
        User not found or not logged in.
      </div>
    );
  }

  // Calculate total network size for stats
  const getNetworkSize = (parentId: string): number => {
    const children = users.filter(u => u.referrerId === parentId);
    return children.length + children.reduce((acc, child) => acc + getNetworkSize(child.id), 0);
  };

  const networkSize = getNetworkSize(rootUserId);

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="font-bold text-gray-800">Network Hierarchy</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total Downline: <strong>{networkSize}</strong>
        </span>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <TreeNode user={rootUser} users={users} level={0} />
      </div>
    </div>
  );
};

export default ReferralTree;