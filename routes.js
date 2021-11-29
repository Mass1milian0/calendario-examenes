const controller = require('./controller/controller')

const routes = [
    {
        handler: controller.getDataFromTable,
        url: '/api/getDataFromTable/:table',
        method: 'GET'
    },
    {
        handler: controller.getDistinctGrados,
        url: '/api/getDistinctGrados',
        method: 'GET'
    },
    {
        handler: controller.postData,
        url: '/api/postData',
        method: 'POST'
    },
    {
        handler: controller.getSelectFromTable,
        url: '/api/getSelectFromTable',
        method: 'POST'
    },
    {
        handler: controller.deleteData,
        url: '/api/deleteData',
        method: 'POST'
    }
]
module.exports = routes