import Editor from './containers/editor.js'
import store from './store.js'
import reducers from './reducers/index.js'

class App extends React.Component {
  componentWillMount() {
    store.init(reducers, this)
    window.addEventListener('unload', store.save)
  }
  render() {
    return <Editor {...store}/>
  }
}

React.render(<App/>, document.getElementById('app'))
