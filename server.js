// Require the framework and instantiate it
require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const path = require('path');

const port = process.env.PORT || 3000

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
  })

// Declare a route
fastify.get('/public', function (req, reply) {
    return reply.sendFile('index.html')
  })
  

// Run the server!
const start = async () => {
  try {
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()