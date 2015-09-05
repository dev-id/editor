let {React} = window
import Actions from '../actions.js'
import Cards from '../components/cards.js'
import Inputs from '../components/inputs.js'
import Lands from '../components/lands.js'
import Settings from '../components/settings.js'
import formats from '../formats.js'

export default class Editor extends React.Component {
  componentDidMount() {
    Actions.rehydrate()
  }
  render() {
    let {_dispatch, state} = this.props

    return <div>
      <Lands
        list={state.list}
        setCard={_dispatch('setCard')}
      />
      <Settings
        {...state.user}
        copy={Actions.copy}
        download={Actions.download}
        filetypes={Object.keys(formats.write)}
        link={Actions.link}
        setZone={Actions.setZone}
        setSort={_dispatch('user')}
      />
      <div>{state.cache.error}</div>
      <Inputs
        {...Actions}
        accept={Object.keys(formats.read).map(x => `.${x}`).join(',')}
        clear={_dispatch('clear')}
      />
      <Cards
        cache={state.cache}
        cols={state.user.cols}
        clickCard={_dispatch('clickCard')}
        list={state.list}
        sort={state.user.sort}
      />
    </div>
  }
}
