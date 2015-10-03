const Store = {
  update: ()=>{},
  init(reducers, state) {
    this.state = state
    Store.reducers = reducers
    Store.dispatch('init')
  },
  subscribe(update) {
    Store.update = update
  },
  dispatch(type, data) {
    console.log('dispatch', type, data)
    const {reducers, state} = Store
    for (let key in reducers)
      if (type in reducers[key])
        state[key] = reducers[key][type](state[key], data)
    Store.update()
  }
}

export default Store
