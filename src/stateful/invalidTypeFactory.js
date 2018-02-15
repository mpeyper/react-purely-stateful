export default name => arg => options => {
  throw new TypeError(
    `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${options.wrappedComponentName}.`
  )
}
