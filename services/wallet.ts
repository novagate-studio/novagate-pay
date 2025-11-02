import {
  DepositHistory,
  DepositMethodResponse,
  DepositPackage,
  ExchangeRate,
  TransferHistory,
  WalletBalance,
} from '@/models/wallet'
import { ResponseData } from '.'
import axiosInstance from './axios'

export const getWalletBalances = async (): Promise<ResponseData<WalletBalance[]>> => {
  const response = await axiosInstance.get('/api/v2/wallets/balances')
  return response.data
}
export const getDepositMethods = async (): Promise<ResponseData<DepositMethodResponse>> => {
  const response = await axiosInstance.get('/api/v2/wallets/deposit-methods')
  return response.data
}
export const getDepositPackages = async (): Promise<ResponseData<DepositPackage[]>> => {
  const response = await axiosInstance.get('/api/v2/wallets/deposit-packages')
  return response.data
}
export const getDepositHistories = async (): Promise<ResponseData<DepositHistory[]>> => {
  const response = await axiosInstance.get('/api/v2/wallets/deposit-histories')
  return response.data
}
export const getTransferHistories = async (): Promise<ResponseData<TransferHistory[]>> => {
  const response = await axiosInstance.get('/api/v2/wallets/transfer-histories')
  return response.data
}
export const getExchangeRates = async (gameId: string): Promise<ResponseData<ExchangeRate[]>> => {
  const response = await axiosInstance.get(`/api/v2/wallets/exchange-rates?gameId=${gameId}`)
  return response.data
}
