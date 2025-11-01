'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getDepositMethods, getDepositPackages } from '@/services/wallet'
import { DepositMethod, DepositPackage } from '@/models/wallet'
import { useRouter } from 'next/navigation'

export default function BankTopupPage() {
  const [banks, setBanks] = useState<DepositMethod[]>([])
  const [packages, setPackages] = useState<DepositPackage[]>([])
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch deposit methods and filter by 'bank'
        const methodsResponse = await getDepositMethods()
        if (methodsResponse.data && methodsResponse.data.method === 'bank' && methodsResponse.data.data) {
          const activeBanks = methodsResponse.data.data.filter((method) => method.is_active)
          setBanks(activeBanks)
        }

        // Fetch deposit packages
        const packagesResponse = await getDepositPackages()
        if (packagesResponse.data) {
          const activePackages = packagesResponse.data.filter((pkg) => pkg.is_active && pkg.payment_method === 'bank')
          setPackages(activePackages)
        }
      } catch (err) {
        setError('Không thể tải dữ liệu')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = () => {
    if (!selectedPackage || !selectedBank) {
      alert('Vui lòng chọn mệnh giá và ngân hàng')
      return
    }
    // Handle payment logic here
    console.log('Selected Package:', selectedPackage)
    console.log('Selected Bank:', selectedBank)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-600'>{error}</div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Nạp Coin bằng thẻ EPG Card</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Package Selection */}
          <div className='space-y-2'>
            <Label htmlFor='package'>Mệnh giá</Label>
            <Select value={selectedPackage} onValueChange={setSelectedPackage}>
              <SelectTrigger id='package' className='w-full'>
                <SelectValue placeholder='Chọn mệnh giá' />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id.toString()}>
                    {pkg.from_amount.toLocaleString()} {pkg.from_currency} ({pkg.to_amount} {pkg.to_currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bank Selection */}
          <div className='space-y-2'>
            <Label htmlFor='bank'>Chọn ngân hàng Internet Banking:</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger id='bank' className='w-full'>
                <SelectValue placeholder='Chọn ngân hàng' />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id.toString()}>
                    ({bank.code}) {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-4'>
            <Button onClick={handleSubmit} className='w-full md:w-xs'>
              Thanh Toán
            </Button>
            <Button variant={'outline'} onClick={() => router.push('/')} className='w-full md:w-xs'>
              Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
