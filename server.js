// Require the framework and instantiate it
require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const path = require('path');
const mysql = require('mysql')
const port = process.env.PORT || 3000
fastify.register(require('fastify-websocket'))

const connection = mysql.createConnection({
    host: "localhost:3306",
    user: "root",
    password: process.env.DB_PASSWD
})

connection.connect((err) =>{
    if (err) throw err
    console.log("Connected!")
})

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
  })


fastify.get('/public', function (req, reply) {
    return reply.sendFile('index.html')
  })
  

const start = async () => {
  try {
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()