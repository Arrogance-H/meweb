require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = parseInt(process.env.SERVER_PORT, 10) || 8787;
const EMBY_URL = (process.env.EMBY_URL || '').replace(/\/$/, '');
const EMBY_API_KEY = process.env.EMBY_API_KEY || '';

app.use(cors());
app.use(express.json());

// Helper: build Emby API URL
function embyUrl(path, params = {}) {
  const url = new URL(`${EMBY_URL}${path}`);
  url.searchParams.set('api_key', EMBY_API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

// Helper: get image URL for an item
function imageUrl(itemId, type = 'Primary', tag) {
  if (!tag) return null;
  return `${EMBY_URL}/Items/${itemId}/Images/${type}?api_key=${EMBY_API_KEY}&tag=${tag}&maxHeight=400&quality=85`;
}

// Helper: map raw Emby item to a clean object
function mapItem(item) {
  const primaryTag = item.ImageTags && item.ImageTags.Primary;
  const backdropTag =
    item.BackdropImageTags && item.BackdropImageTags.length > 0
      ? item.BackdropImageTags[0]
      : null;
  const thumbTag = item.ImageTags && item.ImageTags.Thumb;

  return {
    id: item.Id,
    name: item.Name,
    type: item.Type,
    year: item.ProductionYear || null,
    rating: item.CommunityRating ? Math.round(item.CommunityRating * 10) / 10 : null,
    overview: item.Overview || '',
    genres: item.Genres || [],
    poster: imageUrl(item.Id, 'Primary', primaryTag),
    backdrop: imageUrl(item.Id, 'Backdrop', backdropTag),
    thumb: imageUrl(item.Id, 'Thumb', thumbTag),
    dateAdded: item.DateCreated || null,
  };
}

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', embyUrl: EMBY_URL ? EMBY_URL : 'not configured' });
});

// GET /api/latest?limit=20
// Returns recently added movies + episodes mixed, sorted by DateCreated desc
app.get('/api/latest', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const url = embyUrl('/Items', {
      IncludeItemTypes: 'Movie,Series',
      SortBy: 'DateCreated',
      SortOrder: 'Descending',
      Limit: limit,
      Recursive: 'true',
      Fields: 'Overview,Genres,ImageTags,BackdropImageTags,DateCreated,CommunityRating',
      ImageTypeLimit: 1,
      EnableImageTypes: 'Primary,Backdrop,Thumb',
    });
    const { data } = await axios.get(url);
    res.json((data.Items || []).map(mapItem));
  } catch (err) {
    console.error('Error fetching latest:', err.message);
    res.status(502).json({ error: 'Failed to fetch latest items from Emby' });
  }
});

// GET /api/movies?limit=40&page=1
app.get('/api/movies', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 40, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const startIndex = (page - 1) * limit;
    const url = embyUrl('/Items', {
      IncludeItemTypes: 'Movie',
      SortBy: 'SortName',
      SortOrder: 'Ascending',
      Limit: limit,
      StartIndex: startIndex,
      Recursive: 'true',
      Fields: 'Overview,Genres,ImageTags,BackdropImageTags,DateCreated,CommunityRating',
      ImageTypeLimit: 1,
      EnableImageTypes: 'Primary,Backdrop,Thumb',
    });
    const { data } = await axios.get(url);
    res.json({
      items: (data.Items || []).map(mapItem),
      total: data.TotalRecordCount || 0,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching movies:', err.message);
    res.status(502).json({ error: 'Failed to fetch movies from Emby' });
  }
});

// GET /api/shows?limit=40&page=1
app.get('/api/shows', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 40, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const startIndex = (page - 1) * limit;
    const url = embyUrl('/Items', {
      IncludeItemTypes: 'Series',
      SortBy: 'SortName',
      SortOrder: 'Ascending',
      Limit: limit,
      StartIndex: startIndex,
      Recursive: 'true',
      Fields: 'Overview,Genres,ImageTags,BackdropImageTags,DateCreated,CommunityRating',
      ImageTypeLimit: 1,
      EnableImageTypes: 'Primary,Backdrop,Thumb',
    });
    const { data } = await axios.get(url);
    res.json({
      items: (data.Items || []).map(mapItem),
      total: data.TotalRecordCount || 0,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching shows:', err.message);
    res.status(502).json({ error: 'Failed to fetch TV shows from Emby' });
  }
});

app.listen(PORT, () => {
  console.log(`EmbyFlix server running on port ${PORT}`);
  console.log(`Emby endpoint: ${EMBY_URL || '(not configured)'}`);
});
