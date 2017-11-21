export default (arg, factories) => {
  for (let i = 0; i < factories.length; i++) {
    const result = factories[i](arg)
    if (result) {
      return result
    }
  }
}
