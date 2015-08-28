let state

let types = {
  setList(list) {
    state = list
  },
  clear() {
    state = {
      main: {},
      side: {}
    }
  },
  setZone(side) {
    let to = side ? state.side : state.main
    let from = side ? state.main : state.side

    for (let cardName in from) {
      to[cardName] || (to[cardName] = 0)
      to[cardName] += from[cardName]
      delete from[cardName]
    }
  },
  addPack(cards) {
    cards.forEach(card => {
      state.main[card.name] || (state.main[card.name] = 0)
      state.main[card.name]++
    })
  },
  addCard({name}) {
    state.main[name] || (state.main[name] = 0)
    state.main[name]++
  },
  clickCard([zoneName, cardName]) {
    if (!--state[zoneName][cardName])
      delete state[zoneName][cardName]

    zoneName = zoneName === 'main' ? 'side' : 'main'
    state[zoneName][cardName] || (state[zoneName][cardName] = 0)
    state[zoneName][cardName]++
  },
  setCard([zoneName, cardName, n]) {
    state[zoneName][cardName] = n
  }
}

export default function (_state = {
  main: {},
  side: {}
}, type, data) {

  state = _state

  if (types[type])
    types[type](data)

  return state
}
