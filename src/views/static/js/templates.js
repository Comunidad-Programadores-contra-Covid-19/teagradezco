const templates = {}
const partials = {}

partials.imgTag = ({height,width,imgPath}) => `<img class='image ${height} ${width}' src="${imgPath}">`
partials.mainText = ({text}) => `<span>${text}</span>`
partials.overlayFrom = (author) => {
  if(author)
    return `<div class="overlay-from">De: ${author} </div>`
  else
    return `<div class="overlay-from"></div>`
}

templates.post = (post) => {
  const {color,height,width,text,author,id,likes,imgPath} = post
  const NonLightcolor = post.color.split('-')[1] || 'purple'

  const html =
  `<div class="item ${color} ${height} ${width} id:${id}" >
    ${imgPath ? partials.imgTag(post) : partials.mainText(post)}
    <div class="overlay overlayFade ${NonLightcolor}" onClick="createLightbox(this,${id})">
      ${partials.overlayFrom(author)}
      <div class="overlay-buttons-1 id:${id}" onclick="like(this)">
          <img src="/img/clap1.png" width="35" height="35">
          <span>${likes}</span>
      </div>
      <img class="overlay-buttons-2 id:${id}" src="/img/share.png" data-toggle="modal" data-target="#sharing-modal" onclick="share_social(this)"  width="35" height="35">
      <img class="overlay-buttons-3 id:${id}" src="/img/report1.png" onclick="report(this)" width="35" height="35">
    </div>
  </div>  
  `
  return html
}


templates.sharing_container = (post) => {
  const url = `https://www.graciasporcuidarnos.com.ar/carta/${post.id}` 
  const twitter_url = `https://twitter.com/intent/tweet?text=Te%comparto%20esta%20carta%20de%20agradecimiento%20&url=${url}&hashtags=graciasporcuidarnos`
  const html = `
    <div class="sharing-container">
      <div class="post-url">
        <input class="post-url-input" value="${url}" size="46" readonly></input>
      </div>
      <div class="sharing_container_buttons">
        <button class="post-url-button"><img src="/img/icons8-copy-52.png" width=''><br>copiar</button>
        <a class="mobile" href="whatsapp://send?text=Te%20comparto%20esta%20carta%20de%20agradecimiento%20${url}">
            <img src="/img/whatsapp_logo.png">
        </a>
        <a class="large" href="https://web.whatsapp.com/send?text=Te%20comparto%20esta%20carta%20de%20agradecimiento%20${url}" target="_blank">
            <img src="/img/whatsapp_logo.png">
        </a>
        <a href="https://www.facebook.com/sharer.php?u=${url}"  target="_blank">
          <img src="/img/facebook_logo.png">
        </a>
        <a href="${twitter_url}" target="_blank">
            <img src="/img/twitter_logo.png">    
        </a>
      </div>
    </div>
  `

  return html 
}

templates.share_email = (post) => {
  const url = `https://www.graciasporcuidarnos.com.ar/carta/${post.id}`
  const html = `
  <div class="send_email_buttons">
    <button type="button" class="btn send-btn btn-primary" onclick="send_email('${post.text}','${post.author}','${url}')">Enviar</button>
  </div>
  `
  return html;
}

