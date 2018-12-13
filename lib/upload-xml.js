'use strict';

const cheerio = require('cheerio');
const deleteFromS3 = require('./util/delete-from-s3');
const fs = require('fs');

module.exports = (podcastData) => {
    return new Promise((resolve, reject) => {
        // Resolve out of this promise immediately if there are no changes detected
        if (podcastData.inclusionList.length === 0) {
            return resolve(podcastData, 'No changes detected');
        }

        // Load the xml into the parsing api
        const $ = cheerio.load(podcastData.xmlBody);

        // Update the urls for each of the audio files
        podcastData.activeList.forEach((audio) => {
            const enclosureElement = $('enclosure').get(audio.index);
            $(enclosureElement).attr('url', `${process.env.S3_HOSTED_URL_BASE}/${audio.filename}`);
        });

        // Create a new xml with our new urls and upload to s3
        const xmlStream = fs.createWriteStream('tmp/index.xml')
            .on('error', (err) => {
                console.error(err);
                reject(err);
            });

        xmlStream.write($.html());
        xmlStream.end();

        // Delete stale audio files
        podcastData.exclusionList.forEach(deleteFromS3);

        // Pass the podcast data for future callbacks
        console.timeEnd('Total Time');
        resolve(podcastData);
    });
}
