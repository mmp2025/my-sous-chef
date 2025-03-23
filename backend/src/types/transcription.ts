export interface TranscriptionResponse {
  text: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  error?: string;
  id?: string;
}

export interface VideoFormat {
  acodec: string;
  vcodec: string;
  abr: number;
  url: string;
} 