import _ from '../_.js'
let state

function getInitialState() {
  return {
    main: {},
    side: {},
    junk: {}
  }
}

let types = {
  setList(list) {
    state = list
  },
  clear() {
    state = getInitialState()
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
  clickCard([zoneName, cardName, shift]) {
    if (!--state[zoneName][cardName])
      delete state[zoneName][cardName]

    zoneName = shift
      ? zoneName === 'junk' ? 'main' : 'junk'
      : zoneName === 'side' ? 'main' : 'side'

    _.mergeAdd(state[zoneName], cardName)
  },
  setCard([zoneName, cardName, n]) {
    if (n)
      state[zoneName][cardName] = n
    else
      delete state[zoneName][cardName]
  }
}

export default function (_state, type, data, gState) {
  state = _state || getInitialState()

  if (types[type])
    types[type](data, gState)

  return state
}
