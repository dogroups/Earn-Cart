import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminPanel } from './pages/AdminPanel';
import { UserPanel } from './pages/UserPanel';
import { Auth } from './pages/Auth';
import { UserRole } from './types';

const Main = () => {
  const { currentUser } = useStore();

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