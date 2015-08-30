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

export default function(state=STATE, type, data) {
  switch(type) {
  case 'addCards':
  case 'cache':
    state.error = null
    data.forEach(card =>
      state[card.name.toLowerCase()] = card)
    break
  case 'error':
    state.error = data
    break
  }
  return state
}
