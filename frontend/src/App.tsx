import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import YouTubeInput from './components/YouTubeInput/YouTubeInput';
import styles from './App.module.css';

interface TranscriptionStatus {
  status: 'queued' | 'processing' | 'completed' | 'error';
  text: string;
  error?: string;
  id?: string;
}

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<TranscriptionStatus | null>(null);

  // Poll for transcription status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (transcript?.id && (transcript.status === 'queued' || transcript.status === 'processing')) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/transcription/${transcript.id}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to check transcription status');
          }

          setTranscript(data);

          if (data.status === 'completed' || data.status === 'error') {
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error('Status check error:', err);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [transcript?.id, transcript?.status]);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <YouTubeInput onTranscriptionUpdate={setTranscript} />
        <div className={styles.columns}>
          <section className={styles.column}>
            <h2>Transcript</h2>
            <div className={styles.content}>
              {!transcript && <p className={styles.placeholder}>No transcript yet</p>}
              {transcript?.status === 'queued' && <p className={styles.status}>Queued for transcription...</p>}
              {transcript?.status === 'processing' && <p className={styles.status}>Transcribing video...</p>}
              {transcript?.status === 'error' && <p className={styles.error}>{transcript.error || 'An error occurred'}</p>}
              {transcript?.status === 'completed' && (
                <div className={styles.transcriptText}>
                  {transcript.text || 'No transcript available'}
                </div>
              )}
            </div>
          </section>
          <section className={styles.column}>
            <h2>Ingredients</h2>
            <div className={styles.content}>
              <p className={styles.placeholder}>No ingredients yet</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App; 