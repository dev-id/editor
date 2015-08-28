import Cards from '../data/cards'
import Sets from '../data/sets'
import _ from './_'

let generate = {
  card(cardName, code) {
    let card = Cards[cardName]
    let {sets} = card

    if (!code)
      code = Object.keys(sets).pop()
    let set = sets[code]

    card = Object.assign({ code }, card, set)
    delete card.sets

    return card
  },
  pack(code) {
    let {common, uncommon, rare, mythic, special, size} = Sets[code]

    if (mythic && !_.rand(8))
      rare = mythic

    let cardNames = _.flat([
      _.sample(common, size),
      _.sample(uncommon, 3),
      _.sample(rare, 1)
    ])

    switch(code) {
    }

    if (special)
      cardNames.push(_.sample(special, 1))

    return cardNames.map(cardName => generate.card(cardName, code))
  }
}

export default generate
