import _ from '../_.js'
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
    let fromName = side ? 'main' : 'side'

    _.mergeAdd(to, state[fromName])
    state[fromName] = {}
  },
  addCards(cards, gState) {
    let zoneName = gState.user.side ? 'side' : 'main'

    let list = _.count(cards, 'name')
    _.mergeAdd(state[zoneName], list)
  },
  clickCard([zoneName, cardName]) {
    if (!--state[zoneName][cardName])
      delete state[zoneName][cardName]

    zoneName = zoneName === 'main' ? 'side' : 'main'
    _.mergeAdd(state[zoneName], cardName)
  },
  setCard([zoneName, cardName, n]) {
    if (n)
      state[zoneName][cardName] = n
    else
      delete state[zoneName][cardName]
  }
}

export default function (_state = {
  main: {},
  side: {}
}, type, data, gState) {

  state = _state

  if (types[type])
    types[type](data, gState)

  return state
}
