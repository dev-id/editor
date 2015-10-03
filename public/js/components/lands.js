import Store from '../store.js'

const BASICS = [
  'Plains',
  'Island',
  'Swamp',
  'Mountain',
  'Forest'
]

export default function Lands({list}) {
  return <table id='lands'>
    <tr>
      <th></th>
      {BASICS.map(cardName =>
        <th>
          <svg>
            <use xlinkHref={`/media/icons.svg#${cardName}`}></use>
          </svg>
        </th>
      )}
    </tr>
    {['main', 'side'].map(zoneName =>
      <tr>
        <td>{zoneName}</td>
        {BASICS.map(cardName =>
          <td>
            <input
              onInput={e =>
                Store.dispatch('setCard',
                  [zoneName, cardName, e.target.value|0])}
              min='0'
              type='number'
              value={list[zoneName][cardName] | 0}
            />
          </td>
        )}
      </tr>
    )}
  </table>
}
