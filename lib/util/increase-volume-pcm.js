'use strict';

const { finished } = require('stream');
const fs = require('fs');
const lame = require("lame");
const request = require('request');
const volume = require('pcm-volume');

module.exports = (audioInput) => {
    return new Promise(async (resolve, reject) => {
        const audio = audioInput || {};
        const newVolume = parseFloat(process.env.VOLUME) || 1.8;
        let volumeStream = new volume();
        let decoder = new lame.Decoder();
        let encoder = new lame.Encoder({
            channels: 1,
            bitDepth: 16,
            sampleRate: 44100,
            bitRate: 64,
            outSampleRate: 44100,
            mode: lame.MONO
        });

        console.time(audio.filename);

        // Perform a GET request to get the original audio stream
        const originalStream = request(audio.url)
            .on('error', (err) => {
                console.error(err);
                reject(err);
            });

        // Set the volume to 180% of it's original volume
        volumeStream.setVolume(newVolume);

        // Decode the mp3 to pcm, apply the new volume, encode back to mp3
        originalStream.pipe(decoder);
        decoder.pipe(volumeStream);
        volumeStream.pipe(encoder);

        // Upload the transcoded file to s3
        encoder.pipe(fs.createWriteStream(`tmp/${audio.filename}`));

        // When the upload is done, move on to the next audio file
        finished(encoder, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log('Finished processing...');
                console.timeEnd(audio.filename);
                audio.stream = encoder;
                resolve(audio);
            }
        });
    });
}
