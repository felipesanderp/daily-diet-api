import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'

import { mealsRoutes } from './routes/meals'
import { profileRoutes } from './routes/profile'
import { authRoutes } from './routes/auth'
import { env } from './env'

export const app = fastify()

app.register(cors, {
  origin: ['http://localhost:5173'],
  methods: ['GET,PUT,POST,PATCH,DELETE'],
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

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
