import React, { useState } from 'react';
import styles from './YouTubeInput.module.css';

interface VideoDetails {
  title: string;
  thumbnailUrl: string;
  videoId: string;
}

const YouTubeInput: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/youtube/details?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video details');
      }

      setVideoDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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