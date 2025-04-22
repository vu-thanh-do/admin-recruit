// src/components/layout/sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  BarChart3,
  Mail,
  Bell,
  ChevronLeft,
  ChevronRight,
  Logs,
  File,
  Factory,
  Building2,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

const mainNav: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className='w-5 h-5' />
  },
  {
    title: 'All Request',
    href: '/dashboard/all-request',
    icon: <File className='w-5 h-5' />
  },
  {
    title: 'Adoption',
    href: '/dashboard/adoption',
    icon: <File className='w-5 h-5' />
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: <Users className='w-5 h-5' />
  },
  {
    title: 'Roles',
    href: '/dashboard/roles',
    icon: <Shield className='w-5 h-5' />
  },
  {
    title: 'Logs actions',
    href: '/dashboard/logs',
    icon: <Logs className='w-5 h-5' />
  },
  {
    title: 'Form recruitment',
    href: '/dashboard/form-recruitment',
    icon: <File className='w-5 h-5' />
  },
  {
    title: 'Code approval',
    href: '/dashboard/code-approval',
    icon: <File className='w-5 h-5' />
  },
  {
    title: 'File management',
    href: '/dashboard/file-management',
    icon: <File className='w-5 h-5' />
  },
  {
    title: 'Leave special',
    href: '/dashboard/leave-special',
    icon: <Calendar className='w-5 h-5' />
  },
  {
    title: 'Lines Mfg',
    href: '/dashboard/lines-mfg',
    icon: <Factory className='w-5 h-5' />
  }
]

const secondaryNav: NavItem[] = [
  {
    title: 'Config system',
    href: '/dashboard/settings',
    icon: <Settings className='w-5 h-5' />
  },
  {
    title: 'Company Structure',
    href: '/dashboard/company-structure',
    icon: <Building2 className='w-5 h-5' />
  },
  
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'relative h-full border-r border-border/40 bg-background/95 backdrop-blur-sm transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className='flex items-center justify-between h-16 px-4 border-b border-border/40'>
        <Link href='/dashboard' className={cn('flex items-center', collapsed && 'justify-center')}>
          {!collapsed ? (
            <div className='text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500'>
              Quản lý tuyển dụng
            </div>
          ) : (
            <div className='flex items-center justify-center w-8 h-8 font-bold rounded-full bg-gradient-to-r from-primary to-blue-500 text-primary-foreground'>
              A
            </div>
          )}
        </Link>
      </div>

      <div className='flex flex-col h-[calc(100%-4rem)] justify-between p-2'>
        <div className='space-y-2'>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                collapsed && 'justify-center px-0'
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>

        <div className='space-y-2'>
          <Separator className='my-2' />
          {secondaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                collapsed && 'justify-center px-0'
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </div>

      <Button
        variant='ghost'
        size='icon'
        className='absolute w-6 h-6 border rounded-full shadow-md -right-3 top-20 bg-background/95'
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className='w-3 h-3' /> : <ChevronLeft className='w-3 h-3' />}
      </Button>
    </div>
  )
}
