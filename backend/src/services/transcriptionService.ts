import axios from 'axios';
import { config } from '../config/config';
import { TranscriptionResponse } from '../types/transcription';
import { AudioService } from './audioService';
import fs from 'fs';

export class TranscriptionService {
  private static readonly ASSEMBLY_AI_API_URL = 'https://api.assemblyai.com/v2';

  static async transcribeYouTubeVideo(videoId: string): Promise<TranscriptionResponse> {
    let audioPath: string | null = null;

    try {
      // Extract audio from video
      audioPath = await AudioService.extractAudio(videoId);

      // Upload audio file to AssemblyAI
      const uploadResponse = await this.uploadAudioFile(audioPath);

      // Start transcription
      const response = await axios.post(
        `${this.ASSEMBLY_AI_API_URL}/transcript`,
        {
          audio_url: uploadResponse.upload_url,
          language_detection: true
        },
        {
          headers: {
            'Authorization': config.assemblyAiApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        status: 'queued',
        text: '',
        id: response.data.id
      };
    } catch (error) {
      console.error('Transcription Error:', error);
      throw new Error('Failed to start transcription');
    } finally {
      // Cleanup temporary file
      if (audioPath) {
        await AudioService.cleanup(audioPath);
      }
    }
  }

  private static async uploadAudioFile(filePath: string): Promise<{ upload_url: string }> {
    const fileStream = fs.createReadStream(filePath);
    
    const response = await axios.post(
      `${this.ASSEMBLY_AI_API_URL}/upload`,
      fileStream,
      {
        headers: {
          'Authorization': config.assemblyAiApiKey,
          'Content-Type': 'application/octet-stream',
          'Transfer-Encoding': 'chunked'
        }
      }
    );

    return response.data;
  }

  static async getTranscriptionStatus(transcriptId: string): Promise<TranscriptionResponse> {
    try {
      const response = await axios.get(
        `${this.ASSEMBLY_AI_API_URL}/transcript/${transcriptId}`,
        {
          headers: {
            'Authorization': config.assemblyAiApiKey
          }
        }
      );

      return {
        status: response.data.status,
        text: response.data.text || '',
        error: response.data.error
      };
    } catch (error) {
      console.error('Status Check Error:', error);
      throw new Error('Failed to check transcription status');
    }
  }
} 