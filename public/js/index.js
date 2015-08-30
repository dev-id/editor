import Editor from './containers/editor.js'
import store from './store.js'
import reducers from './reducers/index.js'

class App extends React.Component {
  componentWillMount() {
    console.log('%chttps://github.com/aeosynth/editor', 'font-size: x-large')
    store.init(reducers, this.forceUpdate.bind(this))
    window.addEventListener('unload', store.save)
  }
  render() {
    return <Editor
      state={store.state}
      _dispatch={store._dispatch}
    />
  }
}

React.render(<App/>, document.getElementById('app'))
