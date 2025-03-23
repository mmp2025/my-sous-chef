import { YouTubeVideoDetails } from '../types/youtube';
import { config } from '../config/config';

export class YouTubeService {
  static async getVideoDetails(url: string): Promise<YouTubeVideoDetails> {
    const videoId = this.extractVideoId(url);
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${config.youtubeApiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.items?.length) {
        throw new Error('Video not found');
      }

      return {
        title: data.items[0].snippet.title,
        thumbnailUrl: data.items[0].snippet.thumbnails.high.url,
        videoId,
      };
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw new Error('Failed to fetch video details');
    }
  }

  private static extractVideoId(url: string): string {
    let match;
    // Handle shorts URLs
    if (url.includes('/shorts/')) {
      match = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    } else {
      // Handle regular videos
      match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    }
    
    if (!match) throw new Error('Could not extract video ID');
    return match[1];
  }
} 