'use client'

import * as React from 'react'

import Logo from '@/assets/logo/PNG_BLACK.png'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useUser } from '@/contexts/user-context'
import {
  Activity,
  CreditCard,
  FileText,
  Home,
  CreditCard as IdCard,
  Key,
  LogOut,
  Mail,
  Phone,
  History,
  ArrowRightLeft,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { logout } = useUser()
  const { setOpenMobile } = useSidebar()

  const handleMenuClick = () => {
    // Close sidebar on mobile after clicking menu item
    setOpenMobile(false)
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenuButton size={'lg'} className='cursor-default pointer-events-none'>
          <Image src={Logo} alt='Novagate Logo' className='w-10 h-auto' />
          <div className='whitespace-nowrap font-bold ml-2 text-xl'>Quản lý</div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size={'lg'}
                className=''
                isActive={pathname === '/' || pathname.startsWith('/withdraw')}
                asChild>
                <Link href='/' onClick={handleMenuClick}>
                  <Home className='size-5!' />
                  <span>Trang chủ</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton size={'lg'} className='' isActive={pathname.startsWith('/topup')} asChild>
                <Link href={`/topup`} onClick={handleMenuClick}>
                  <CreditCard className='size-5!' />
                  <span>Nạp Coin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton size={'lg'} className='' isActive={pathname === '/deposit-history'} asChild>
                <Link href='/deposit-history' onClick={handleMenuClick}>
                  <History className='size-5!' />
                  <span>Lịch sử nạp</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton size={'lg'} className='' isActive={pathname === '/transfer-history'} asChild>
                <Link href='/transfer-history' onClick={handleMenuClick}>
                  <ArrowRightLeft className='size-5!' />
                  <span>Lịch sử chuyển Coin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                size={'lg'}
                className=' text-red-600 hover:text-red-700 hover:bg-red-50'
                onClick={() => {
                  handleMenuClick()
                  logout()
                }}>
                <LogOut className='size-5!' />
                <span>Đăng xuất</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
