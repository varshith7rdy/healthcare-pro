import AppSidebar from '../AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/AuthContext';

export default function AppSidebarExample() {
  const style = {
    '--sidebar-width': '16rem',
  };

  return (
    <AuthProvider>
      <SidebarProvider style={style}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-semibold">Main Content Area</h2>
            <p className="text-muted-foreground mt-2">The sidebar will be visible on the left side</p>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
