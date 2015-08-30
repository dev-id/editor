import _ from './_.js'
import store from './store.js'
import utils from './utils.js'
import formats from './formats.js'

function dispatchError(err) {
  store.dispatch('error', err)
}

const BASICS = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']

let Actions = {
  rehydrate() {
    let {list, cache} = store.state

    let names = {}
    Object.keys(list).forEach(zoneName =>
      Object.keys(list[zoneName]).forEach(name =>
        names[name] = true))
    names = Object.keys(names)
      .filter(name => BASICS.indexOf(name) === -1)
      .map(name => name.toLowerCase())

    if (!names.length)
      return

    fetch('/list', {
      method: 'post',
      body: JSON.stringify(names)
    })
    .then(res => res.json())
    .then(json => store.dispatch('cache', json))
    .catch(dispatchError)
  },
  setZone(side) {
    store.dispatch('setZone', side)
    store.dispatch('user', ['side', side])
  },
  copy() {
    return formats.write.txt(store.state.list)
  },
  download() {
    let {list} = store.state
    let {filename, filetype} = store.state.user

    let text = formats.write[filetype](list, filename, store.state.cache)
    utils.download(text, `${filename}.${filetype}`)
  },
  link(key) {
    return {
      value: store.state.user[key],
      requestChange: val => store.dispatch('user', [key, val])
    }
  },
  addCard(name) {
    name = _.ascii(name).toLowerCase()
    let card = store.state.cache[name]
    if (card)
      return store.dispatch('addCards', [card])
    fetch('/card', {
      method: 'post',
      body: JSON.stringify(name)
    })
    .then(res => res.json())
    .then(json => {
      if (json.error)
        store.dispatch('error', json.error)
      else
        store.dispatch('addCards', [json])
    })
    .catch(dispatchError)
  },
  addPack() {
    let {set} = store.state.user
    fetch('/pack', {
      method: 'post',
      body: JSON.stringify(set)
    })
    .then(res => res.json())
    .then(json => store.dispatch('addCards', json))
    .catch(dispatchError)
  },
  setList(file) {
    utils.readAsText(file, text => {
      text = _.ascii(text)
        .split('\n')
        .map(x => x.trim().toLowerCase())
        .filter(x => x)

      let type = file.name.split('.').pop()
      let list = formats.read[type](text)

      validate(list)
    })

    function validate(list) {
      let names = {}
      Object.keys(list).forEach(zoneName =>
        Object.keys(list[zoneName]).forEach(name =>
          names[name] = true))
      names = Object.keys(names)
        .filter(name => BASICS.indexOf(name) === -1)

      fetch('/list', {
        method: 'post',
        body: JSON.stringify(names)
      })
      .then(res => res.json())
      .then(cards => {
        if (cards.error)
          throw cards.error

        store.dispatch('cache', cards)

        let newList = {
          main: {},
          side: {},
          junk: {}
        }
        for (let zoneName in list) {
          let zone = list[zoneName]
          for (let cardName in zone)
            newList[zoneName][store.state.cache[cardName].name]
              = list[zoneName][cardName]
        }
        store.dispatch('setList', newList)
      })
      .catch(dispatchError)
    }
  }
}

export default Actions
