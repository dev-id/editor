import dom from './dom.js'
import Editor from './components/editor.js'
import Store from './store.js'
import reducers from './state/index.js'
import App from './app.js'

window.dom = dom
const state = JSON.parse(localStorage.state || '{}')
Store.init(reducers, state)
dom.render(Store, Editor, document.body)
App.rehydrate()

window.addEventListener('unload', ()=>
  localStorage.state = JSON.stringify(Store.state, (k, v) =>
    k === 'cache' ? undefined : v))
