import { Link } from '@tanstack/react-router'
import { Home, CreditCard, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: CreditCard,
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: Folder,
  },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 h-screen flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-4 shrink-0">
        <div className="flex items-center gap-2">
          <img className="h-8 w-8 rounded-md" src="/icon-192x192.png" />
          <span className="text-lg font-semibold">Ledgerly</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                to={item.href}
                activeProps={{
                  className: 'bg-primary/10 text-primary font-medium',
                }}
                activeOptions={{ exact: true }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Fixed bottom section */}
      <div className="border-t border-border p-4 mt-auto shrink-0">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">Current Balance</p>
          <p className="text-lg font-semibold text-foreground">$4,287.50</p>
          <p className="mt-1">Updated just now</p>
        </div>
      </div>
    </aside>
  )
}
