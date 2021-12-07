require('dotenv').config()
const fastify = require('fastify')({ logger: false })
const fastifyPassport = require('fastify-passport')
const fastifySecureSession = require('fastify-secure-session')
const passportLocal = require('passport-local').Strategy
const BannedEverywhere = ["DROP", "CREATE"]
const bCrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000
const routes = require('./routes')
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_NAME_SERVER,
  port: process.env.DB_PORT
});
console.log("Server Connected!")
function dbQuery(dataExpression) {
  if (BannedEverywhere.some(i => dataExpression.includes(i))) {
    return "invalid"
  }
  return pool.query(dataExpression)
}
fastify.register(require('fastify-cors'), {
  origin: `${process.env.CORS_ORIGIN}:port/*`
})
fastify.register(fastifySecureSession, { key: fs.readFileSync(path.join(__dirname, 'secret-key')) })
fastify.register(fastifyPassport.initialize())
fastify.register(fastifyPassport.secureSession())
fastifyPassport.registerUserSerializer((user, request) => {
  return user
});
fastifyPassport.registerUserDeserializer(async (username, request) => {
  let data = await dbQuery(`SELECT * FROM \`users\` WHERE username="${username}"`)
  return data[0][0]
});
fastifyPassport.use('login', new passportLocal(function (username, password, done) {
  dbQuery(`SELECT * FROM \`users\` WHERE username="${username}"`).then((data) => {
    if (data[0].length > 0) {
      data = data[0][0]
      if (username === data.username && bCrypt.compareSync(password, data.hashedPassword)) {
        return done(null, username)
      } else return done(null, false)
    }
  }).catch((error) => {
    console.log(error)
    return done(error);
  })
}))
const postData = async (req, reply) => {
  if (!req.user) { reply.send(403) }
  else {
    const params = req.body
    const newData = {
      universidad: params.universidad,
      facultad: params.facultad,
      nombreExamen: params.nombreExamen,
      fechaExamen: params.fechaExamen,
      convocatoriaEspecial: params.convocatoriaEspecial,
      convocatoriaExtraordinaria: params.convocatoriaExtraordinaria,
      curso: params.curso
    }

    const response = await dbQuery(`INSERT INTO \`examenes\` VALUES("${newData.universidad}","${newData.facultad}","${newData.nombreExamen}","${newData.fechaExamen}",${newData.convocatoriaEspecial},${newData.convocatoriaExtraordinaria},${newData.curso})`)
    return reply.send({ status: 200, newData, response })
  }
}
const deleteData = async (req, reply) => {
  if (!req.user) { reply.send(403) }
  else {
    const { universidad, facultad, nombreExamen, fechaExamen, curso } = req.body
    const response = await dbQuery(`DELETE FROM \`examenes\` WHERE universidad="${universidad}" and facultad="${facultad}" and nombreExamen="${nombreExamen}" and fechaExamen="${fechaExamen}" and curso=${curso}`)
    return reply.send({ status: 200, response })
  }
}
const logout = async (req, reply) => {
  if (!req.user) { reply.redirect("/login") }
  req.logout()
  reply.redirect("/")
}

fastify.get(
  "/login",
  (req, reply) => {
    return reply.sendFile('./login/index.html')
  }
)

fastify.post(
  "/login",
  {
    preValidation: fastifyPassport.authenticate('login', { successRedirect: '/entry' })
  },
  () => { }
)

const adminRoutes = [
  {
    handler: deleteData,
    url: '/api/deleteData',
    method: 'POST'
  },
  {
    handler: postData,
    url: '/api/postData',
    method: 'POST'
  },
  {
    handler: (req, reply) => {
      if (!req.user) { reply.redirect("/login") }
      return reply.sendFile('./entry/index.html')
    },
    url: '/entry',
    method: 'GET'
  },
  {
    handler: logout,
    url: "/logout",
    method: "GET"
  }
]

const start = async () => {
  try {
    console.log('listening on port: ' + port)
    await fastify.listen(port, '0.0.0.0')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

fastify.register(require('fastify-static'), {
  root: __dirname,
  prefix: '/', // optional: default '/'
})
routes.forEach((route, index) => {
  fastify.route(route)
})
adminRoutes.forEach((route, index) => {
  fastify.route(route)
})

start()