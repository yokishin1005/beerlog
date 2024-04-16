import React from 'react';
import styles from './page.module.css';

export default function PostPhotos({ photos }) {
  return (
    <div className={styles.postPhotos}>
      <h3>写真</h3>
      {photos.map((photo, photoIndex) => (
        <img
          key={photoIndex}
          src={`data:image/jpeg;base64,${photo.photo_data}`}
          alt={`Post Photo ${photoIndex}`}
          className={styles.postPhoto}
        />
      ))}
    </div>
  );
}