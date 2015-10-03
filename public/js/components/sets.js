import App from '../app.js'
import setdata from '../setdata.js'

export default function Sets({link}) {
  return <select {...App.vLink(link)}>
    {setdata.map(({label, sets}) =>
      <optgroup label={label}>
        {sets.map(([code, name]) =>
          <option value={code}>{name}</option>
        )}
      </optgroup>
    )}
  </select>
}
