import _ from '../_.js'
import App from '../app.js'

const COLORS = [
  'Colorless',
  'White',
  'Blue',
  'Black',
  'Red',
  'Green',
  'Multicolor'
]

const RARITY = [
  'basic',
  'common',
  'uncommon',
  'rare',
  'mythic',
  'special'
]

function group(cards, sort) {
  const tmp = _.group(cards, sort)
  let keys = Object.keys(tmp)

  switch(sort) {
    case 'cmc':
      const arr = []
      keys = keys.filter(key => {
        if (key|0 < 7)
          return true
        arr.push(...tmp[key])
      })
      if (arr.length)
        tmp['6']
          ? tmp['6'].push(...arr)
          : tmp['6'] = arr
      break
    case 'color':
      keys = COLORS.filter(x => keys.indexOf(x) > -1)
      break
    case 'rarity':
      keys = RARITY.filter(x => keys.indexOf(x) > -1)
      break
    case 'type':
      keys.sort()
      break
  }

  return keys.reduce((group, key) => {
    group[key] = tmp[key]
    return group
  }, {})
}

function hover(e) {
  const {offsetLeft} = e.target
  const {clientWidth} = document.documentElement
  const imgWidth = 240
  const colWidth = 180

  const style = offsetLeft + colWidth > clientWidth - imgWidth
    ? 'left: 0'
    : 'right: 0'

  //XXX lol wut
  const el = document.getElementById('hover')
  el.setAttribute('style', style)
  el.src = e.target.src
}

function Grid({groups, zoneName}) {
  const cards = _.flatObj(groups)

  return <div>
    {cards.map(card =>
      <img
        src={card.url}
        onClick={e => App.dispatch('click', [zoneName, card.name, e.shiftKey])}
      />
    )}
  </div>
}

function Cols({groups, zoneName}) {
  return <div className='Cols row'>
    {Object.keys(groups).map(key =>
      <div className='col'>
        <div>{key} - {groups[key].length}</div>
        {groups[key].map(card =>
          <img
            src={card.url}
            onClick={e =>
              App.dispatch('click', [zoneName, card.name, e.shiftKey])}
            onMouseOver={hover}
          />
        )}
      </div>
    )}
  </div>
}

export default function Cards({cache, cols, list, sort}) {
  const View = cols ? Cols : Grid

  return <div id='cards'>
    <img
      onMouseover={hover}
      hidden={!cols}
      id='hover'
    />
    {Object.keys(list).map(zoneName => {
      const cards = []
      for (let cardName in list[zoneName]) {
        const card = cache[cardName.toLowerCase()]
        if (!card)
          continue
        let n = list[zoneName][cardName]
        while (n--)
          cards.push(card)
      }
      const groups = group(cards, sort)

      return <div>
        <h1>{zoneName} - {cards.length}</h1>
        <View groups={groups} zoneName={zoneName}/>
      </div>
    })}
  </div>
}
