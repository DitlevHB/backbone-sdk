// a helper method to access backend API
export function bb() {
  if (window["backbone"]?.app) return window["backbone"]?.app
}

// a helper method to update state when database updates
export async function monitorDatabase(setFn) {
  if (bb()) {
    const stopMonitoring = await bb().onAdd(async () => {
      const items = await bb().all()
      setFn(items)
    })
  }
}
