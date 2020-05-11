let postIdParam = parseInt(window.location.pathname.split('/').slice(-1))
if (!postIdParam){
  console.log('invalid post id')
  alert('invalid post id, must be a number')
}else{
  getPost(postIdParam)
}

async function getPost(postIdParam){
  const response = await fetch(`/api/post/${postIdParam}`);
  const post = await response.json();
  addDataToDOM([post])
  getPosts(1)
  clickFirstPost()
}

function clickFirstPost(){
  const allElements = postscontainer.children
  let foundElement = false
  let firstPost
  for (element of allElements){
    if (!foundElement){
      if (element.classList.contains('item')){
        found = true
        firstPost = element 
      }
    }
  }
  firstPost.click()
}