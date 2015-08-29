import fs from 'fs'
import raw from '../../data/AllSets'
import _ from '../_'

let Cards = {}
let Sets = {}

before()

let types = ['commander', 'core', 'expansion', 'planechase', 'un']
let codes = ['pHHO', 'CNS', 'MMA', 'MM2', 'PTK', 'VMA', 'TPR']
for (let code in raw) {
  let rawSet = raw[code]
  if (types.includes(rawSet.type)
  || codes.includes(code))
    doSet(rawSet)
}

after()

list()
fs.writeFileSync('data/cards.json', JSON.stringify(Cards, null, 2))
fs.writeFileSync('data/sets.json', JSON.stringify(Sets, null, 2))

function before() {
  raw.UGL.cards = raw.UGL.cards.filter(x => x.layout !== 'token')

  // starter cards do not appear in boosters
  for (let code of ['8ED', '9ED', 'M15', 'ORI'])
    raw[code].cards = raw[code].cards.filter(x => !x.starter)

  delete raw.PTK.booster

  raw.TSP.cards.push(...raw.TSB.cards)
  delete raw.TSB

  for (let card of raw.ISD.cards)
    if (card.layout === 'double-faced')
      card.rarity = 'special'

  for (let card of raw.DGM.cards)
    if (/Guildgate/.test(card.name))
      card.rarity = 'special'

  for (let card of raw.CNS.cards)
    if (card.type === 'Conspiracy'
    || /draft/.test(card.text))
      card.rarity = 'special'

  for (let card of raw.FRF.cards)
    if (card.types[0] === 'Land'
    && card.name !== 'Crucible of the Spirit Dragon')
      card.rarity = 'special'
}

function after() {
  for (let card of raw.pHHO.cards) {
    let name = (card.names ? card.names.join(' // ') : card.name).toLowerCase()
    let n = parseInt(card.number)
    Cards[name].sets.pHHO.url = `http://magiccards.info/scans/en/hho/${n}.jpg`
  }

  Sets.PLC.size = Sets.FUT.size = 11

  let {DGM} = Sets
  DGM.mythic = DGM.mythic.filter(x => x !== 'maze\'s end')
  DGM.special = {
    common: DGM.special,
    special: [
      'blood crypt',
      'breeding pool',
      'godless shrine',
      'hallowed fountain',
      'overgrown tomb',
      'sacred foundry',
      'steam vents',
      'stomping ground',
      'temple garden',
      'watery grave',
      'maze\'s end'
    ]
  }
  alias(DGM.special.special, 'DGM')

  let {FRF} = Sets
  FRF.special = {
    common: FRF.special,
    special: [
      'flooded strand',
      'bloodstained mire',
      'wooded foothills',
      'windswept heath',
      'polluted delta'
    ]
  }
  alias(FRF.special.special, 'FRF')
}

function list() {
  raw.CNS.name = 'Conspiracy'

  let list = {
    expansion: [],
    core: [],
    other: []
  }

  for (let code in Sets) {
    let {name, type} = raw[code]
    let label = ['core', 'expansion'].includes(type) ? type : 'other'
    list[label].push([code, name])
  }

  list = Object.keys(list).map(label =>
    ({ label, sets: list[label].reverse() }))

  let js = 'export default ' + JSON.stringify(list)
  fs.writeFileSync('data/setlist.js', js)
}

function alias(names, dst) {
  // some boosters contain cards which are not in the set proper
  for (let name of names) {
    let card = Cards[name]
    let src = Object.keys(card.sets).pop()
    card.sets[dst] = card.sets[src]
  }
}

function doSet(rawSet) {
  let set = {
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
    special: []
  }

  let cards = doCards(rawSet.cards)
  for (let name in cards) {
    let card = cards[name]
    set[card.set.rarity].push(name)

    if (Cards[name])
      Cards[name].sets[rawSet.code] = card.set
    else {
      card.sets = { [rawSet.code]: card.set }
      delete card.set
      Cards[name] = card
    }
  }

  if (!rawSet.booster)
    return

  set.size = rawSet.booster.filter(x => x === 'common').length

  for (let rarity of ['mythic', 'special'])
    if (!set[rarity].length)
      delete set[rarity]

  Sets[rawSet.code] = set
}

function doCards(rawCards) {
  let cards = {}

  for (let rawCard of rawCards) {
    let rarity = rawCard.rarity.split(' ')[0].toLowerCase()
    if (rarity === 'basic')
      continue

    let {name} = rawCard
    if (['double-faced', 'flip'].includes(rawCard.layout)
      && name !== rawCard.names[0])
      continue

    if (rawCard.layout === 'split')
      name = rawCard.names.join(' // ')

    name = _.ascii(name)
    let lc = name.toLowerCase()

    if (cards[lc]) {
      if (rawCard.layout === 'split') {
        let card = cards[lc]
        card.cmc += rawCard.cmc
        if (card.color !== rawCard.colors[0])
          card.color = 'Multicolor'
      }
      continue
    }

    let {colors} = rawCard
    let color
      = !colors ? 'Colorless'
      : colors.length === 1 ? colors[0]
      : 'Multicolor'

    cards[lc] = {
      cmc: rawCard.cmc || 0,
      color,
      name,
      type: rawCard.types.pop(),
      set: {
        rarity,
        url: `http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${rawCard.multiverseid}`
      }
    }
  }

  return cards
}
