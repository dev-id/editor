import Store from '../store.js'

export default function Radio({labels, link, value}) {
  return <div>
    {labels.map(label =>
      <button
        disabled={label === value}
        onClick={e => Store.dispatch('user', [link, label])}
        >{label}
      </button>
    )}
  </div>
}
