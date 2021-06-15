const container = document.getElementById('root')
const ajax = new XMLHttpRequest()
const content = document.createElement('div')
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'
const store = {
  currentPage: 1,
  lastPage: Math.floor(NEWS_URL.length / 10),
}

const getData = (url) => {
  ajax.open('GET', url, false)
  ajax.send()

  return JSON.parse(ajax.response)
}

const getNewsFeed = () => {
  const newsFeed = getData(NEWS_URL)
  const newsList = []

  newsList.push('<ul>')

  for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push( `
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `)
  }

newsList.push('</ul>')
newsList.push(`
  <div>
    <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전</a>
    <a href="#/page/${store.currentPage < store.lastPage ? store.currentPage + 1 : store.lastPage}">다음</a>
  </div>
`)
container.innerHTML = newsList.join('')
}

const newsDetail = () => {
  const id = location.hash.substr(7)
  const newsContent = getData(CONTENT_URL.replace('@id', id))

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `
}

const router = () => {
  const routePath = location.hash

  if (routePath === '') {
    getNewsFeed()
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substr(7))
    getNewsFeed()
  } else {
    newsDetail()
  }
}

window.addEventListener('hashchange', router)

router()