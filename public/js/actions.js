import _ from './_.js'
import store from './store.js'
import utils from './utils.js'
import formats from './formats.js'

function dispatchError(err) {
  store.dispatch('error', err)
}
function getCards(list, cb) {
  // TODO promise instead of cb
  let names = {}

  if (typeof list === 'string')
    names = [list]
  else {
    Object.keys(list).forEach(zoneName =>
      Object.keys(list[zoneName]).forEach(name =>
        names[name] = true))
    names = Object.keys(names)
  }
  names = names.map(name => name.toLowerCase())

  let miss = names.filter(name => !(name in store.state.cache))

  if (!miss.length)
    return cb && cb()

  fetch('/cards', {
    method: 'post',
    body: JSON.stringify(miss)
  })
  .then(res => res.json())
  .then(cards => {
    if (cards.error)
      throw cards.error

    store.dispatch('cache', cards)
    cb && cb()
  })
  .catch(dispatchError)
}

let Actions = {
  setZone(side) {
    store.dispatch('setZone', side)
    store.dispatch('user', ['side', side])
  },
  copy() {
    return formats.write.txt(store.state.list)
  },
  download() {
    let {cache, list, user: { filename, filetype }} = store.state

    let text = formats.write[filetype](list, filename, cache)
    utils.download(text, `${filename}.${filetype}`)
  },
  link(key) {
    return {
      value: store.state.user[key],
      requestChange: val => store.dispatch('user', [key, val])
    }
  },
  addPack() {
    let {set} = store.state.user
    fetch('/pack', {
      method: 'post',
      body: JSON.stringify(set)
    })
    .then(res => res.json())
    .then(cards => {
      if (cards.error)
        throw cards.error
      store.dispatch('addCards', cards)
    })
    .catch(dispatchError)
  },
  rehydrate() {
    getCards(store.state.list)
  },
  addCard(name) {
    name = _.ascii(name)
    getCards(name, ()=>
      store.dispatch('addCards', [store.state.cache[name]]))
  },
  setList(file) {
    utils.readAsText(file, text => {
      text = _.ascii(text)
        .toLowerCase()
        .split('\n')
        .map(x => x.trim())
        .filter(x => x)

      let type = file.name.split('.').pop()
      let list = formats.read[type](text)

      getCards(list, ()=> {
        let newList = {
          main: {},
          side: {},
          junk: {}
        }
        for (let zoneName in list) {
          let zone = list[zoneName]
          for (let cardName in zone)
            newList[zoneName][store.state.cache[cardName].name] = zone[cardName]
        }
        store.dispatch('setList', newList)
      })
    })
  }
}

export default Actions
