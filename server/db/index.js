const knex = require('knex')
const conf = require('./knexfile')
const db = knex(conf[process.env.NODE_ENV === 'test' ? 'test' : 'development'])
module.exports = db
