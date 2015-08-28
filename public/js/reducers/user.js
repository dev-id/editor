export default function(state = {
  cols: false,
  sort: 'color',
  filename: 'filename',
  filetype: 'txt',
  set: 'ORI',
  side: false
}, type, data) {
  if (type === 'user') {
    let [key, val] = data
    state[key] = val
  }
  return state
}
