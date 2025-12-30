// src/components/layout/bottom-navigation.tsx
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

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card h-16 md:hidden">
      <div className="flex h-full items-center justify-around">
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
                'flex flex-1 flex-col items-center justify-center px-2 py-3 transition-colors',
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Safe area inset for devices with bottom notch/home indicator */}
      <div className="h-safe-bottom" />
    </nav>
  )
}
