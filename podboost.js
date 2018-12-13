'use strict';

const getPodcast    = require('./lib/get-podcast');
const increaseVolume = require('./lib/upload-audio');
const uploadXML      = require('./lib/upload-xml');

module.exports = (callback) => {
    callback = callback || function(){};
    getPodcast()
        .then(increaseVolume)
        .then(uploadXML)
        .then(callback)
        .catch(callback);
}
