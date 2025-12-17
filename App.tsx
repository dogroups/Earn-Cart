
import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminPanel } from './pages/AdminPanel';
import { UserPanel } from './pages/UserPanel';
import { Auth } from './pages/Auth';
import { UserRole } from './types';
import { Loader2, Cloud, HardDrive } from 'lucide-react';

const Main = () => {
  const { currentUser, isLoading, isCloudSyncActive } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Earn Cart</h2>
        <div className="flex items-center gap-2 text-slate-400">
          {isCloudSyncActive ? <Cloud size={18} className="text-green-500" /> : <HardDrive size={18} />}
          <p className="font-medium">
            {isCloudSyncActive ? 'Establishing Cloud Connection...' : 'Initializing Local Environment...'}
          </p>
        </div>
        {!isCloudSyncActive && (
          <p className="text-xs text-slate-500 mt-4 max-w-xs">
            Supabase keys not detected. Data will be saved locally in this browser.
          </p>
        )}
      </div>
    );
  }

  if (!currentUser) {
    return <Auth />;
  }

  return currentUser.role === UserRole.ADMIN ? <AdminPanel /> : <UserPanel />;
};

function App() {
  return (
    <StoreProvider>
      <Main />
    </StoreProvider>
  );
}

export default App;
