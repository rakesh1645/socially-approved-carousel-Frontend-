import axios from 'axios';

const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api', timeout: 10000 });

export function getVisitorId() {
  let id = localStorage.getItem('socially-approved-visitor');
  if (!id) { id = crypto.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`; localStorage.setItem('socially-approved-visitor', id); }
  return id;
}

export async function fetchVideos({ signal } = {}) {
  return (await client.get('/videos', {
    params: { limit: 40, visitorId: getVisitorId() },
    signal,
  })).data;
}
export async function toggleLike(videoId) { return (await client.post('/like', { videoId, visitorId: getVisitorId() })).data; }
export async function recordShare(videoId, platform) { return (await client.post('/share', { videoId, platform, visitorId: getVisitorId() })).data; }
