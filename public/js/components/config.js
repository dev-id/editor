import _ from '../_.js'
import App from '../app.js'
import Store from '../store.js'
import formats from '../formats.js'
import utils from '../utils.js'

import Radio from './radio.js'
import Sets from './sets.js'

function copy() {
  const {list} = Store.state
  const text = formats.write.txt(list)
  const el = document.getElementById('copy')
  el.value = text
  el.select()
}

function download() {
  const {user: {filename, format}, list} = Store.state
  const text = formats.write[format](list)
  utils.download(text, `${filename}.${format}`)
}

function addCard(e) {
  if (e.key !== 'Enter')
    return

  const cardName = _.ascii(e.target.value.trim())
  if (!cardName)
    return

  const {cache} = Store.state

  if (cardName in cache)
    return Store.dispatch('cards', [[cache[cardName]], Store.state.user.side])

  App.post('cards', [cardName], cards =>
    Store.dispatch('cards', [cards, Store.state.user.side]))
}

function addPack() {
  const {setx} = Store.state.user
  App.post('pack', setx, cards =>
    Store.dispatch('cards', [cards, Store.state.user.side]))
}

function read(e) {
  const file = e.target.files[0]
  utils.readAsText(file, text => {
    const {format} = Store.state.user
    text = text.toLowerCase().split('\n')
    const list = formats.read[format](text)
    const miss = App.getMissing(list)

    if (!miss.length)
      return Store.dispatch('list', list)

    App.post('cards', miss, cards => {
      Store.dispatch('cache', cards)
      const {cache} = Store.state

      const newList = {
        main: {},
        side: {},
        junk: {}
      }
      for (let zoneName in list)
        for (let lc in list[zoneName])
          newList[zoneName][cache[lc].name] = list[zoneName][lc]
      Store.dispatch('list', newList)
    })
  })
}

export default function Config({user}) {
  return <div>
    <div>
      <button onClick={download}>download</button>
      <input
        placeholder='filename'
        {...App.vLink('filename')}
      />
      <select {...App.vLink('format')}>
        {Object.keys(formats.write).map(x =>
          <option>{x}</option>
        )}
      </select>
    </div>
    <div>
      <button onClick={copy}>copy</button>
      <textarea
        id='copy'
        placeholder='decklist'
        readOnly={true}
      />
    </div>
    <label>
      <input
        type='checkbox'
        checked={user.side}
        onChange={e => App.dispatch('side', e.target.checked)}
      />
      {' '}add cards to side
    </label>
    <label>
      <input
        type='checkbox'
        {...App.cLink('cols')}
      />
      {' '}column view
    </label>
    <Radio
      labels={['cmc', 'color', 'type', 'rarity']}
      link='sort'
      value={user.sort}
    />
    <div>
      <input
        placeholder='add card'
        onKeyDown={addCard}
      />
    </div>
    <div>
      <button onClick={addPack}>add</button>
      <Sets link='setx'/>
    </div>
    <div>
      <input
        type='file'
        onChange={read}
      />
    </div>
    <div>
      <button onClick={e => App.dispatch('clear')}>clear</button>
    </div>
  </div>
}
