export default {
  init(state) {
    return state || {
      cols: false,
      filename: 'filename',
      format: 'txt',
      side: false,
      sort: 'color',
      setx: 'BFZ'
    }
  },
  side(state, side) {
    return {...state, side}
  },
  user(state, [key, val]) {
    return {...state, [key]: val }
  }
}
