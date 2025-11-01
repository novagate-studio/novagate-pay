export interface Game {
  id: number
  name: string
  description: string
  image_url: string
  status: 'active' | 'inactive'
  sort: number
  ingame_currency_name: string
  created_at: string
  updated_at: string
}

export type GameList = Game[]

export interface GameCharacter {
  id: number
  name: string
  level: string
  user_id: string
  game?: Game
  game_server?: {
    id: number
    name: string
    region: string | null
    server_number: number
    status: 'active' | 'inactive'
  }
}

export interface GameServer {
  id: number
  name: string
  region: string | null
  server_number: number
  status: 'active' | 'inactive'
  game_characters: { id: number; name: string; level: string; user_id: string }[]
}