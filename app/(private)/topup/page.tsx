'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import BankTransfer from '@/assets/images/bank-transfer.png'
import Link from 'next/link'
export default function TopupPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-gray-900'>Chọn phương thức nạp Coin</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        <Link href={'/topup/bank'}>
          <Card className='overflow-hidden hover:shadow-lg p-0 gap-0 transition-shadow duration-300'>
            <div className='relative w-full aspect-square bg-gray-100 flex items-center justify-center'>
              <Image
                src={BankTransfer}
                alt='Nạp online bằng chuyển khoản ngân hàng'
                width={300}
                height={300}
                className='object-contain p-4'
              />
            </div>
            <CardContent className='p-4'>
              <Button variant='outline' className='w-full text-blue-600 border-blue-600 hover:bg-blue-50'>
                Chuyển khoản ngân hàng
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
