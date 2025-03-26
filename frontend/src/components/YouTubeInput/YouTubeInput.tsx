import React, { useState } from 'react';
import styles from './YouTubeInput.module.css';
import { VideoDetails } from '../../types/youtube';

interface TranscriptionStatus {
  status: 'queued' | 'processing' | 'completed' | 'error';
  text: string;
  error?: string;
  id?: string;
}

interface YouTubeInputProps {
  onTranscriptionUpdate: (status: TranscriptionStatus | null) => void;
  onVideoDetails: (details: VideoDetails | null) => void;
}

const YouTubeInput: React.FC<YouTubeInputProps> = ({ onTranscriptionUpdate, onVideoDetails }) => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedVideoDetails, setProcessedVideoDetails] = useState<VideoDetails | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProcessingStatus('Getting video from YouTube...');
    setProcessedVideoDetails(null);

    try {
      // Get video details
      const detailsResponse = await fetch(`http://localhost:5000/api/youtube/details?url=${encodeURIComponent(url)}`);
      const detailsData = await detailsResponse.json();

      if (!detailsResponse.ok) {
        throw new Error(detailsData.error || 'Failed to fetch video details');
      }

      setProcessingStatus('Starting transcription...');

      // Start transcription
      const transcribeResponse = await fetch(`http://localhost:5000/api/transcription/start?url=${encodeURIComponent(url)}`, {
        method: 'POST'
      });
      const transcribeData = await transcribeResponse.json();

      if (!transcribeResponse.ok) {
        throw new Error(transcribeData.error || 'Failed to start transcription');
      }

      // Only show video details after transcription has started
      setProcessedVideoDetails(detailsData);
      onVideoDetails(detailsData);
      onTranscriptionUpdate(transcribeData);
      setProcessingStatus('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onTranscriptionUpdate(null);
      onVideoDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError(null);
    setProcessedVideoDetails(null);
    setProcessingStatus('');
    onVideoDetails(null);
    onTranscriptionUpdate(null);
  };

  return (
    <div className={styles.container}>
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Paste any YouTube cooking video URL here..."
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Getting video from YouTube...' : 'Get video from YouTube'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      
      {processedVideoDetails && !loading && (
        <div className={styles.videoDetails}>
          <img 
            src={processedVideoDetails.thumbnailUrl} 
            alt={processedVideoDetails.title} 
            className={styles.thumbnail} 
          />
          <h3 className={styles.videoTitle}>{processedVideoDetails.title}</h3>
        </div>
      )}
    </div>
  );
};

export default YouTubeInput; 