import React from 'react';
import styles from './TranscriptView.module.css';

interface TranscriptViewProps {
  transcriptId: string | null;
  transcript: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  error?: string;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ transcriptId, transcript, status, error }) => {
  return (
    <div className={styles.container}>
      <h2>Transcript</h2>
      {status === 'queued' && <p className={styles.status}>Queued for transcription...</p>}
      {status === 'processing' && <p className={styles.status}>Transcribing video...</p>}
      {status === 'error' && <p className={styles.error}>{error || 'An error occurred'}</p>}
      {status === 'completed' && (
        <div className={styles.transcriptText}>
          {transcript || 'No transcript available'}
        </div>
      )}
    </div>
  );
};

export default TranscriptView; 