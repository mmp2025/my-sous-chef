import React from 'react';
import { FaUtensils } from 'react-icons/fa';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <FaUtensils className={styles.icon} />
        <h1 className={styles.title}>SousChef AI</h1>
      </div>
      <p className={styles.tagline}>Your Magical Cooking Companion</p>
    </header>
  );
};

export default Header; 