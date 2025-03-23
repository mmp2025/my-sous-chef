import axios from 'axios';
import { config } from '../config/config';
import { TranscriptionResponse } from '../types/transcription';
import { AudioService } from './audioService';
import fs from 'fs';
import { OpenAIService, Ingredient } from './openaiService';

interface TranscriptionResponse {
  status: 'queued' | 'processing' | 'completed' | 'error';
  text: string;
  error?: string;
  id?: string;
  ingredients?: Ingredient[];
  isExtractingIngredients?: boolean;
}

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
      console.log(`Checking status for transcript ${transcriptId}...`);
      const response = await axios.get(
        `${this.ASSEMBLY_AI_API_URL}/transcript/${transcriptId}`,
        {
          headers: {
            'Authorization': config.assemblyAiApiKey
          }
        }
      );

      const status = response.data.status;
      const text = response.data.text || '';
      console.log(`Transcription status: ${status}`);

      // If transcription is complete, extract ingredients
      let ingredients: Ingredient[] | undefined;
      let isExtractingIngredients = false;

      if (status === 'completed' && text) {
        try {
          console.log('Starting ingredient extraction...');
          isExtractingIngredients = true;
          ingredients = await OpenAIService.extractIngredients(text);
          console.log('Ingredients extracted successfully:', ingredients);
        } catch (error) {
          if (error instanceof Error && error.message.includes('Rate limit')) {
            throw error;
          }
          console.error('Ingredient extraction error:', error);
        } finally {
          isExtractingIngredients = false;
        }
      }

      return {
        status,
        text,
        error: response.data.error,
        ingredients,
        isExtractingIngredients
      };
    } catch (error) {
      console.error('Status Check Error:', error);
      if (error instanceof Error && error.message.includes('Rate limit')) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      }
      throw new Error('Failed to check transcription status');
    }
  }
} 