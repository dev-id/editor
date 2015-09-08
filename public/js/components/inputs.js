let {React} = window
import Sets from './sets.js'

export default class Inputs extends React.Component {
  componentDidMount() {
    React.findDOMNode(this.refs.addCard).focus()
  }
  addCard(e) {
    if (e.key !== 'Enter')
      return

    let node = e.target
    let text = node.value.trim()

    this.props.addCard(text)
  }
  render() {
    return <div>
      <div>
        <input
          placeholder='add card'
          ref='addCard'
          type='text'
          onKeyDown={e => this.addCard(e)}
        />
      </div>
      <div>
        <button
          onClick={this.props.addPack}
          >add
        </button>
        <Sets
          valueLink={this.props.link('set')}
        />
      </div>
      <div>
        <input
          accept={this.props.accept}
          type='file'
          onChange={e => this.props.setList(e.target.files[0])}
        />
      </div>
      <div>
        <button onClick={this.props.clear}>
          clear
        </button>
      </div>
    </div>
  }
}
