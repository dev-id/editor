export default {
  init(state) {
    return state || {
      main: {},
      side: {},
      junk: {}
    }
  },
  cards(state, [cards, side]) {
    state = {...state}
    const zoneName = side ? 'side' : 'main'
    cards.forEach(card => {
      state[zoneName][card.name] || (state[zoneName][card.name] = 0)
      state[zoneName][card.name]++
    })
    return state
  },
  clear() {
    return this.init()
  },
  click(state, [zoneName, cardName, shift]) {
    state = {...state}
    if (!--state[zoneName][cardName])
      delete state[zoneName][cardName]

    zoneName = shift
      ? zoneName === 'junk' ? 'main' : 'junk'
      : zoneName === 'side' ? 'main' : 'side'
    state[zoneName][cardName] || (state[zoneName][cardName] = 0)
    state[zoneName][cardName]++
    return state
  },
  setCard(state, [zoneName, cardName, n]) {
    state = {...state}
    if (n)
      state[zoneName][cardName] = n
    else
      delete state[zoneName][cardName]
    return state
  },
  list(state, list) {
    return {...this.init(), ...list}
  },
  side(state, side) {
    const next = this.init()
    next.junk = state.junk

    const toName = side ? 'side' : 'main'
    const to = next[toName] = state[toName]
    const from = state[side ? 'main' : 'side']

    for (let cardName in from) {
      to[cardName] || (to[cardName] = 0)
      to[cardName] += from[cardName]
    }
    return next
  }
}
