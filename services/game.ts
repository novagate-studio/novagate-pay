import { GameList } from '@/models/game';
import { ResponseData } from '.';
import axiosInstance from './axios';

export const getGameList = async (): Promise<ResponseData<GameList>> => {
  const response = await axiosInstance.get('/api/v2/games/list?limit=1000&offset=0');
  return response.data;
};
