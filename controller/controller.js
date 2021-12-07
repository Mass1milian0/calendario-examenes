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
console.log("Controller connected!")
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

module.exports = {
    getDataFromTable,
    getSelectFromTable,
    getDistinctGrados,
}