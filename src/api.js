import _ from './_'
import Cards from '../data/cards'
import Sets from '../data/sets'
import generate from './generate'

let api = {
  cards(names) {
    let invalid = []
    let cards = []
    names.forEach(name => {
      if (name in Cards)
        cards.push(generate.card(name))
      else
        invalid.push(name)
    })
    if (invalid.length) {
      let error = `invalid cards: ${invalid.splice(-5).join('; ')}`
      if (invalid.length)
        error += ` and ${invalid.length} more`

      return { error }
    }
    return cards
  },
  pack(code) {
    return code in Sets
      ? generate.pack(code)
      : { error: `invalid set: ${code}` }
  }
}

export default function(type, json) {
  try {
    json = JSON.parse(json)
  } catch(err) {
    return { error: 'invalid json' }
  }

  return api[type]
    ? api[type](json)
    : { error: `invalid type: ${type}` }
}
