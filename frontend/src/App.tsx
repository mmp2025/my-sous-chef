import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import YouTubeInput from './components/YouTubeInput/YouTubeInput';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './App.module.css';
import { VideoDetails } from './types/youtube';

interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
  notes?: string;
}

interface TranscriptionStatus {
  status: 'queued' | 'processing' | 'completed' | 'error';
  text: string;
  error?: string;
  id?: string;
  ingredients?: Ingredient[];
  isExtractingIngredients?: boolean;
}

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<TranscriptionStatus | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

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

  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleShare = () => {
    if (!videoDetails || !transcript?.ingredients) return;

    const selectedItems = transcript.ingredients.filter(
      ingredient => selectedIngredients.has(ingredient.name)
    );

    if (selectedItems.length === 0) return;

    const text = `
${videoDetails.title}
${videoDetails.url}

Ingredients:
${selectedItems.map(ingredient => {
  const parts = [
    ingredient.quantity,
    ingredient.unit,
    ingredient.name,
    ingredient.notes && `(${ingredient.notes})`
  ].filter(Boolean).join(' ');
  return `• ${parts}`;
}).join('\n')}
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Update the toggleIngredient function to select all by default
  useEffect(() => {
    if (transcript?.ingredients) {
      const allIngredients = new Set(transcript.ingredients.map(i => i.name));
      setSelectedIngredients(allIngredients);
    }
  }, [transcript?.ingredients]);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <YouTubeInput 
          onTranscriptionUpdate={setTranscript} 
          onVideoDetails={setVideoDetails}
        />
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
              {!transcript?.ingredients && !transcript?.isExtractingIngredients && (
                <p className={styles.placeholder}>No ingredients yet</p>
              )}
              {transcript?.isExtractingIngredients && (
                <p className={styles.status}>Extracting ingredients...</p>
              )}
              {transcript?.ingredients && (
                <>
                  <div className={styles.ingredientsList}>
                    {transcript.ingredients.map(ingredient => (
                      <label key={ingredient.name} className={styles.ingredientItem}>
                        <input
                          type="checkbox"
                          checked={selectedIngredients.has(ingredient.name)}
                          onChange={() => toggleIngredient(ingredient.name)}
                        />
                        <span className={styles.ingredientName}>
                          {[
                            ingredient.quantity,
                            ingredient.unit,
                            ingredient.name,
                            ingredient.notes && `(${ingredient.notes})`
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedIngredients.size > 0 && (
                    <button 
                      onClick={handleShare}
                      className={styles.shareButton}
                      aria-label="Share on WhatsApp"
                    >
                      <FaWhatsapp />
                      Share
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App; 