const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt0319061/';

(async() => {

    const response = await request(URL);

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1').text();

    console.log(title);
})()