
import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminPanel } from './pages/AdminPanel';
import { UserPanel } from './pages/UserPanel';
import { Auth } from './pages/Auth';
import { UserRole } from './types';
import { Loader2 } from 'lucide-react';

const Main = () => {
  const { currentUser, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-indigo-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-medium animate-pulse">Connecting to Database...</p>
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
