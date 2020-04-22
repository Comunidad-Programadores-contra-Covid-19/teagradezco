const priv = require('./private/private.json');
const configTwitter = require('./private/configTwitter.json')

module.exports = {
    // Database config
    db_username: priv.db_username,
    db_password: priv.db_password,
    db_database: priv.db_database,
    db_host: priv.db_host,
    db_dialect: "postgres",

    // Twitter config
  	consumer_key:configTwitter.consumer_key,
 	consumer_secret:configTwitter.consumer_secret,
  	access_token:configTwitter.access_token,
  	access_token_secret:configTwitter.access_token_secret,

    // App constants
    domain:'localhost:8000',
    firstNPosts: 20,
    fonts: ["Arial","Verdana"],
}