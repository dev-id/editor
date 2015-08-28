export default {
  at(arr, index) {
    let {length} = arr
    index = (index % length + length) % length
    return arr[index]
  },
  count(arr, key) {
    let ret = {}
    for (let x of arr) {
      if (!ret[x[key]]) ret[x[key]] = 0
      ret[x[key]]++
    }
    return ret
  },
  ascii(s) {
    return s.replace(/[Æâàáéíöúû’]/g, c => {
      switch (c) {
      case 'Æ': return 'AE'
      case 'â': case 'à': case 'á': return 'a'
      case 'é': return 'e'
      case 'í': return 'i'
      case 'ö': return 'o'
      case 'ú': case 'û': return 'u'
      case '’': return '\''
      }
    })
  },
  flat(arr) {
    return [].concat.apply([], arr)
  },
  group(arr, key) {
    let ret = {}
    for (let x of arr) {
      if (!ret[x[key]]) ret[x[key]] = []
      ret[x[key]].push(x)
    }
    return ret
  },
  mergeAdd(obj, src) {
    //XXX no deep merge
    if (typeof src === 'string')
      src = { [src]: 1 }

    for (let key in src) {
      if (!obj[key]) obj[key] = 0
      obj[key] += src[key]
    }
  },
  pad(s) {
    return s < 10 ? '0' + s : s
  },
  rand(n) {
    return Math.random() * n | 0
  },
  sample(arr, n=1) {
    // http://en.wikipedia.org/wiki/Fisher–Yates_shuffle
    let i = arr.length
    let end = i - n
    while (i > end) {
      let j = this.rand(i--)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(-n)
  },
  seq(start, end) {
    if (!end) {
      end = start
      start = 0
    }

    let ret = []
    while (start <= end)
      ret.push(start++)
    return ret
  },
  shuffle(arr) {
    return this.sample(arr, arr.length)
  },
  sort(arr, keys) {
    return arr.sort((a, b) => {
      for (let key of keys) {
        if (a[key] < b[key])
          return -1
        if (a[key] > b[key])
          return +1
      }
      return 0
    })
  },
  uid() {
    return Math.random().toString(36).slice(2)
  }
}
