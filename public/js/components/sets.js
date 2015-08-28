import SetList from '../setlist.js'

export default class Sets extends React.Component {
  render() {
    return <select valueLink={this.props.valueLink}>
      {SetList.map(({label, sets}) =>
        <optgroup key={label} label={label}>
          {sets.map(([code, name]) =>
            <option key={code} value={code}>{name}</option>
          )}
        </optgroup>
      )}
    </select>
  }
}
