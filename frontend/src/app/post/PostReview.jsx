import React from 'react';
import styles from './page.module.css';

export default function PostReview({ review }) {
  return (
    <div className={styles.postReview}>
      <h3>レビュー</h3>
      <p>{review}</p>
    </div>
  );
}