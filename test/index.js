require('dotenv').config({ path: 'test/.env' });
const assert = require('assert');
const stream = require('stream');
const request = require('request');
const Twitter = require('twitter');
const handler = require('..').handler;

// Fake
request.get = function() { return new stream.Readable };
Twitter.prototype.post = function(path, params) {
  return new Promise((resolve, reject) => {
    switch (path) {
      case 'media/upload':
        params.media instanceof stream.Readable ? resolve({ media_id_string: 1 }) : reject();
        break;
      case 'statuses/update':
        params.status !== undefined ? resolve() : reject();
        break;
    }
  });
};

describe('handler', () => {
  describe('tuesday', () => {
    it('should tweet image', (done) => {
      handler({ command: 'tuesday' }, {}, (err, result) => {
        assert.equal(result, 'Tweet Success!');
        done();
      });
    });
  });
});
