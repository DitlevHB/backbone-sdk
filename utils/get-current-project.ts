import path from "path"

export default (cwd) => {
  let currentProject
  try {
    // eslint-disable-next-line
    currentProject = require(path.resolve(cwd, "backbone.json"))
  } catch (err) {
    // all good
  }
  if (!currentProject) {
    try {
      // eslint-disable-next-line
      currentProject = require(path.resolve(cwd, "package.json")).backbone
    } catch (err) {
      // all good
    }
  }
  if (!currentProject) return undefined
  return {
    cwd,
    ...(currentProject || {}),
  }
}
