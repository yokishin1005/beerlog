"use client";
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import createPost from './createPost';
import styles from './page.module.css';

export default function CreatePage() {
  const formRef = useRef();
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [storeNameSuggestions, setStoreNameSuggestions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    await createPost(formData);
    router.push(`../user`);
  };

  const handleStoreNameChange = (event) => {
    const value = event.target.value;
    setStoreName(value);
    // ここでバックエンドにリクエストを送信し、候補を取得する処理を追加する
    // 取得した候補をsetStoreNameSuggestionsを使ってステートに設定する
  };

  const handleSuggestionClick = (suggestion) => {
    setStoreName(suggestion);
    setStoreNameSuggestions([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.postDetails}>
        <h2 className={styles.postTitle}>新規投稿</h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className={`${styles.postItem} ${styles.postReview}`}>
            <h3>レビュー</h3>
            <p>
              <textarea
                name="review"
                placeholder="レビューを入力してください"
                required
              ></textarea>
            </p>
          </div>
          <div className={`${styles.postItem} ${styles.postRating}`}>
            <h3>評価</h3>
            <p>
              <input
                type="number"
                name="rating"
                placeholder="1"
                min="1"
                max="5"
                required
              />
            </p>
          </div>
          <div className={`${styles.postItem} ${styles.postPhotos}`}>
            <h3>写真</h3>
            <input
              type="file"
              name="photo"
              accept="image/*"
              required
              className={styles.postPhoto}
            />
          </div>
          <div className={`${styles.postItem} ${styles.postStore}`}>
            <h3>店名</h3>
            <p>
              <input
                type="text"
                name="store_name"
                placeholder="店の名前を入力してください"
                onChange={handleStoreNameChange}
                value={storeName}
                required
              />
            </p>
            {storeNameSuggestions.length > 0 && (
              <ul>
                {storeNameSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.postItem}>
            <button type="submit">作成</button>
          </div>
        </form>
      </div>
    </div>
  );
}