let reducers

let store = {
  state: {},
  update: ()=>{},
  save() {
    localStorage.state = JSON.stringify(store.state, (k, v) =>
      k === 'cache' ? undefined : v)
  },
  init(_reducers, update) {
    reducers = _reducers

    try {
      store.state = JSON.parse(localStorage.state)
    } catch(err) {}
    store.dispatch()

    store.update = update
  },
  dispatch(type, data) {
    console.log('dispatch', type, data)
    for (let key in reducers)
      store.state[key] = reducers[key](store.state[key], type, data)
    store.update()
  },
  _dispatch(type) {
    return data =>
      store.dispatch(type, data)
  }
}

export default store
