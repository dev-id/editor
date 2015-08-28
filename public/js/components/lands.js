const BASICS = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']
const COLORS = ['White', 'Blue', 'Black', 'Red', 'Green']

export default class Lands extends React.Component {
  render() {
    let {list} = this.props

    return <table id='lands'><tbody>
      <tr>
        <td></td>
        {COLORS.map(c =>
          <td key={c}>
            <img src={`http://www.wizards.com/Magic/redesign/${c}_Mana.png`}/>
          </td>
        )}
      </tr>
      {['main', 'side'].map(zoneName =>
        <tr key={zoneName}>
          <td>{zoneName}</td>
          {BASICS.map(cardName =>
            <td key={cardName}>
              <input
                min='0'
                type='number'
                value={list[zoneName][cardName] | 0}
                onChange={e =>
                  this.props.setCard([zoneName, cardName, e.target.value | 0])}
              />
            </td>
          )}
        </tr>
      )}
    </tbody></table>
  }
}
