const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');
const request = require('request');

const URLS = [{
        url: 'https://www.imdb.com/title/tt0319061/',
        id: 'big_fish'
    },
    {
        url: 'https://www.imdb.com/title/tt0167260/',
        id: 'lord_of_the_rings_3'
    }
];

(async() => {

    let moviesData = [];

    for (let movie of URLS) {

        const response = await requestPromise({
            uri: movie.url,
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

        let title = $('div[class="title_wrapper"] > h1').text().trim();
        let rating = $('span[itemprop="ratingValue"]').text();
        let poster = $('div[class="poster"] > a > img').attr('src');
        let totalRatings = $('div[class="imdbRating"] > a').text();
        let releaseDate = $('a[title="See more release dates"]').text().trim();
        let popularity = $('#title-overview-widget > div.plot_summary_wrapper > div.titleReviewBar > div:nth-child(5) > div.titleReviewBarSubItem > div:nth-child(2) > span').text().trim();
        let genres = [];

        $('div[class="title_wrapper"] a[href^="/search/"]').each((i, elm) => {
            let genre = $(elm).text();
            genres.push(genre);
        });

        moviesData.push({
            title,
            rating,
            poster,
            totalRatings,
            releaseDate,
            genres
        })

        // Downloading files (images)
        let file = fs.createWriteStream(`${movie.id}.jpg`);

        await new Promise((resolve, reject) => {
            let stream = request({
                    uri: poster,
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
                    gzip: true
                })
                .pipe(file)
                .on('finish', () => {
                    console.log('Image Downloaded');
                    resolve();
                })

        });



    }






    /* To save the data as Json or Csv
    const fields = ['title', 'rating'];

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(moviesData);

    // fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');
    fs.writeFileSync('./data.csv', csv, 'utf-8');*/



})()