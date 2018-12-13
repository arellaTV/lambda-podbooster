'use strict';

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs');
const request = require('request');

ffmpeg.setFfmpegPath(ffmpegStatic.path);

module.exports = (audioInput) => {
    return new Promise((resolve, reject) => {
        const audio = audioInput || {};
        const newVolume = process.env.VOLUME || '1.8';

        // Perform a GET request to get the original audio stream
        const originalStream = request(audio.url)
            .on('error', (err) => {
                console.error(err);
                reject(err);
            });

        // Pass the original audio stream to ffmpeg for transcoding and uploading to s3
        ffmpeg(originalStream)
            .format('mp3')
            .audioFilters(`volume=${newVolume}`)
            .on('start', () => {
                console.log('Started processing...');
                console.time(audio.filename);
            })
            .on('end', () => {
                console.log('Finished processing...');
                console.timeEnd(audio.filename);
                resolve(audio);
            })
            .on('error', (err) => {
                console.error(err);
                reject(audio);
            })
            .stream(fs.createWriteStream(`tmp/${audio.filename}`));
    });
}
