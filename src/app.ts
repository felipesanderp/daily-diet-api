import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'

import { mealsRoutes } from './routes/meals'
import { profileRoutes } from './routes/profile'
import { authRoutes } from './routes/auth'

export const app = fastify()

app.register(cors)
app.register(cookie)

app.register(authRoutes, {
  prefix: 'auth',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(profileRoutes, {
  prefix: 'profile',
})
