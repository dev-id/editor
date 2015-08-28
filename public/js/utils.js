export default {
  download(data, filename) {
    let a = document.createElement('a')
    a.download = filename
    a.href = `data:,${encodeURIComponent(data)}`
    document.body.appendChild(a)
    a.click()
    a.remove()
  },
  readAsText(file, cb) {
    let reader = new FileReader
    reader.onload = e => cb(reader.result)
    reader.readAsText(file)
  }
}
