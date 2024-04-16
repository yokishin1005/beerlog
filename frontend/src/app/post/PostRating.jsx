import React from 'react';
import styles from './page.module.css';

export default function PostRating({ rating }) {
  return (
    <div className={styles.postRating}>
      <h3>評価</h3>
      <p>{rating}</p>
    </div>
  );
}