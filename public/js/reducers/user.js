export default function(state = {
  cols: false,
  filename: 'filename',
  filetype: 'txt',
  set: 'ORI',
  side: false,
  sort: 'color'
}, type, data) {
  if (type === 'user') {
    let [key, val] = data
    state[key] = val
  }
  return state
}
