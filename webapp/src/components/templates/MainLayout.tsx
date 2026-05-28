import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  headerContent?: ReactNode;
  sidebar?: ReactNode;
}

export function MainLayout({ children, headerContent, sidebar }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#222] font-sans text-white pb-20">
      {/* Top Header Bar */}
      <header className="w-full bg-p4-black border-b-4 border-p4-yellow sticky top-0 z-50 shadow-lg h-15 flex items-center">
        <div className="w-full max-w-350 mx-auto px-4 flex items-center justify-between">
          <h1 
            className="text-2xl md:text-3xl font-bold text-p4-yellow tracking-widest uppercase italic whitespace-nowrap"
            style={{ textShadow: '2px 2px 0px #000' }}
          >
            P4G <span className="text-white">Guide</span>
          </h1>
          {headerContent && (
            <div className="flex-1 flex justify-end">
              {headerContent}
            </div>
          )}
        </div>
      </header>

      {/* Main Responsive Container */}
      <div className="max-w-350 mx-auto flex flex-col md:flex-row min-h-[calc(100vh-60px)]">
        {/* Sidebar Navigation */}
        {sidebar && (
          <aside className="w-full md:w-64 md:sticky md:top-15 md:h-[calc(100vh-60px)] bg-p4-black/30 border-b md:border-b-0 md:border-r border-p4-gray overflow-y-auto no-scrollbar">
            {sidebar}
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 mt-6 px-4 md:px-8">
          <div className="max-w-4xl mx-auto md:mx-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
