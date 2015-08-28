const STATE = {
  plains:   136,
  island:   137,
  swamp:    138,
  mountain: 139,
  forest:   140
}

for (let name in STATE)
  STATE[name] = {
    cmc: 0,
    code: 'UNH',
    color: 'Colorless',
    name: name[0].toUpperCase() + name.slice(1),
    rarity: 'basic',
    type: 'Land',
    url: `http://magiccards.info/scans/en/uh/${STATE[name]}.jpg`
  }

let state
let funks = {
  cache(cards) {
    cards.forEach(card =>
      state[card.name.toLowerCase()] = card)
  },
  addPack(cards) {
    cards.forEach(card => {
      if (!state[card.name.toLowerCase()])
        state[card.name.toLowerCase()] = card
    })
  },
  addCard(card) {
    if (!state[card.name.toLowerCase()])
      state[card.name.toLowerCase()] = card
    state.error = null
  },
  error(err) {
    state.error = err
  }
}

export default function(_state=STATE, type, data) {
  state = _state
  if (funks[type])
    funks[type](data)
  return state
}
