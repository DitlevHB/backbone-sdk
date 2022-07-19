module.exports = {
  API: async function (Data, Protocol) {
    return {
      async get(key) {
        const value = await Data.get(key)
        return value || null
      },
      async set(params = { key: "", value: "" }) {
        await Protocol({
          type: "set",
          key: params.key,
          value: params.value,
        })
      },
    }
  },

  Protocol: async function (op, Core, Id) {
    if (typeof op !== "object" || !op?.type) throw new Error("UNKNOWN OP")
    switch (op.type) {
      case "set": {
        await Core.put({ key: op.key, value: op.value })
        break
      }
      default:
        throw new Error("UNKNOWN OP")
    }
  },
}
