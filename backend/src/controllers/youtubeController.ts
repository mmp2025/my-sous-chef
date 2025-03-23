import { Request, Response } from 'express';
import { YouTubeService } from '../services/youtubeService';

export class YouTubeController {
  static async getVideoDetails(req: Request, res: Response) {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Updated regex to include YouTube Shorts
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      if (!youtubeRegex.test(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }

      const videoDetails = await YouTubeService.getVideoDetails(url);
      res.json(videoDetails);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
} 