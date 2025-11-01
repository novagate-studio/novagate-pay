import { GameCharacter, GameList, GameServer } from '@/models/game'
import { ResponseData } from '.'
import axiosInstance from './axios'

export const getGameList = async (): Promise<ResponseData<GameList>> => {
  const response = await axiosInstance.get('/api/v2/games/list?limit=1000&offset=0')
  return response.data
}
export const getGameServers = async (gameId: string): Promise<ResponseData<GameServer[]>> => {
  const response = await axiosInstance.get(`/api/v2/games/${gameId}/servers?limit=1000&offset=0`)
  return response.data
}
export const getCharacters = async (gameId: string, serverId: string): Promise<ResponseData<GameCharacter[]>> => {
  const response = await axiosInstance.get(
    `/api/v2/games/${gameId}/characters?limit=1000&offset=0&server_id=${serverId}`
  )
  return response.data
}
