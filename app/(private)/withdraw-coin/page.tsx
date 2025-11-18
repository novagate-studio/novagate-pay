'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getExchangeRates } from '@/services/wallet'
import { ExchangeRate } from '@/models/wallet'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function WithdrawCoinContent() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get('gameId')
  const router = useRouter()

  const [coinAmount, setCoinAmount] = useState<string>('')
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch exchange rate when gameId is available
  useEffect(() => {
    if (!gameId) {
      setError('Vui lòng chọn game')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch exchange rate
        const rateResponse = await getExchangeRates(gameId)
        if (rateResponse.data && rateResponse.data.length > 0) {
          // Get the first exchange rate (or you can add logic to select specific one)
          setExchangeRate(rateResponse.data[0])
        }
      } catch (err) {
        setError('Không thể tải dữ liệu')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [gameId])

  // Calculate in-game amount based on coin amount and exchange rate
  const calculateInGameAmount = () => {
    if (!coinAmount || !exchangeRate) return 0
    const amount = parseFloat(coinAmount)
    if (isNaN(amount)) return 0
    return Math.floor(amount * exchangeRate.rate)
  }

  const handleSubmit = () => {
    if (!coinAmount || parseFloat(coinAmount) <= 0) {
      alert('Vui lòng nhập số lượng coin hợp lệ')
      return
    }
    if (exchangeRate && parseFloat(coinAmount) < exchangeRate.min_transfer) {
      alert(`Số lượng coin tối thiểu là ${exchangeRate.min_transfer}`)
      return
    }

    // Handle withdrawal logic here
    console.log('Withdrawal data:', {
      gameId,
      coinAmount: parseFloat(coinAmount),
      inGameAmount: calculateInGameAmount(),
      exchangeRate: exchangeRate?.rate,
    })
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
      </div>
    )
  }

  if (error || !gameId) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-400'>{error || 'Thiếu thông tin game'}</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-gray-900'>Chuyển Coin vào game</h1>

      {/* Coin Amount Input Section */}
      <div className='space-y-4'>
        {/* Coin Amount Input */}
        <div className='space-y-2'>
          <Label htmlFor='coinAmount'>Số lượng Coin muốn chuyển</Label>
          <Input
            id='coinAmount'
            type='number'
            min='0'
            step='1'
            placeholder='Nhập số lượng Coin'
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            className='w-full'
          />
          {exchangeRate && (
            <div className='text-sm space-y-1'>
              <p className='text-gray-600'>
                Tỷ lệ: 1 Coin = {exchangeRate.rate} {exchangeRate.game.ingame_currency_name}
              </p>
              <p className='text-gray-600'>Số lượng tối thiểu: {exchangeRate.min_transfer} Coin</p>
              {coinAmount && parseFloat(coinAmount) > 0 && (
                <p className='text-green-600 font-semibold'>
                  Bạn sẽ nhận được: {calculateInGameAmount().toLocaleString()} {exchangeRate.game.ingame_currency_name}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='flex gap-4'>
        {/* Submit Button */}
        <Button onClick={handleSubmit} size={'lg'} className='w-full md:w-auto'>
          Chuyển đổi
        </Button>
        <Button variant={'outline'} onClick={() => router.push('/')} size={'lg'} className='w-full md:w-auto'>
          Quay lại Trang chủ
        </Button>
      </div>
    </div>
  )
}

export default function WithdrawCoinPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
        </div>
      }>
      <WithdrawCoinContent />
    </Suspense>
  )
}
