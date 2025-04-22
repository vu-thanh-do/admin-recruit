// src/app/(dashboard)/layout.tsx
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/layout/navbar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background dark:bg-[#0a0a0c] bg-grid-pattern">
            <div className="flex min-h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Navbar />
                    <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}