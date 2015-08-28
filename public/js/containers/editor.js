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
        setCard={_dispatch('setCard')}
        list={state.list}
      />
      <Settings
        {...state.user}
        copy={Actions.copy}
        link={Actions.link}
        filetypes={Object.keys(formats.write)}
        download={Actions.download}
        setZone={Actions.setZone}
        setSort={_dispatch('user')}
      />
      <div>{state.cache.error}</div>
      <Inputs
        accept={Object.keys(formats.read).map(x => `.${x}`).join(',')}
        clear={_dispatch('clear')}
        {...Actions}
      />
      <Cards
        cols={state.user.cols}
        clickCard={_dispatch('clickCard')}
        cache={state.cache}
        list={state.list}
        sort={state.user.sort}
      />
    </div>
  }
}
