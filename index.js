const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'https://www.imdb.com/title/tt0319061/';

(async() => {

    const response = await request({
        uri: URL,
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en,es;q=0.9,es-ES;q=0.8',
            'cache-control': 'max-age=0',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
        },
        gzip: true // To uncompress responses

    });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1').text();
    let rating = $('span[itemprop="ratingValue"]').text();

    console.log(title, rating);
})()