'use strict';

const fs = require('fs');

module.exports = (rssAudioFiles) => {
    return new Promise((resolve, reject) => {
        fs.readdir('tmp/', (err, currentFiles) => {
            if (err) {
                reject(err);
            }

            const currentFilesDictionary = {};
            const rssAudioFilesDictionary = {};

            const staleFiles = [];
            const incomingFiles = [];

            // Create a dictionary of all current files in s3
            currentFiles.forEach(filename => {
                currentFilesDictionary[filename] = filename;
            });

            // Create a dictionary of all files in the rss feed
            rssAudioFiles.forEach(audio => {
                rssAudioFilesDictionary[audio.filename] = audio.filename;
            });

            // Collect all the incoming files
            rssAudioFiles.forEach(audio => {
                if (!currentFilesDictionary[audio.filename]) {
                    incomingFiles.push(audio);
                }
            });

            // Collect all files that we need to get rid of
            currentFiles.forEach(file => {
                if (!rssAudioFilesDictionary[file]) {
                    staleFiles.push(file);
                }
            });

            // Consolidate all collections into an object
            const result = {
                inclusionList: incomingFiles,
                exclusionList: staleFiles,
                activeList: rssAudioFiles,
            }

            resolve(result);
        });
    });
}
