const Config = require('../backbone.json')
const Core = require('../../core-alpha')
const App = require('./app')

;(async () => {
  const app = await Core({
    config: Config.settings,
    app: App
  })
})()
