import { AuthGuard } from '@/components/AuthGuard'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <div className="lg:pl-64">
          <Header />
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
