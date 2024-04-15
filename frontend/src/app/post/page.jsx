"use client";
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import fetchPostDetails from './fetchPostDetails';

export default function PostPage() {
  const [postDetails, setPostDetails] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    fetchPostDetails(jwt, setPostDetails);
  }, []);

  if (!postDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {postDetails && (
        <div className={styles.postDetails}>
          <h2 className={styles.postTitle}>投稿詳細</h2>
          <div className={styles.postItem}>
          <div className={styles.postStore}>
              <h3>店舗名</h3>
              <p>{postDetails.store_name}</p>
              </div>
            <div className={styles.postReview}>
              <h3>レビュー</h3>
              <p>{postDetails.review}</p>
            </div>
            <div className={styles.postRating}>
              <h3>評価</h3>
              <p>{postDetails.rating}</p>
            </div>
            <div className={styles.postPhotos}>
              <h3>写真</h3>
              {postDetails.photos.map((photo, photoIndex) => (
                <img
                  key={photoIndex}
                  src={`data:image/jpeg;base64,${photo.photo_data}`}
                  alt={`Post Photo ${photoIndex}`}
                  className={styles.postPhoto}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}