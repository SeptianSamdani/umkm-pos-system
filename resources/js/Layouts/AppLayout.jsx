// resources/js/Layouts/AppLayout.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';

export default function AppLayout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - with mobile responsiveness */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar />
        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden text-white hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 bg-indigo-50 min-h-screen flex flex-col">
        {/* Header */}
        <Header 
          title={title} 
          onToggleSidebar={() => setSidebarOpen(true)} 
        />

        {/* Content area */}
        <div className="flex-1 px-4 sm:px-6 py-6 overflow-auto">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4 mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2025 UMKMPOS. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span>Version 1.0.0</span>
              <span>•</span>
              <a href="/help" className="hover:text-gray-700">Help</a>
              <span>•</span>
              <a href="/support" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}