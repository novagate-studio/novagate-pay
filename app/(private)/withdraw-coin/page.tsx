'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { getGameServers, getCharacters } from '@/services/game'
import { GameServer, GameCharacter } from '@/models/game'
import Image from 'next/image'
import { DollarSign } from 'lucide-react'

const PACKAGE_OPTIONS = [
  { tPoint: 450, vnd: 50000 },
  { tPoint: 900, vnd: 100000 },
  { tPoint: 1800, vnd: 200000 },
  { tPoint: 2700, vnd: 300000 },
  { tPoint: 4500, vnd: 500000 },
  { tPoint: 9000, vnd: 1000000 },
]

export default function WithdrawCoinPage() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get('gameId')
  const router = useRouter()

  const [servers, setServers] = useState<GameServer[]>([])
  const [characters, setCharacters] = useState<GameCharacter[]>([])
  const [selectedServer, setSelectedServer] = useState<string>('')
  const [selectedCharacter, setSelectedCharacter] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch servers when gameId is available
  useEffect(() => {
    if (!gameId) {
      setError('Vui lòng chọn game')
      setLoading(false)
      return
    }

    const fetchServers = async () => {
      try {
        setLoading(true)
        const response = await getGameServers(gameId)
        if (response.data) {
          const activeServers = response.data.filter((server) => server.status === 'active')
          setServers(activeServers)
        }
      } catch (err) {
        setError('Không thể tải danh sách máy chủ')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [gameId])

  // Fetch characters when server is selected
  useEffect(() => {
    if (!gameId || !selectedServer) {
      setCharacters([])
      setSelectedCharacter('')
      return
    }

    const fetchCharacters = async () => {
      try {
        const response = await getCharacters(gameId, selectedServer)
        if (response.data) {
          setCharacters(response.data)
        }
      } catch (err) {
        console.error('Không thể tải danh sách nhân vật', err)
        setCharacters([])
      }
    }

    fetchCharacters()
  }, [gameId, selectedServer])

  const handleSubmit = () => {
    if (!selectedServer) {
      alert('Vui lòng chọn máy chủ')
      return
    }
    if (!selectedCharacter) {
      alert('Vui lòng chọn nhân vật')
      return
    }
    if (selectedPackage === null) {
      alert('Vui lòng chọn gói')
      return
    }

    // Handle withdrawal logic here
    console.log('Withdrawal data:', {
      gameId,
      serverId: selectedServer,
      characterId: selectedCharacter,
      packageIndex: selectedPackage,
      package: PACKAGE_OPTIONS[selectedPackage],
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

      {/* Section 1: Character Information */}
      <Card className=''>
        <CardHeader className=''>
          <CardTitle className='text-xl font-bold'>Thông tin nhân vật</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 '>
          {/* Server Selection */}
          <div className='space-y-2'>
            <Label htmlFor='server'>Chọn máy chủ</Label>
            <Select value={selectedServer} onValueChange={setSelectedServer}>
              <SelectTrigger id='server' className='h-12 w-full'>
                <SelectValue placeholder='Chọn máy chủ' />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server) => (
                  <SelectItem key={server.id} value={server.id.toString()}>
                    {server.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Character Selection */}
          <div className='space-y-2'>
            <Label htmlFor='character'>Chọn nhân vật</Label>
            <Select
              value={selectedCharacter}
              onValueChange={setSelectedCharacter}
              disabled={!selectedServer || characters.length === 0}>
              <SelectTrigger id='character' className='h-12 w-full'>
                <SelectValue placeholder='Chọn nhân vật' />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.id.toString()}>
                    {character.name} - Cấp {character.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Package Selection */}
      <Card>
        <CardHeader className=''>
          <CardTitle className='text-xl font-bold'>Chọn gói</CardTitle>
        </CardHeader>
        <CardContent className=''>
          <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {PACKAGE_OPTIONS.map((pkg, index) => (
              <div
                key={index}
                onClick={() => setSelectedPackage(index)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedPackage === index ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                <div className='flex flex-col items-center space-y-3'>
                  <div className='text-orange-500 font-bold text-lg'>{pkg.tPoint.toLocaleString()} Coin</div>
                  <div className='w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-400 flex items-center justify-center shadow-lg'>
                    <div className='w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl'>
                      <DollarSign />
                    </div>
                  </div>
                  <div className='text-blue-400 font-semibold text-base'>{pkg.vnd.toLocaleString()} VND</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className='flex gap-4'>
        {/* Submit Button */}
        <Button onClick={handleSubmit} size={'lg'} className='w-full md:w-xs'>
          Chuyển đổi
        </Button>
        <Button variant={'outline'} onClick={() => router.push('/')} size={'lg'} className='w-full md:w-xs'>
          Quay lại Trang chủ
        </Button>
      </div>
    </div>
  )
}
