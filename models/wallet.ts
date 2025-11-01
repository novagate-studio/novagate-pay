export type WalletBalance = {
  id: number
  balance: number
  currency: string
  created_at: string
  updated_at: string
}
export type DepositMethod = {
  id: number
  code: string
  name: string
  logo_url: string
  short_name: string
  is_active: boolean
  created_at: string
}

export type DepositMethodResponse = {
  method: string
  data: DepositMethod[]
}

export type DepositPackage = {
  id: number
  name: string | null
  payment_method: string
  from_amount: number
  from_currency: string
  to_amount: number
  to_currency: string
  is_active: boolean
}

export type DepositHistory = {
  id: number
  user: {
    username: string
  }
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  method: string
  transaction_code: string
  bank: {
    name: string
  } | null
  from_amount: number
  from_currency: string
  to_amount: number
  to_currency: string
  created_at: string
  user_account_log: {
    balance_before: number
    balance_after: number
    amount: number
    ip: string
  } | null
}

export type TransferHistory = {
  id: number
  user: {
    id: string
    username: string
  }
  game: {
    id: number
    name: string
  }
  game_server: {
    id: number
    name: string
  }
  game_character: {
    id: number
    name: string
  }
  amount_coin: number
  amount_ingame: number
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  created_at: string
  completed_at: string | null
  user_account_log: {
    balance_before: number
    balance_after: number
    amount: number
    ip: string
  } | null
}