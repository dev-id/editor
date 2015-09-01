const SORTS = ['cmc', 'color', 'type', 'rarity']

export default class Settings extends React.Component {
  copy(e) {
    let text = this.props.copy()
    let node = React.findDOMNode(this.refs.copy)
    node.value = text
    node.select()
  }
  render() {
    let {props} = this

    return <div>
      <div>
        <button onClick={props.download}>
          download
        </button>
        <input
          type='text'
          placeholder='filename'
          valueLink={props.link('filename')}
        />
        <select valueLink={props.link('filetype')}>
          {props.filetypes.map(filetype =>
            <option
              key={filetype}
              value={filetype}
              >{filetype}
            </option>
          )}
        </select>
      </div>
      <div>
        <button onClick={e => this.copy(e)}>
          copy
        </button>
        <textarea
          placeholder='decklist'
          readOnly
          ref='copy'
        />
      </div>
      <label>
        <input
          checked={props.side}
          type='checkbox'
          onChange={e => props.setZone(e.target.checked)}
        />
        {' '}
        add cards to side
      </label>
      <label>
        <input
          type='checkbox'
          checkedLink={props.link('cols')}
        />
        {' '}
        column view
      </label>
      <div>
        {SORTS.map(sort =>
          <button
            key={sort}
            disabled={sort === props.sort}
            onClick={e => props.setSort(['sort', sort])}
            >{sort}
          </button>
        )}
      </div>
    </div>
  }
}
