'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getGameList } from '@/services/game'
import { Game } from '@/models/game'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const response = await getGameList()
        if (response.data) {
          // Sort games by sort field
          const sortedGames = response.data.sort((a, b) => a.sort - b.sort)
          setGames(sortedGames)
        }
      } catch (err) {
        setError('Không thể tải danh sách game')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

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
      <h1 className='text-2xl font-bold text-gray-900'>Danh sách Game</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {games.map((game) => (
          <Card key={game.id} className='overflow-hidden hover:shadow-lg p-0 gap-0 transition-shadow duration-300'>
            <div className='relative w-full aspect-square bg-gray-100'>
              <Image
                src={game.image_url}
                alt={game.name}
                width={500}
                height={400}
                className='object-contain h-full w-full'
              />
            </div>
            <CardContent className='p-4'>
              <Link href={`/withdraw-coin?gameId=${game.id}`}>
                <Button variant='outline' className='w-full text-blue-600 border-blue-600 hover:bg-blue-50'>
                  {game.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && !loading && <div className='text-center text-gray-500 py-12'>Không có game nào</div>}
    </div>
  )
}
