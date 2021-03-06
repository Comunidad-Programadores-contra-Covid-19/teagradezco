const postscontainer = document.querySelector(".postscontainer");
const orderSelector = document.querySelector(".order-selector");
const loader = document.querySelector('.loader');
let last_known_scroll_position = 0;
let loading = false
let page = 1
let postList = []

orderSelector.addEventListener('change', (event) => {
  removeAllPostsFromGrid()
  page = 0
  showLoading(page)
});

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if(clientHeight + scrollTop >= scrollHeight - 300 & !loading ) {
    loading = true
    showLoading(page);
    page += 1
  }
  if(clientHeight + scrollTop < scrollHeight - 100) {
    loading = false
  }
})

function showLoading(page) {
  loader.classList.add('show');
  getPosts(page,orderSelector.value)
}

async function getPosts (page = 0,order){
  const response = await fetch(`/cartas/${page}/${order}`);
  const postsData = await response.json();
  addDataToDOM(postsData)
  removeReportedPosts()
}


function addDataToDOM(posts) {
  loader.classList.remove('show');
  posts = addHeightWidthToPosts(posts)
  postList.push(...posts)
  
  for (post of posts){

    const postHTML = templates.post(post)
    const postElement = CreateElementFromHTML(postHTML)
    if (post.font === 'Adobe Garamond Pro' || post.font === 'Quicksand bold'){
      post.font = 'Poppins'
    } 
    postElement.style.fontFamily = post.font
    if (!post.imgPath){
      const NonLightcolor = post.color.split('-')[1] || 'purple'
      postElement.classList.add(`border-${NonLightcolor}`)
    }    
    postscontainer.appendChild(postElement);  
  }
}

async function removeReportedPosts(){
  const repornse = await getReportedPosts()
  const reportedPostIDs = await repornse.json()
  removeReportedPostsFromGrid(reportedPostIDs)
}

async function getReportedPosts(){
  const reportedPosts = await fetch('/api/reportedPostIDsByIP', {
    method: 'get',
    headers: {
      "Content-Type": "application/json"
    }
  })
  return reportedPosts
}

function removeReportedPostsFromGrid(reportedPostIDs){
  const elements = Array.from(postscontainer.children)
  const itemElements = elements.filter((element)=>element.classList.contains('item'))
  for (const itemElement of itemElements){
    const postId = getPostIdFromElement(itemElement) 
    if(reportedPostIDs.includes(postId)){
      itemElement.parentNode.removeChild(itemElement);
    }
  }
}

function removeAllPostsFromGrid(){
  const elements = Array.from(postscontainer.children)
  const itemElements = elements.filter((element)=>element.classList.contains('item'))
  for (const itemElement of itemElements){
    itemElement.parentNode.removeChild(itemElement);
  }
}

function CreateElementFromHTML(html){
  let template = document.createElement('div')
  template.innerHTML = html
  return template.firstElementChild
}

function addHeightWidthToPosts (posts){
  let selectedPosts = []
  for (const post of posts) {
    post.height = 'height'
    post.width = 'width'
    if (!post.imgPath) {
      if (post.text.length < 35 ){
          selectedPosts.push(post)
      }
      if (post.text.length >= 35 ) {
        if (Math.random() < 0.5){
          post.height = 'height2'
        }else{
          post.width = 'width2'
        }
        selectedPosts.push(post)
      }
      if (post.text.length >= 280) {
        post.text = post.text.substring(1, 280) + '...';
        selectedPosts.push(post)
      }
    } else {
      if (post.imgWidth > 750 && post.imgHeight > 750) {
        post.height = 'height2'
        post.width = 'width2'
      } else {
        if (post.imgWidth > 1.6 * post.imgHeight) {
          post.width = 'width2'
        }
        if (post.imgHeight > 1.6 * post.imgWidth) {
          post.height = 'height2'
        }
      }
      selectedPosts.push(post)
    }
  }
  return selectedPosts
}

function like(LikeElement) {
  const postId = getPostIdFromElement(LikeElement)
  let like = true
  for (const childElem of LikeElement.childNodes){
    if (childElem.nodeName === "IMG"){
      if(childElem.src.slice(-5) == '1.png'){
        childElem.src = '/img/clap-filled2.png'        
      }else{
        like = false
        childElem.src = '/img/clap1.png'
      }
    }
    if (childElem.nodeName === "SPAN"){
      if (like){
        childElem.innerHTML = parseInt(childElem.innerHTML,10) + 1
      }else{
        childElem.innerHTML = parseInt(childElem.innerHTML,10) - 1
      }
    }    
  }
  fetch('/like', {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({postId:postId})
  })
}

function report(reportElement){
  alert('La carta fue reportada, gracias')
  if(reportElement.src.slice(-5) == '1.png'){
    reportElement.src = '/img/report-filled2.png'
    overlay = reportElement.parentElement
    overlay.style.opacity = 1
  }else{
    reportElement.src = '/img/report1.png'
    overlay = reportElement.parentElement
    overlay.style.opacity = 0
  }

  const postId = getPostIdFromElement(reportElement)
  fetch('/report', {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({postId:postId})
  })
}


function getPostIdFromElement(element){
  for (aClass of Array.from(element.classList)){
    if (aClass.split(':')[0]==='id'){
      return parseInt(aClass.split(':')[1])
    }
  }
  return null
  
}