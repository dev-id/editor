import MWS from '../data/mws'
import Cards from '../data/cards'
import Sets from '../data/sets'
import _ from './_'

function selectRarity() {
  // average pack contains:
  // 14 cards
  // 10 commons
  // 3 uncommons
  // 7/8 rare
  // 1/8 mythic
  // * 8 -> 112/80/24/7/1

  let n = _.rand(112)
  if (n < 1)
    return 'mythic'
  if (n < 8)
    return 'rare'
  if (n < 32)
    return 'uncommon'
  return 'common'
}

let generate = {
  card(cardName, code) {
    let card = Cards[cardName]
    let {sets} = card

    if (!code)
      code = Object.keys(sets).pop()

    let set = sets[code]

    if (MWS[code])
      code = MWS[code]

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

    switch (code) {
    case 'DGM':
    case 'FRF':
      special = _.rand(20)
        ? special.common
        : special.special
      break
    case 'MMA':
    case 'MM2':
      special = set[selectRarity()]
      break
    case 'VMA':
      //http://www.wizards.com/magic/magazine/article.aspx?x=mtg/daily/arcana/1491
      if (_.rand(53))
        special = set[selectRarity()]
      break
    }

    if (special)
      cardNames.push(_.sample(special, 1))

    return cardNames.map(cardName => generate.card(cardName, code))
  }
}

export default generate
