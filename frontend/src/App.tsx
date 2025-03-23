import React from 'react';
import Header from './components/Header/Header';
import YouTubeInput from './components/YouTubeInput/YouTubeInput';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <YouTubeInput />
        <div className={styles.columns}>
          <section className={styles.column}>
            <h2>Transcript</h2>
            <div className={styles.content}>
              <p className={styles.placeholder}>No transcript yet</p>
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