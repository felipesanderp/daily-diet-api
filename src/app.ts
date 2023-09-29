import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { mealsRoutes } from './routes/meals'
import { profileRoutes } from './routes/profile'
import { authRoutes } from './routes/auth'

export const app = fastify()

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
