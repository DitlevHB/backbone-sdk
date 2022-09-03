export default async function(op, Data) {
  switch (op.type) {
    // insert operation cases here
    default:
      return Data.discard(op, "unknown operation")
  }
}