import { Switch, Route, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AuthProvider, useAuth } from '@/context/AuthContext';

import AppSidebar from '@/components/AppSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import ThemeToggle from '@/components/ThemeToggle';
import Loader from '@/components/Loader';

import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import WearablesSync from '@/pages/WearablesSync';
import VirtualCompanion from '@/pages/VirtualCompanion';
import Analytics from '@/pages/Analytics';
import Appointments from '@/pages/Appointments';
import Profile from '@/pages/Profile';
import DigitalRecords from '@/pages/DigitalRecords';

function AuthRouter() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  const isAuthPage = location === '/login' || location === '/signup';

  if (!isAuthenticated && !isAuthPage) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/" component={Login} />
      </Switch>
    );
  }

  if (isAuthenticated && isAuthPage) {
    window.location.href = '/dashboard';
    return null;
  }

  if (isAuthPage) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    );
  }

  const style = {
    '--sidebar-width': '16rem',
  };

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 border-b px-6 py-3">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
            <div className="mx-auto max-w-7xl">
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/wearables" component={WearablesSync} />
                <Route path="/companion" component={VirtualCompanion} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/appointments" component={Appointments} />
                <Route path="/records" component={DigitalRecords} />
                <Route path="/profile" component={Profile} />
                <Route path="/" component={Dashboard} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AuthRouter />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
