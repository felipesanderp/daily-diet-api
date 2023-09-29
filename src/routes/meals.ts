import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const meals = await knex('meals').select()

    return { meals }
  })

  app.post('/', async () => {})
}
