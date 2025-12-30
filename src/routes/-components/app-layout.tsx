// src/components/layout/layout.tsx
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./sidebar";
import { BottomNavigation } from "./bottom-navigation";
import { useMediaQuery } from "@/hooks/use-media-query";

export function AppLayout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Fixed Sidebar - Desktop only */}
        {isDesktop && (
          <div className="fixed left-0 top-0 h-screen w-64 z-10">
            <Sidebar />
          </div>
        )}
        
        {/* Main Content Area */}
        <div className={`flex-1 ${isDesktop ? 'ml-64' : ''} min-h-screen`}>
          <div className="h-full flex flex-col">
            {/* Main content with bottom padding for mobile nav */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
            
            {/* Bottom Navigation - Mobile only */}
            {!isDesktop && <BottomNavigation />}
          </div>
        </div>
      </div>
    </div>
  );
}