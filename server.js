const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const app = express();
const PORT = 3000;

// === Credentials ===
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || 'hYh-Q5aYMyozT1c-q14OtQ';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || 'dDC9ZyqzKTP_TsPd_uxcqIHMe9Anzw';
const NEWS_API_KEY = process.env.NEWS_API_KEY || '07f0debb78fb43a4ba0251fb001e71d1';

let redditAccessToken = null;
let redditTokenExpires = 0;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Reddit API Functions ---
const getRedditToken = async () => {
    if (redditAccessToken && Date.now() < redditTokenExpires) {
        return redditAccessToken;
    }
    try {
        const credentials = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials',
            agent: httpsAgent
        });
        if (!response.ok) throw new Error(`Reddit Auth API responded with status: ${response.status}`);
        const data = await response.json();
        redditAccessToken = data.access_token;
        redditTokenExpires = Date.now() + (data.expires_in - 60) * 1000;
        return redditAccessToken;
    } catch (error) {
        console.error("Failed to get Reddit access token:", error);
        return null;
    }
};

app.get('/api/reddit', async (req, res) => {
    const { subreddit, after } = req.query;
    if (!subreddit) return res.status(400).json({ error: 'Subreddit parameter is required.' });
    try {
        const token = await getRedditToken();
        if (!token) return res.status(500).json({ error: 'Could not authenticate with Reddit.' });
        let url = `https://oauth.reddit.com/r/${subreddit}/hot.json?limit=100`;
        if (after) url += `&after=${after}`;
        const redditResponse = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
            agent: httpsAgent
        });
        if (!redditResponse.ok) return res.status(redditResponse.status).json({ error: `Failed to fetch from r/${subreddit}` });
        const data = await redditResponse.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

app.get('/api/user-activity', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username parameter is required.' });
    try {
        const token = await getRedditToken();
        if (!token) return res.status(500).json({ error: 'Could not authenticate with Reddit.' });
        const url = `https://oauth.reddit.com/user/${username}/overview.json?limit=25`;
        const redditResponse = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
            agent: httpsAgent
        });
        if (!redditResponse.ok) return res.status(redditResponse.status).json({ error: `Failed to fetch activity for u/${username}` });
        const data = await redditResponse.json();
        res.json(data);
    } catch (error) {
        console.error('User Activity Proxy Error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// --- NewsAPI Endpoint ---
app.get('/api/get-news', async (req, res) => {
    if (!NEWS_API_KEY || NEWS_API_KEY.includes('PASTE')) {
        return res.status(500).json({ error: 'NewsAPI key is not configured.' });
    }
    const query = '(crime OR assault OR theft OR riot OR violence OR threat) AND ("Madhya Pradesh" OR Bhopal OR Indore OR Gwalior OR Jabalpur OR Ujjain)';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=100`;
    try {
        console.log('[INFO] Fetching recent news articles...');
        const newsResponse = await fetch(url, {
            headers: { 'X-Api-Key': NEWS_API_KEY },
            agent: httpsAgent
        });
        if (!newsResponse.ok) {
            const errorData = await newsResponse.json();
            return res.status(newsResponse.status).json({ error: 'Failed to fetch from NewsAPI.' });
        }
        const newsData = await newsResponse.json();
        const normalizedNews = newsData.articles.map(article => ({
            source: 'News',
            id: article.url,
            user: article.source.name,
            subreddit: 'News',
            text: `${article.title} - ${article.description || ''}`,
            permalink: article.url
        }));
        res.json(normalizedNews);
    } catch (error) {
        console.error('[ERROR] NewsAPI proxy error:', error);
        res.status(500).json({ error: 'An internal server error occurred while fetching news.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});