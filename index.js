const Twitter = require('twitter');
const request = require('request');

const twitter = new Twitter({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:    process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const commands = {
  // 「やったぁあああ！火曜日おわったぁあああ！！土曜日だぁあああ！！」
  tuesday() {
    Promise.resolve( request.get( process.env.TUESDAY_IMAGE_URL ) )
      .then((data) => twitter.post('media/upload', { media: data }))
      .then((media) => twitter.post('statuses/update', { status: '', media_ids: media.media_id_string }))
      .then((tweet) => console.log('Tweet Success!', tweet.text))
      .catch((err) => console.error('Tweet Error...', err));
  },
};

exports.handler = (event, context) => {
  const command = commands[ event.command ];
  if ( ! command ) return;
  command( event.params );
}
