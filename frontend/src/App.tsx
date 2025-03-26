import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import YouTubeInput from './components/YouTubeInput/YouTubeInput';
import { FaWhatsapp, FaQuestion } from 'react-icons/fa';
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
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

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

  // Add handler for questions
  const handleAskQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || !transcript?.text) return;

    setIsAsking(true);
    setAnswer(null);

    try {
      console.log('Sending question:', { question, context: transcript.text }); // Debug log

      const response = await fetch('http://localhost:5000/api/qa/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context: transcript.text
        }),
      });

      const data = await response.json();
      
      console.log('Response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }
      
      setAnswer(data.answer);
    } catch (err) {
      console.error('Question error:', err);
      setAnswer('Sorry, I had trouble answering that question. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  // Add example questions
  const exampleQuestions = [
    "What's the cooking temperature?",
    "How long should I cook it?",
    "What can I substitute for...",
    "Is this recipe spicy?"
  ];

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <p className={styles.description}>
          Paste a YouTube cooking video link to get ingredients and ask questions about the recipe
        </p>
        
        <YouTubeInput 
          onTranscriptionUpdate={setTranscript} 
          onVideoDetails={setVideoDetails}
        />
        
        {/* Progress bar when transcribing or queued */}
        {(transcript?.status === 'processing' || transcript?.status === 'queued') && (
          <div className={styles.progressContainer}>
            <p className={styles.progressTitle}>SousChef AI is busy understanding the recipe...</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
            <p className={styles.progressText}>
              {transcript.status === 'queued' ? 'Starting transcription...' : 'Transcribing video...'}
            </p>
          </div>
        )}

        {/* Error state */}
        {transcript?.status === 'error' && (
          <p className={styles.error}>{transcript.error || 'An error occurred'}</p>
        )}

        {/* Only show widgets when transcript is completed */}
        {transcript?.status === 'completed' && (
          <>
            {/* Collapsible transcript section */}
            <details className={styles.transcriptDetails}>
              <summary className={styles.transcriptSummary}>View Transcript</summary>
              <div className={styles.transcriptContent}>
                <div className={styles.transcriptText}>
                  {transcript.text || 'No transcript available'}
                </div>
              </div>
            </details>

            <div className={styles.widgetsContainer}>
              {/* Ingredients section */}
              <section className={styles.ingredientsSection}>
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
                        <div className={styles.shareContainer}>
                          <button 
                            onClick={handleShare}
                            className={styles.shareButton}
                            aria-label="Share on WhatsApp"
                          >
                            <FaWhatsapp />
                            Share
                          </button>
                          <p className={styles.shareDescription}>Click to share ingredients you need to stock up</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>

              {/* Ask me anything section */}
              <section className={styles.askSection}>
                <h2>Ask me anything</h2>
                <div className={styles.content}>
                  {transcript?.status !== 'completed' ? (
                    <p className={styles.placeholder}>Wait for the recipe to be processed...</p>
                  ) : (
                    <>
                      <form onSubmit={handleAskQuestion} className={styles.askForm}>
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Ask about cooking time, temperature, steps..."
                          className={styles.askInput}
                          disabled={isAsking}
                        />
                        <button 
                          type="submit" 
                          className={styles.askButton}
                          disabled={isAsking || !question.trim()}
                        >
                          {isAsking ? 'Thinking...' : 'Ask'}
                        </button>
                      </form>

                      <div className={styles.exampleQuestions}>
                        <p className={styles.exampleTitle}>Try asking:</p>
                        <div className={styles.exampleList}>
                          {exampleQuestions.map((q, i) => (
                            <button
                              key={i}
                              className={styles.exampleQuestion}
                              onClick={() => setQuestion(q)}
                              disabled={isAsking}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      {answer && (
                        <div className={styles.answer}>
                          <FaQuestion className={styles.answerIcon} />
                          <p>{answer}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App; 