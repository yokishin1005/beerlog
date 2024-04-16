import React, { useState } from 'react';
import styles from '../page.module.css';
import updatePost from './updatePost';
import PhotoUpload from './PhotoUpload';

export default function EditPost({ postDetails, onUpdateSuccess }) {
  const [editedPostDetails, setEditedPostDetails] = useState({
    post_id: postDetails.post_id,
    store_name: postDetails.store_name || '',
    review: postDetails.review || '',
    rating: postDetails.rating || 0,
    photos: postDetails.photos || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem('token');
    await updatePost(jwt, editedPostDetails.post_id, editedPostDetails);
    onUpdateSuccess();
  };

  const handlePhotoChange = (photoData) => {
    setEditedPostDetails({ ...editedPostDetails, photos: photoData });
  };

  const handlePhotoRemove = (index) => {
    const newPhotos = [...editedPostDetails.photos];
    newPhotos.splice(index, 1);
    setEditedPostDetails({ ...editedPostDetails, photos: newPhotos });
  };

  return (
    <div className={styles.editPost}>
      <h2 className={styles.editPostTitle}>投稿編集</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.editPostField}>
          <label htmlFor="store_name">店舗名</label>
          <input
            type="text"
            id="store_name"
            value={editedPostDetails.store_name}
            onChange={(e) =>
              setEditedPostDetails({ ...editedPostDetails, store_name: e.target.value })
            }
          />
        </div>
        <div className={styles.editPostField}>
          <label htmlFor="review">レビュー</label>
          <textarea
            id="review"
            value={editedPostDetails.review}
            onChange={(e) =>
              setEditedPostDetails({ ...editedPostDetails, review: e.target.value })
            }
          />
        </div>
        <div className={styles.editPostField}>
          <label htmlFor="rating">評価</label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            value={editedPostDetails.rating}
            onChange={(e) =>
              setEditedPostDetails({ ...editedPostDetails, rating: parseInt(e.target.value) })
            }
          />
        </div>
        <PhotoUpload
          photos={editedPostDetails.photos}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={handlePhotoRemove}
        />
        <button type="submit">更新</button>
      </form>
    </div>
  );
}