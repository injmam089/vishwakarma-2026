import React, { useState } from 'react';
import { MonitoringProvider, useMonitoring } from './context/MonitoringContext';
import { TopBar } from './components/common/TopBar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNavigation } from './components/common/MobileNavigation';
import { OverviewView } from './components/dashboard/OverviewView';
import { LiveView } from './components/live/LiveView';
import { HistoryView } from './components/history/HistoryView';
import { AlertsView } from './components/alerts/AlertsView';
import { DevicesView } from './components/devices/DevicesView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { ToastContainer } from './components/common/ToastContainer';

const MainApp: React.FC = () => {
  const { isLoggedIn, activeTab } = useMonitoring();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'live':
        return <LiveView />;
      case 'history':
        return <HistoryView />;
      case 'alerts':
        return <AlertsView />;
      case 'devices':
        return <DevicesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Sticky Top Bar */}
      <TopBar />


      {/* Main Body Layout: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar for Desktop & Tablet */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 mb-16 md:mb-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation />
    </div>
  );
};

export default function App() {
  return (
    <MonitoringProvider>
      <MainApp />
    </MonitoringProvider>
  );
}
