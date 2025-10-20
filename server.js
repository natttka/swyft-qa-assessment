
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import { ApolloServer, gql } from 'apollo-server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(bodyParser.json())

// --- Mock REST API ---
app.get('/api/metrics', (req, res) => {
  const metric = (req.query.metric || 'download').toString()
  const now = Date.now()
  // Intermittent 500 bug: returns 500 for 'upload' on odd minutes
  const minute = new Date(now).getMinutes()
  if (metric === 'upload' && minute % 2 === 1) {
    console.error('Intermittent failure triggered for upload on odd minute', minute)
    return res.status(500).json({ error: 'Intermittent failure' })
  }
  const data = Array.from({ length: 12 }).map((_, i) => ({
    t: i,
    v: metric === 'download' ? 50 + i * 3 : metric === 'upload' ? 20 + i * 2 : 30 + (i % 5)
  }))
  // XSS vector: echo metric unsafely in description (intentional)
  res.json({ metric, description: `<b>${metric}</b> metric`, points: data })
})

// --- GraphQL API ---
const typeDefs = gql`
  type Point { t: Int!, v: Float! }
  type Query { kpi(metric: String!): [Point!]! }
`
const resolvers = {
  Query: {
    kpi: (_, { metric }) => {
      return Array.from({ length: 12 }).map((_, i) => ({
        t: i,
        v: metric === 'download' ? 50 + i * 3 : metric === 'upload' ? 20 + i * 2 : 30 + (i % 5)
      }))
    }
  }
}
const gqlServer = new ApolloServer({ typeDefs, resolvers })
const gqlUrlPromise = gqlServer.listen({ port: 4000 }).then(({ url }) => {
  console.log(`GraphQL running at ${url}`)
  return url
})

// Static app
app.use(express.static(path.join(__dirname, 'public')))

// Proxy /graphql to local Apollo (simple fetch)
app.post('/graphql', async (req, res) => {
  const url = await gqlUrlPromise
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req.body)
  })
  const j = await r.json()
  res.status(r.status).json(j)
})

const PORT = 5174
app.listen(PORT, () => console.log(`App available on http://localhost:${PORT}`))
