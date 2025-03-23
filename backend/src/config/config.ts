import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
}; 