// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      mealDate: string
      mealHour: string
      isOnTheDiet: boolean
      created_at: string
    }
    users: {
      id: string
      name: string
      email: string
      session_id?: string
      created_at: string
    }
  }
}
