'use strict';

require('dotenv').config();

const podboost   = require('./podboost');

exports.handler = (event, context, callback) => {
    podboost(callback);
};
