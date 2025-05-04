import express from 'express';
import { scrapeEULegislators } from './scraper.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static HTML
app.use(express.static(path.join(__dirname, 'public')));

// Serve live MEP data
app.get('/meps', async (req, res) => {
    try {
        const meps = await scrapeEULegislators();
        res.json(meps);
    } catch (err) {
        res.status(500).json({ error: 'Failed to scrape MEPs' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
