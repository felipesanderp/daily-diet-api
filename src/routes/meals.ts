import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { onRequest: [verifyJWT] }, async (request) => {
    const [user] = await knex('users')
      .where('id', request.user.sub)
      .select('id')

    const meals = await knex('meals').select().where('user_id', user.id)

    return { meals }
  })

  app.post('/', { onRequest: [verifyJWT] }, async (request, response) => {
    const [user] = await knex('users')
      .where('id', request.user.sub)
      .select('id')

    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      mealDate: z.string(),
      isOnTheDiet: z.boolean(),
    })

    const { name, description, mealDate, isOnTheDiet } =
      createMealBodySchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      name,
      user_id: user.id,
      description,
      mealDate,
      isOnTheDiet,
    })

    return response.status(201).send()
  })

  app.get('/:id', { onRequest: [verifyJWT] }, async (request, response) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = getMealParamsSchema.parse(request.params)

    const [user] = await knex('users')
      .where('id', request.user.sub)
      .select('id')

    const meal = await knex('meals')
      .where('id', params.id)
      .andWhere('user_id', user.id)
      .first()

    if (!meal) {
      return response.status(404).send({
        error: 'Meal not found!',
      })
    }

    return {
      meal,
    }
  })

  app.put('/:id', { onRequest: [verifyJWT] }, async (request, response) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = updateMealParamsSchema.parse(request.params)

    const [user] = await knex('users')
      .where('id', request.user.sub)
      .select('id')

    const editMealBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      mealDate: z.string().optional(),
      isOnTheDiet: z.boolean().optional(),
    })

    const { name, description, mealDate, isOnTheDiet } =
      editMealBodySchema.parse(request.body)

    const meal = await knex('meals')
      .where('id', params.id)
      .andWhere('user_id', user.id)
      .first()
      .update({
        name,
        description,
        mealDate,
        isOnTheDiet,
      })

    if (!meal) {
      return response.status(401).send({
        error: 'Meal not found!',
      })
    }

    return response.status(202).send()
  })

  app.delete('/:id', { onRequest: [verifyJWT] }, async (request, response) => {
    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = deleteMealParamsSchema.parse(request.params)

    const [user] = await knex('users')
      .where('id', request.user.sub)
      .select('id')

    const meal = await knex('meals')
      .where('id', params.id)
      .andWhere('user_id', user.id)
      .first()
      .delete()

    if (!meal) {
      return response.status(401).send({
        error: 'Unauthorized',
      })
    }

    return response.status(202).send('Meal deleted')
  })

  app.get('/summary', { onRequest: [verifyJWT] }, async (request) => {
    const [user] = await knex('users')
      .where('id', request.user.sub)
      .select('id')

    const [count] = await knex('meals')
      .count('id', {
        as: 'Total de refeições registradas',
      })
      .where('user_id', user.id)

    const refOnDiet = await knex('meals')
      .count('id', { as: 'onDiet' })
      .where('isOnTheDiet', true)
      .andWhere('user_id', user.id)

    const refOutsideDiet = await knex('meals')
      .count('id', { as: 'outsideDiet' })
      .where('isOnTheDiet', false)
      .andWhere('user_id', user.id)

    const summary = {
      'Total de refeições registradas': parseInt(
        JSON.parse(JSON.stringify(count))['Total de refeições registradas'],
      ),

      'Total de refeições dentro da dieta': parseInt(
        JSON.parse(JSON.stringify(refOnDiet))[0].onDiet,
      ),

      'Total de refeições fora da dieta': parseInt(
        JSON.parse(JSON.stringify(refOutsideDiet))[0].outsideDiet,
      ),
    }

    return {
      summary,
    }
  })
}
