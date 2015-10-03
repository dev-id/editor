import Cards from './cards.js'
import Config from './config.js'
import Lands from './lands.js'

export default function Editor({cache, list, user}) {
  return <div>
    <Lands list={list}/>
    <div className='error'>{cache.error}</div>
    <Config user={user}/>
    <Cards
      cache={cache}
      cols={user.cols}
      list={list}
      sort={user.sort}
    />
  </div>
}
