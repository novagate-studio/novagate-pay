'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getDepositHistories } from '@/services/wallet'
import { DepositHistory } from '@/models/wallet'
import { Badge } from '@/components/ui/badge'

export default function DepositHistoryPage() {
  const [histories, setHistories] = useState<DepositHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true)
        const response = await getDepositHistories()
        if (response.data) {
          // Sort by created_at descending (newest first)
          const sortedHistories = response.data.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          setHistories(sortedHistories)
        }
      } catch (err) {
        setError('Không thể tải lịch sử nạp tiền')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistories()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { label: 'Thành công', variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' },
      pending: { label: 'Đang xử lý', variant: 'secondary' as const, className: 'bg-yellow-500 hover:bg-yellow-600' },
      failed: { label: 'Thất bại', variant: 'destructive' as const, className: '' },
      cancelled: { label: 'Đã hủy', variant: 'outline' as const, className: '' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`
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
      <h1 className='text-2xl font-bold text-gray-900'>Lịch sử nạp</h1>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          {histories.length === 0 ? (
            <div className='text-center text-gray-500 py-12'>Chưa có lịch sử nạp tiền</div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giao dịch</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Ngân hàng</TableHead>
                    <TableHead>Số tiền nạp</TableHead>
                    <TableHead>Số coin nhận</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {histories.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className='font-mono text-sm'>{history.transaction_code}</TableCell>
                      <TableCell className='capitalize'>{history.method}</TableCell>
                      <TableCell>{history.bank?.name || '-'}</TableCell>
                      <TableCell>{formatCurrency(history.from_amount, history.from_currency)}</TableCell>
                      <TableCell className='font-semibold text-green-600'>
                        +{formatCurrency(history.to_amount, history.to_currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(history.status)}</TableCell>
                      <TableCell className='text-sm text-gray-600'>{formatDate(history.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
