import React from 'react';
import styles from './page.module.css';

export default function PostStore({ storeName }) {
  return (
    <div className={styles.postStore}>
      <h3>店舗名</h3>
      <p>{storeName}</p>
    </div>
  );
}