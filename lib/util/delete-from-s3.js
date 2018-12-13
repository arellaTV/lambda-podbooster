'use strict';

const fs = require('fs');

module.exports = (file) => {
    console.log(`Deleting ${file}`)
    fs.unlink(`tmp/${file}`, (err) => {
        if (err) console.error(err);
        console.log(`Deleted ${file}`)
    });
}
