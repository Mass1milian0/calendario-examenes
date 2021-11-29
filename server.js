require('dotenv').config()
const fastify = require('fastify')({ logger: false })
const port = process.env.PORT || 3000
const routes = require('./routes')

const start = async () => {
  try {
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
fastify.register(require('fastify-static'), {
  root: __dirname,
  prefix: '/', // optional: default '/'
})
fastify.get('/entry', function (req, reply) {
  return reply.sendFile('./entry/index.html')
})
routes.forEach((route, index) => {
  fastify.route(route)
})

start()