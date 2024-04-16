import React from 'react';
import styles from '../page.module.css';

export default function PhotoUpload({ photos, onPhotoChange, onPhotoRemove }) {
  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files);
    const photoDataPromises = files.map(async (file) => {
      const base64Data = await convertToBase64(file);
      return base64Data;
    });
    const photoData = await Promise.all(photoDataPromises);
    onPhotoChange(photoData);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className={styles.editPostField}>
      <label htmlFor="photos">写真</label>
      <input type="file" id="photos" multiple accept="image/*" onChange={handlePhotoChange} />
      <div className={styles.editPostPhotos}>
        {photos.map((photo, index) => (
          <div key={index} className={styles.editPostPhoto}>
            <img src={`data:image/jpeg;base64,${photo.photo_data}`} alt={`Photo ${index}`} />
            <button type="button" onClick={() => onPhotoRemove(index)}>
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}