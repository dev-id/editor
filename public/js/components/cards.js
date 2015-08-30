import _ from '../_.js'

const RARITY = [
  'basic',
  'common',
  'uncommon',
  'rare',
  'mythic',
  'special'
]
const COLORS = [
  'Colorless',
  'White',
  'Blue',
  'Black',
  'Red',
  'Green',
  'Multicolor'
]

export default class Cards extends React.Component {
  constructor() {
    super()
    this.state = {
      style: { display: 'none' }
    }
  }
  Grid(zoneName, groups) {
    let {clickCard} = this.props

    let cards = []
    for (let key in groups)
      cards.push(...groups[key])

    return cards.map((card, i) =>
      <img
        key={i}
        src={card.url}
        onClick={e => clickCard([zoneName, card.name, e.shiftKey])}
      />
    )
  }
  Cols(zoneName, groups) {
    let {clickCard} = this.props

    return <div className='Cols row'>
      {Object.keys(groups).map(groupName =>
        <div key={groupName} className='col'>
          <div>{groups[groupName].length} - {groupName}</div>
          {groups[groupName].map((card, i) =>
            <img
              key={i}
              src={card.url}
              onClick={e => clickCard([zoneName, card.name, e.shiftKey])}
              onMouseEnter={e => this.hover(e)}
            />
          )}
        </div>
      )}
    </div>
  }
  hover(e) {
    let {offsetLeft} = e.target
    let {clientWidth} = document.documentElement

    let imgWidth = 240
    let colWidth = 180

    let style = offsetLeft + colWidth > clientWidth - imgWidth
      ? { left: 0 }
      : { right: 0 }

    this.setState({ style, url: e.target.src })
  }
  group(cards) {
    let {sort} = this.props
    _.sort(cards, ['color', 'cmc', 'name'])
    let groups = _.group(cards, sort)
    let keys = Object.keys(groups)

    switch (sort) {
      case 'cmc':
        let arr = []

        for (let key in groups)
          if ((key|0) > 6)
            arr.push(...groups[key])

        if (arr.length) {
          groups['6'] || (groups['6'] = [])
          groups['6'].push(...arr)
          keys = keys.filter(x => (x|0) < 7)
        }
        break
      case 'color':
        keys = COLORS.filter(x => keys.indexOf(x) > -1)
        break
      case 'rarity':
        keys = RARITY.filter(x => keys.indexOf(x) > -1)
        break
      case 'type':
        keys = keys.sort()
        break
    }

    let obj = {}
    keys.forEach(key => obj[key] = groups[key])
    return obj
  }
  render() {
    let {cache, list, cols} = this.props
    let view = cols ? 'Cols' : 'Grid'

    return <div id='cards'>
      {Object.keys(list).map(zoneName => {
        let cards = []
        let zone = list[zoneName]
        for (let cardName in zone) {
          let n = zone[cardName]
          while (n--)
            cards.push(cache[cardName.toLowerCase()] || {})
        }

        let groups = this.group(cards)

        return <div key={zoneName}>
          <h1>{zoneName} - {cards.length}</h1>
          {this[view](zoneName, groups)}
        </div>
      })}
      <img
        hidden={!cols}
        id='hover'
        src={this.state.url}
        style={this.state.style}
        onMouseEnter={e=>this.hover(e)}
      />
    </div>
  }
}
