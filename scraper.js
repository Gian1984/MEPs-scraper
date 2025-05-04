import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeEULegislators = async () => {
  console.log('-> Starting scraper...');

  const url = 'https://www.europarl.europa.eu/meps/en/full-list/all';
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept-Language': 'en',
    },
  });

  console.log('-> HTML length:', response.data.length);

  const $ = cheerio.load(response.data);

  const meps = $('.erpl_member-list-item-content')
      .map((_, el) => {
        const name = $(el).find('.erpl_title-h4').text().trim();

        const additionalInfo = $(el).find('.sln-additional-info');
        const partyGroup = $(additionalInfo.get(0)).text().trim();
        const country = $(additionalInfo.get(1)).text().trim();

        const relativeUrl = $(el).attr('href');
        const idMatch = relativeUrl.match(/\/(\d+)$/);
        const id = idMatch ? idMatch[1] : null;

        const image = $(el).find('span img').attr('src');

        const normalizeName = (str) =>
            str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const nameParts = normalizeName(name).split(' ');
        const firstnameParts = [];
        const lastnameParts = [];

        nameParts.forEach((part) => {
          if (/^[A-ZÀ-Ÿ]+$/.test(part)) {
            lastnameParts.push(part);
          } else {
            firstnameParts.push(part.toUpperCase());
          }
        });

        const formattedName = `${firstnameParts.join('+')}_${lastnameParts.join('+')}`;
        const fullUrl = `https://www.europarl.europa.eu/meps/en/${id}/${formattedName}/home`;

        return {
          name,
          lastName: lastnameParts.slice(-1)[0] || '',
          partyGroup,
          country,
          url: fullUrl,
          image,
        };
      })
      .get();

  console.log('-> First MEP:', meps[42]);
  console.log('-> Done.');

  return meps;
};


