import { scrapeEULegislators } from './scraper.js';

scrapeEULegislators().then(meps => {

}).catch(err => {
    console.error('-> Error during scraping:', err);
});