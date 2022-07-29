const Protocol = async function(op, Data) {
  if (typeof op !== 'object' || !op?.type) throw new Error('UNKNOWN OP')
  switch (op.type) {
    case 'set': {
      await Data.put({ key: op.key, value: op.value })
      break
    }
    case 'del': {
      const p = await Data.get(op.key, { update: false })
      if (!p) break

      await Data.del(op.key)
      break
    }
    default:
      throw new Error('UNKNOWN OP')
  }
}

module.exports = Protocol