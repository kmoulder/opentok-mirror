const redis = require('redis');
const rand = require('random-key');
const bluebird = require('bluebird');
const _ = require('lodash');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();
const clientMirrorPrefix = 'clientmirror';
const serverMirrorPrefix = 'servermirror';


const getUniqueId = (prefix) => {
  id = rand.generate(8);
  return client.existsAsync(`${prefix}:${id}`)
    .then(res => res === 0 ? id : getUniqueId(prefix));
  }

const _getMirror = (id, prefix, dataFields) => {
  return client.hmgetAsync(`${prefix}:${id}`, dataFields)
    .then((res) => _.zipObject(dataFields, res));
}

const _setMirror = (prefix, data) => {
    let id;
    return getUniqueId(prefix).then(uniqueId => {
      id = uniqueId;
      return client.hmsetAsync(`${prefix}:${id}`, data).then((err, res) => id);
    });
}

module.exports = {
  getClientMirror: (id) => {
    const dataFields = ['sdk', 'javascript','html', 'css'];
    return _getMirror(id, clientMirrorPrefix, dataFields);
  },

  getServerMirror: (id) => {
    const dataFields = ['template', 'json'];
    return _getMirror(id, serverMirrorPrefix, dataFields);
  },

  setClientMirror: (data) => {
    const redisFields = [
        'sdk', data.sdk,
        'javascript', data.javascript,
        'css', data.css,
        'html', data.html
    ];
    return _setMirror(clientMirrorPrefix, redisFields)
  },

  setServerMirror: (data) => {
    const redisFields = [
      'template', data.template,
      'json', data.json
    ]
    return _setMirror(serverMirrorPrefix, redisFields);
    }
}
