import ffmpeg from 'fluent-ffmpeg';
import youtubeDl from 'youtube-dl-exec';
import fs from 'fs/promises';
import path from 'path';

export class AudioService {
  private static readonly TEMP_DIR = path.join(__dirname, '../../temp');

  static async initialize() {
    // Ensure temp directory exists
    try {
      await fs.access(this.TEMP_DIR);
    } catch {
      await fs.mkdir(this.TEMP_DIR, { recursive: true });
    }
  }

  static async extractAudio(videoId: string): Promise<string> {
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const outputPath = path.join(this.TEMP_DIR, `${videoId}.mp3`);

      // Download audio using youtube-dl
      await youtubeDl(videoUrl, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: outputPath,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
          'referer:youtube.com',
          'user-agent:Mozilla/5.0'
        ]
      });

      return outputPath;
    } catch (error) {
      console.error('Audio extraction error:', error);
      throw new Error('Failed to extract audio from video');
    }
  }

  static async cleanup(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  private static extractVideoId(url: string): string {
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
  }
} 