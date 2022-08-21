const Config = require('../backbone.json')
const { Core, User } = require('../../core/dist/node')
const App = require('./app')
const UI = require('./ui')

module.exports = { ...app, UI }
