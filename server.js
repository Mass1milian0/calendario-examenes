// Require the framework and instantiate it
const mysql = require('mysql2/promise');
require('dotenv').config()
const fastify = require('fastify')({ logger: false })
const port = process.env.PORT || 3000
const nuxtRoutes = require('./.nuxt/routes.json');
fastify.register(require('fastify-websocket'))
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'db',
  port: 3306
});
console.log("Connected!")
fastify.register(require('fastify-nuxtjs')).after(() => {
  nuxtRoutes.forEach((nuxtRoute) => {
    fastify.nuxt(nuxtRoute.path);
  })
})

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

function get(dataExpression) {
  //pool.query(dataExpression).then((data) => {
  //  console.log(data)
  //})
  console.log("querying: " + dataExpression);
  pool.query(dataExpression).then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err);
  })
  return pool.query(dataExpression)
}

fastify.get('/wss/', { websocket: true }, async (connection /* SocketStream */, req /* FastifyRequest */) => {
  console.log("client connected!");
  connection.socket.send(JSON.stringify({
    operation: "wssUpdate",
    content: {
      universidades: await get("SELECT nombreUniversidad FROM `universidades`")
    }
  }))
  connection.socket.on('message', async message => {
    let msg = JSON.parse(message)
    if (msg.operation == "getFromDb") {
      console.log(msg.content);
      connection.socket.send(JSON.stringify({
        operation: "updateFromDb",
        context: msg.context,
        get: msg.get,
        content: await get(msg.content)
      }))
      console.log("Responded to websocket");
    }
  })
})

start()