import { Request, Response } from 'express';
import { TranscriptionService } from '../services/transcriptionService';
import { YouTubeService } from '../services/youtubeService';

export class TranscriptionController {
  static async startTranscription(req: Request, res: Response) {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Extract video ID from URL (shorts or regular)
      let videoId = '';
      if (url.includes('/shorts/')) {
        videoId = url.split('/shorts/')[1].split('?')[0];
      } else {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
      }

      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }

      const transcription = await TranscriptionService.transcribeYouTubeVideo(videoId);
      res.json(transcription);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to start transcription' });
    }
  }

  static async getTranscriptionStatus(req: Request, res: Response) {
    try {
      const { transcriptId } = req.params;

      if (!transcriptId) {
        return res.status(400).json({ error: 'Transcript ID is required' });
      }

      const status = await TranscriptionService.getTranscriptionStatus(transcriptId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get transcription status' });
    }
  }
} 