const Config = require('../backbone.json')
const Core = require('../../core-alpha')
const App = require('./app')

;(async () => {
  window['bb'] = await Core({
    config: Config.settings,
    app: App
  })
})()
