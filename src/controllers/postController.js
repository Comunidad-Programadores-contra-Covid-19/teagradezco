const Sequelize = require("sequelize");
const Post = require('../models').Post;
const postValidator = require('../validators/postValidator');
const config = require('../config/config.js');
const mailer = require('../services/mailer')
const postService = require('../services/postService')

exports.new_post = function(req, res) {
  let {
    text,
    imgpath,
    author,
    font,
    color
  } = req.body;
  try {
    postValidator({
      text: text,
      imgpath: imgpath,
      author: author,
      font: font,
      color: color
    });
    Post.create({
        text,
        imgpath,
        author,
        font,
        color
      })
      .then(post => res.render('create_post_congrats',{card:post,url:post.url()}));
  } catch (error) {
    res.status(500).send(error.message);
  }
}


exports.likePost = function(req, res) {
  Post.findByPk(req.body.postId)
    .then(function(likedPost) {
      if (!likedPost) throw new Error('No existe el post que se intenta likear')
      likedPost.update({
          likes: Sequelize.literal('likes + 1')
        })
        .then(res.status(200).send())
    }).catch(err => res.status(500).send(err.message))
}


exports.get_posts = async function(req, res) {
  // TODO filtrar por tags tambien
  let tags = req.body.tags || 'all';
  let page = req.params.page || 1
  let order = req.params.order || 'likes'
  try{
    const posts = await postService.get_posts(page,order)
    if (posts){
      res.status(200).send(posts)  
    }else{
      res.status(400).send({})  
    }
  }catch (e){
    res.status(500).send(e)
  }
  
}


exports.get_post_by_id = async function(req, res) {
  // TODO filtrar por tags tambien
  let tags = req.body.tags || 'all';
  let postId = req.params.id || 1
  
  try{
    const Searchedpost = await postService.getpostByID(postId)
    res.status(200).send(Searchedpost)  
  }catch (e){
    res.status(500).send(e)
  }
  
}

exports.getPostByIdView = function(req,res){
  Post.findByPk(parseInt(req.params.id))
  .then(post => {
    res.render('postById', {post: post})
  })
}

exports.get_posts_html = async (req,res) =>{
  let tags = req.body.tags || 'all';
  let page = req.params.page || 1
  
  try{
    const posts = await postService.get_posts(page)
    posts = postService.addHeightWidthToPosts(posts)
    

    res.status(200).send(posts)  

  }catch (e){
    res.status(500).send(e)
  }
}

exports.new_post_from_hashtag = function(req, res) {
  let hashtag = req.body.hashtag
  if (hashtag.charAt(0) === '#') {
    hashtag = hashtag.slice(1)
  }

  T.get('/search/tweets/', {
    q: hashtag,
    count: 5
  }, function(err, data, response) {
    try {
      Post.create({
          text: data.text,
          imgpath: 'test/path',
          author: 'testAuthor'
        })
        .then(post => console.log(post));
    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  })

  res.sendStatus(200)
}

exports.create_post_page = function(req, res) {
  res.render('create_post', {
    url: config.domain.concat('/carta')
  });
}


exports.mail = function(req,res){    
  mailOptions = {
    from: config.mail_user,
    to: req.body.to,
    subject: req.body.subject, 
    html: req.body.text        
  };

  mailer.sendMail(mailOptions, function(error,info){
    if (error) {
      console.log(error);
      res.status(500).send()
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send()
    }
  });
}

exports.test = function(req,res){
  console.log(req.params.id)
  res.send('hola')
  res.end()
}