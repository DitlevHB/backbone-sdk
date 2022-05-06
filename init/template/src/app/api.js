const API = async function(Data, Protocol) {
  return {
    async all(stream) {
      const items = await Data.query({ lt: '~' }, stream)
      return items
    },
    async get(key) {
      const value = await Data.get(key)
      return value || null
    },
    async del(key) {
      await Protocol({
        type: 'del',
        key,
      })
    },
    async set(params = { key: "", value: "" }) {
      await Protocol({
        type: 'set',
        key: params.key,
        value: params.value
      })
    },
  }
}

module.exports = API