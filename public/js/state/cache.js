export default {
  init() {
    const state = {
      plains:   136,
      island:   137,
      swamp:    138,
      mountain: 139,
      forest:   140
    }

    for (let name in state)
      state[name] = {
        cmc: 0,
        code: 'UNH',
        color: 'Colorless',
        name: name[0].toUpperCase() + name.slice(1),
        rarity: 'basic',
        type: 'Land',
        url: `http://magiccards.info/scans/en/uh/${state[name]}.jpg`
      }

    return state
  },
  cache(state, cards) {
    return this.cards(state, [cards])
  },
  cards(state, [cards]) {
    state = {...state, error: null}
    cards.forEach(card => state[card.name.toLowerCase()] = card)
    return state
  },
  error(state, error) {
    return {...state, error}
  }
}
