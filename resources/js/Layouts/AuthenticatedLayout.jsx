import { useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import { usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocalStorage } from '@/Hooks/useLocalStorage';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash } = usePage().props;
    
    // Gunakan custom hook
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('sidebarCollapsed', false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { id: 'flash-success' });
        }
        if (flash?.error) {
            toast.error(flash.error, { id: 'flash-error' });
        }
    }, [flash?.success, flash?.error]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            
            <Sidebar 
                user={auth.user} 
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={setIsSidebarCollapsed}
            />
            <Header user={auth.user} />

            {/* Main Content - Dynamic margin based on sidebar state */}
            <main className={`pt-16 transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'ml-20' : 'ml-64'
            }`}>
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}