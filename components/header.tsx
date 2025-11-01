'use client'

import { useUser } from '@/contexts/user-context'
import { SidebarTrigger } from './ui/sidebar'
import { formatNumber } from '@/lib/utils'

export default function Header() {
  const { user, balances } = useUser()
  return (
    <header className='w-full border-b bg-white px-6'>
      <div className='flex items-center justify-between h-16'>
        {/* Logo on the left */}
        <div className='flex items-center gap-3'>
          <SidebarTrigger />
        </div>

        {/* User section on the right */}
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2 h-auto p-2'>
            <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-medium'>
                {user?.full_name
                  ? user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : user?.username?.slice(0, 2).toUpperCase() || 'U'}
              </span>
            </div>
            <div className='block text-left'>
              <p className='text-sm font-medium text-gray-900'>{user?.full_name || user?.username}</p>
              <p className='text-xs'>{formatNumber(balances?.find((b) => b.currency === 'Coin')?.balance || 0)} Coin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
