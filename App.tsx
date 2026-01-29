
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Forms } from './pages/Forms';
import { AppState, User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User>({
    address: null,
    isConnected: false,
    role: 'Guest'
  });

  const connectWallet = async () => {
    // Check if we need to open the selector
    if (typeof window.aistudio !== 'undefined') {
       const hasKey = await window.aistudio.hasSelectedApiKey();
       if (!hasKey) {
          await window.aistudio.openSelectKey();
       }
    }

    // Mock wallet connection
    setUser({
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      isConnected: true,
      role: 'Manufacturer'
    });
    
    // Once connected, institutional users land on dashboard
    setActiveTab(AppState.DASHBOARD);
  };

  const navigate = (state: AppState) => {
    // Business rule: Only VERIFY and LANDING are accessible without a wallet
    if (!user.isConnected && ![AppState.LANDING, AppState.VERIFY].includes(state)) {
      connectWallet();
      return;
    }
    setActiveTab(state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout 
      user={user} 
      onConnect={connectWallet} 
      onNavigate={navigate}
      activeTab={activeTab}
    >
      {activeTab === AppState.LANDING && (
        <LandingPage 
          onStart={connectWallet} 
          onVerify={() => navigate(AppState.VERIFY)}
          onNavigate={navigate} 
        />
      )}

      {activeTab === AppState.DASHBOARD && (
        <Dashboard user={user} onNavigate={navigate} />
      )}

      {[AppState.ADD_PHONE, AppState.TRANSFER, AppState.TRACK, AppState.VERIFY].includes(activeTab) && (
        <Forms 
          type={activeTab} 
          user={user}
          onBack={() => navigate(user.isConnected ? AppState.DASHBOARD : AppState.LANDING)} 
        />
      )}
    </Layout>
  );
}
