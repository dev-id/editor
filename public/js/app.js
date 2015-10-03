import Store from './store.js'

const {dispatch} = Store

export default {
  dispatch(type, data) {
    dispatch(type, data)
  },
  cLink(key) {
    return {
      checked: Store.state.user[key],
      onChange: e => dispatch('user', [key, e.target.checked])
    }
  },
  vLink(key) {
    return {
      value: Store.state.user[key],
      onChange: e => dispatch('user', [key, e.target.value])
    }
  },
  post(type, data, cb) {
    fetch(`/${type}`, {
      body: JSON.stringify(data),
      method: 'post'
    })
    .then(res => res.json())
    .then(json =>
      json.error
        ? Promise.reject(new Error(json.error))
        : cb(json)
    )
    .catch(err => Store.dispatch('error', err.message))
  },
  rehydrate() {
    const miss = this.getMissing(Store.state.list)
    if (!miss.length)
      return

    this.post('cards', miss, cards => Store.dispatch('cache', cards))
  },
  getMissing(list) {
    const cardNames = Object.keys(Object.keys(list).reduce((obj, zoneName) =>
      Object.keys(list[zoneName]).reduce((obj, cardName) => {
        obj[cardName.toLowerCase()] = true
        return obj
      }, obj), {}))

    const {cache} = Store.state
    return cardNames.filter(cardName => !(cardName in cache))
  }
}
