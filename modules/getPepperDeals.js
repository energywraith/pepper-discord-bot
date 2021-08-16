const axios = require('axios');
const cheerio = require('cheerio');

const getPepperDeals = async (page = 0) => {
  const firstPage = await axios.get(`https://www.pepper.pl/?page=${page}&ajax=true&layout=horizontal`);

  if (!firstPage.data.data) return null;

  let $ = cheerio.load(firstPage.data.data.content);
  let articles = $('article.thread').not('.thread--expired');

  articles = Array.from(articles).map(article => {
    $ = cheerio.load(article);

    return {
      title: $('.thread-title').text(),
      image: $('.thread-image').attr('src'),
      price: $('.thread-price').text(),
      articleLink: $('.thread-link').attr('href'),
      dealLink: $('.cept-dealBtn').attr('href'),
      votes: $('.vote-temp').text().replace(/(\r\n|\n|\r|\t)/gm, ""),
      lifeTime: $('.cept-meta-ribbon-hot .hide--toW3').text(),
    };
  })

  return articles;
}

module.exports = getPepperDeals;