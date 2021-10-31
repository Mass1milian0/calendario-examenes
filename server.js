// Require the framework and instantiate it
require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const mysql = require('mysql2')
const port = process.env.PORT || 3000
const nuxtRoutes = require('./.nuxt/routes.json');
fastify.register(require('fastify-websocket'))
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASSWD,
  database: 'db'
})

const start = async () => {
  try {
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

connection.connect((err) => {
  if (err) throw err
  console.log("Connected!")
  fastify.register(require('fastify-nuxtjs')).after(() => {
    nuxtRoutes.forEach((nuxtRoute) => {
      fastify.nuxt(nuxtRoute.path);
    })
  })
  start()
})
fastify.register(require('fastify-static'), {
  root: __dirname,
  prefix: '/', // optional: default '/'
})
fastify.get('/entry', function (req, reply) {
  return reply.sendFile('./entry/index.html')
})

async function get(dataExpression) {
  return connection.query(dataExpression)
}

fastify.get('/wss/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
  connection.socket.send(JSON.stringify({
    operation: "wssUpdate",
    content: {
      universidades: get("SELECT nombreUniversidad FROM `db.universidades`")
    }
  }))
  connection.socket.on('message', async message => {
    if (message.operation == "getFromDb") {
      connection.socket.send(await get(message.content))
    }
  })
})