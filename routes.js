const controller = require('./controller/controller')

const routes = [
    {
        handler: controller.getDistinctGrados,
        url: '/api/getDistinctGrados',
        method: 'GET'
    },
    {
        handler: controller.getDataFromTable,
        url: '/api/getDataFromTable/:table',
        method: 'GET'
    },
    {
        handler: controller.getSelectFromTable,
        url: '/api/getSelectFromTable',
        method: 'POST'
    },

]
module.exports = routes