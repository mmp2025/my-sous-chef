import axios from 'axios';
import { config } from '../config/config';
import { VideoDetails } from '../types/youtube';

export class YouTubeService {
  private static readonly API_URL = 'https://www.googleapis.com/youtube/v3';

  static async getVideoDetails(url: string): Promise<VideoDetails> {
    try {
      const videoId = this.extractVideoId(url);
      
      const response = await axios.get(`${this.API_URL}/videos`, {
        params: {
          part: 'snippet',
          id: videoId,
          key: config.youtubeApiKey
        }
      });

      const video = response.data.items[0];
      if (!video) {
        throw new Error('Video not found');
      }

      return {
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.medium.url,
        videoId: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw new Error('Failed to fetch video details');
    }
  }

  private static extractVideoId(url: string): string {
    try {
      let videoId = '';
      
      // Handle shorts URL
      if (url.includes('/shorts/')) {
        videoId = url.split('/shorts/')[1].split('?')[0];
      } else {
        // Handle regular YouTube URL
        const urlParams = new URL(url).searchParams;
        videoId = urlParams.get('v') || '';
      }

      if (!videoId) {
        throw new Error('Could not extract video ID');
      }

      return videoId;
    } catch (error) {
      throw new Error('Invalid YouTube URL');
    }
  }
} 