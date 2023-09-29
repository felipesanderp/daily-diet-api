import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const [user] = await knex('users')
      .where('session_id', sessionId)
      .select('id')

    const meals = await knex('meals').where('user_id', user.id).select()

    return { meals }
  })

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const { sessionId } = request.cookies

      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        mealDate: z.string(),
        mealHour: z.string(),
        isOnTheDiet: z.boolean(),
      })

      const { name, description, mealDate, mealHour, isOnTheDiet } =
        createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        user_id: user.id,
        description,
        mealDate,
        mealHour,
        isOnTheDiet,
      })

      return response.status(201).send()
    },
  )
}
