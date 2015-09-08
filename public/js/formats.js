let read = {
  cod(text) {
    // XXX parsing xml w/ regex
    let list = {
      main: {},
      side: {}
    }
    let zoneName = 'main'
    text.forEach(x => {
      if (x === '<zone name="side">')
        return zoneName = 'side'

      let match = x.match(/<card number="(\d+)" name="(.+)"\/>/)
      if (!match)
        return

      let [, n, name] = match
      list[zoneName][name] = n | 0
    })

    return list
  },
  json(text) {
    return JSON.parse(text.join(''))
  },
  mwdeck(text) {
    let list = {
      main: {},
      side: {}
    }

    text.forEach(x => {
      let [, side, n, cardName] = x.match(/(sb: )?(\d+) \[\w+\] (.+)/)
      cardName = cardName.replace('/', ' // ')

      list[side ? 'side' : 'main'][cardName] = n | 0
    })

    return list
  },
  txt(text) {
    let list = {
      main: {},
      side: {}
    }
    let zoneName = 'main'
    text.forEach(x => {
      if (x === 'sideboard')
        return zoneName = 'side'

      let [, n, cardName] = x.match(/(\d+ )?(.+)/)
      list[zoneName][cardName] = n | 0 || 1
    })

    return list
  }
}

let write = {
  cod(list, filename) {
    let f = zone =>
      Object.keys(zone)
        .map(cardName =>
          `    <card number="${zone[cardName]}" name="${cardName}"/>`)
        .join('\n')

    return `\
<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>${filename}</deckname>
  <zone name="main">
${f(list.main)}
  </zone>
  <zone name="side">
${f(list.side)}
  </zone>
</cockatrice_deck>`
  },
  json(list) {
    return JSON.stringify(list, null, 2)
  },
  mwdeck(list, filename, cache) {
    let ret = []

    ;['main', 'side'].forEach(zoneName => {
      let prefix = zoneName === 'side' ? 'SB: ' : ''
      let zone = list[zoneName]

      for (let cardName in zone) {
        let {code} = cache[cardName.toLowerCase()]
        let count = zone[cardName]
        cardName = cardName.replace(' // ', '/')

        ret.push(`${prefix}${count} [${code}] ${cardName}`)
      }
    })

    return ret.join('\n')
  },
  txt(list) {
    let ret = []
    let f = zone => {
      for (let cardName in zone)
        ret.push(`${zone[cardName]} ${cardName}`)
    }

    f(list.main)
    ret.push('Sideboard')
    f(list.side)

    return ret.join('\n')
  }
}

export default { read, write }
