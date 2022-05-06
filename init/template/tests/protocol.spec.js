const { test, expect } = require("@playwright/test")
const Config = require("../backbone.json")
const App = require("../src/app")
const Core = require("../../core-alpha")

let app
test.beforeAll(async () => {
  app = await Core({
    config: Config.settings,
    app: App,
  })
})

test("Protocol works", async () => {
  await app.set({ key: "centralization", value: "meh" })
  expect(await app.all()).toHaveLength(1)
  expect(await app.get("centralization")).toEqual("meh")
  await app.del("centralization")
  expect(await app.all()).toHaveLength(0)
})
