const EVENTS = [
  'Change',
  'Click',
  'Input',
  'KeyDown',
  'MouseOver'
].reduce((obj, key) => {
  obj[`on${key}`] = key.toLowerCase()
  return obj
}, {})

const SVGNS = 'http://www.w3.org/2000/svg'
const XLINKNS = 'http://www.w3.org/1999/xlink'

function handler(e) {
  const {target, type} = e
  if (!target.events || !(type in target.events))
    return

  e.key = e.keyIdentifier
  target.events[type](e)
}

function create(vnode) {
  if (typeof vnode.type === 'function')
    return create(unroll(vnode))

  if (vnode.type === 'text') {
    vnode.el = document.createTextNode(vnode.child)
    return vnode
  }

  switch (vnode.type) {
    case 'svg':
    case 'use':
      vnode.el = document.createElementNS(SVGNS, vnode.type)
      break
    default:
      vnode.el = document.createElement(vnode.type)
  }

  vnode.children = vnode.children.map(child => create(child))
  vnode.children.forEach(child => vnode.el.appendChild(child.el))
  setProps(vnode)
  return vnode
}

function unroll(vnode) {
  let next = vnode
  while (typeof next.type === 'function')
    next = next.type(next.props)

  next._type = vnode.type
  next._props = vnode.props
  next.key = vnode.key
  return next
}

function setProps(vnode) {
  const {el} = vnode
  el.events = {}

  for (let key in vnode.props) {
    if (key in EVENTS)
      el.events[EVENTS[key]] = vnode.props[key]
    else if (key === 'xlinkHref')
      el.setAttributeNS(XLINKNS, 'xlink:href', vnode.props[key])
    else
      el[key] = vnode.props[key]
  }
}

function shallowEqual(a, b) {
  for (let key in a)
    if (!(key in b))
      return

  for (let key in b)
    if (a[key] !== b[key])
      return

  return true
}

function update(a, b) {
  if (typeof b.type === 'function') {
    if (a._type !== b.type)
      return create(b)
    if (shallowEqual(a._props, b.props))
      return a
    b = unroll(b)
  }
  if (a.type !== b.type)
    return create(b)
  if (a.type === 'text') {
    a.el.textContent = b.child
    return a
  }

  b.el = a.el
  updateChildren(a, b)
  setProps(b)
  return b
}

function keys(children) {
  return children.reduce((obj, child) => {
    obj[child.key] = child
    return obj
  }, {})
}

function updateChildren(a, b) {
  const {el} = a

  const bKeys = keys(b.children)
  const aKeys = keys(a.children.filter(child => {
    if (child.key in bKeys
    && (child._type || child.type) === bKeys[child.key].type)
      return true
    el.removeChild(child.el)
  }))

  if (!b.children.length)
    return

  b.children = b.children.map(child => {
    if (child.key in aKeys) {
      return update(aKeys[child.key], child)
    } else
      return create(child)
  })

  let bi = b.children.length - 1
  let edge = b.children[bi].el

  if (edge !== el.childNodes[el.childNodes.length - 1])
    el.appendChild(edge)

  if (bi === 0)
    return

  while (bi--) {
    const prev = b.children[bi].el
    if (prev !== edge.previousSibling)
      el.insertBefore(prev, edge)
    edge = prev
  }
}

export default {
  element(type, props, ...children) {
    children = Array.prototype.concat.apply(Array.prototype, children)
      .filter(child => child != null)
      .map((child, i) => {
        switch(typeof child) {
          case 'number':
          case 'string':
            child = {type: 'text', child}
        }
        child.key || (child.key = i)
        return child
      })
    return {type, props, children}
  },
  render(store, app, root) {
    let vnode = create(app(store.state))
    root.appendChild(vnode.el)

    for (let onKey in EVENTS)
      vnode.el.addEventListener(EVENTS[onKey], handler)

    store.subscribe(() => {
      const next = app(store.state)
      vnode = update(vnode, next)
    })
  }
}
