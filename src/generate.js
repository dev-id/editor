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

    switch (code) {
    case 'DGM':
    case 'FRF':
      special = _.rand(20)
        ? special.common
        : special.special
      break
    case 'MMA':
    case 'MM2':
      special = selectRarity(set)
      break
    case 'VMA':
      //http://www.wizards.com/magic/magazine/article.aspx?x=mtg/daily/arcana/1491
      if (_.rand(53))
        special = selectRarity(set)
      break
    }

    if (special)
      cardNames.push(_.sample(special, 1))

    return cardNames.map(cardName => generate.card(cardName, code))
  }
}

export default generate
