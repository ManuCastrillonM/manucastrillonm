import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'node:fs';

// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const YOUTUBE_API_URL =`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=4&playlistId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;

async function getYoutubeVideos() {
  const videos = await 
    fetch(YOUTUBE_API_URL)
      .then(res => res.json())
      .then(data => data.items)
      .catch(err => console.log(err));

  return videos;
}

function generateHTML(videos) {
  let html = '';
  
  videos.forEach(video => {
    html += `
<a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
  <img width="22%" src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
</a>`;
  });

  return html;
}

async function displayVideos(videos) {
  const html = generateHTML(videos);
  const template = await readFileSync('src/readme-template.md.tpl', 'utf8');
  const readme = template.replace('{{YOUTUBE_VIDEOS}}', html);

  await writeFileSync('./README.md', readme);
}

getYoutubeVideos()
  .then(videos => displayVideos(videos));