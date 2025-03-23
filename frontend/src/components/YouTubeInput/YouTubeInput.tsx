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
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get video details
      const detailsResponse = await fetch(`http://localhost:5000/api/youtube/details?url=${encodeURIComponent(url)}`);
      const detailsData = await detailsResponse.json();

      if (!detailsResponse.ok) {
        throw new Error(detailsData.error || 'Failed to fetch video details');
      }

      setVideoDetails(detailsData);
      onVideoDetails(detailsData);

      // Start transcription
      const transcribeResponse = await fetch(`http://localhost:5000/api/transcription/start?url=${encodeURIComponent(url)}`, {
        method: 'POST'
      });
      const transcribeData = await transcribeResponse.json();

      if (!transcribeResponse.ok) {
        throw new Error(transcribeData.error || 'Failed to start transcription');
      }

      onTranscriptionUpdate(transcribeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onTranscriptionUpdate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className={styles.input}
          disabled={loading}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Process Video'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      
      {videoDetails && (
        <div className={styles.videoDetails}>
          <img src={videoDetails.thumbnailUrl} alt={videoDetails.title} className={styles.thumbnail} />
          <h3 className={styles.videoTitle}>{videoDetails.title}</h3>
        </div>
      )}
    </div>
  );
};

export default YouTubeInput; 