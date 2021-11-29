const BannedOnGet = ["DELETE", "UPDATE", "INSERT"]
const BannedEverywhere = ["DROP", "CREATE"]
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWD,
    database: 'xux6i28tzurvsxdc',
    port: 3306
});
console.log("Connected!")
function dbQuery(dataExpression) {
    if (BannedEverywhere.some(i => dataExpression.includes(i))) {
        return "invalid"
    }
    return pool.query(dataExpression)
}
const getDataFromTable = async (req, reply) => {
    if (BannedOnGet.some(i => req.params.table.includes(i))) {
        return "invalid"
    }
    return reply.send(JSON.stringify({
        data: await dbQuery("SELECT * from `" + req.params.table + "`")
    }))
}
const getSelectFromTable = async (req, reply) => {
    if (BannedOnGet.some(i => req.body.table.includes(i))) {
        return "invalid"
    }
    if (BannedOnGet.some(i => req.body.data.includes(i))) {
        return "invalid"
    }
    if (BannedOnGet.some(i => req.body.condition1.includes(i))) {
        return "invalid"
    }
    if (BannedOnGet.some(i => req.body.condition2.includes(i))) {
        return "invalid"
    }
    return reply.send(JSON.stringify({
        data: await dbQuery('SELECT `' + req.body.data + '` from `' + req.body.table + '`' + ' WHERE `' + req.body.condition1 + '` = "' + req.body.condition2 + '"')
    }))
}
const getDistinctGrados = async (req, reply) => {
    return reply.send(JSON.stringify({
        data: await dbQuery("SELECT DISTINCT universidad FROM `facultades`")
    }))
}
const postData = async (req, reply) => {
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
    const response = await dbQuery('INSERT INTO `examenes` VALUES("'
        + newData.universidad + '","' + newData.facultad + '","'
        + newData.nombreExamen + '","' + newData.fechaExamen + '",'
        + newData.convocatoriaEspecial + ',' + newData.convocatoriaExtraordinaria + ','
        + newData.curso+")")
    return reply.send({ status: 200, newData , response })
}
const deleteData = async (req, reply) => {
    const { universidad, facultad, nombreExamen, fechaExamen, curso } = req.body
    const response = await dbQuery('DELETE FROM `examenes` WHERE universidad="' + universidad + '" and facultad="' + facultad + '" and nombreExamen="' + nombreExamen + '" and date(fechaExamen)="' + fechaExamen + '" and curso=' + curso)
    return reply.send({ status: 200, response })
}

module.exports = {
    getDataFromTable,
    getSelectFromTable,
    getDistinctGrados,
    postData,
    deleteData
}