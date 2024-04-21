"use client";
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CreatePage() {
  const formRef = useRef();
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [storeNameSuggestions, setStoreNameSuggestions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    
    // JWT トークンをローカルストレージから取得
    const jwt = localStorage.getItem('token');
    // JWT トークンが存在しない場合のエラーハンドリング
    if (!jwt) {
      console.error('JWT token is missing');
      throw new Error('JWT token is missing');
    }

    try {
      // レビュー情報と写真データを含むFormDataオブジェクトを作成
      const postFormData = new FormData();
      postFormData.append('review', formData.get('review'));
      postFormData.append('rating', formData.get('rating'));
      postFormData.append('store_name', formData.get('store_name'));
      postFormData.append('photo', formData.get('photo'));

      // POSTの作成
      const postRes = await fetch(process.env.API_ENDPOINT + `/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: postFormData,
      });

      if (postRes.ok) {
        router.push(`../user`);
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      // エラー処理を追加
    }
  };

  const handleStoreNameChange = async (event) => {
    const value = event.target.value;
    setStoreName(value);
    // バックエンドにリクエストを送信し、候補を取得する処理を追加
    if (value.length > 0) {
      const response = await fetch(`${process.env.API_ENDPOINT}/store/suggest?query=${encodeURIComponent(value)}`);
      if (response.ok) {
        const suggestions = await response.json();
        setStoreNameSuggestions(suggestions);
      } else {
        setStoreNameSuggestions([]);
      }
    } else {
      setStoreNameSuggestions([]);
    }
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
              <textarea name="review" placeholder="レビューを入力してください" required></textarea>
            </p>
          </div>
          <div className={`${styles.postItem} ${styles.postRating}`}>
            <h3>評価</h3>
            <p>
              <input type="number" name="rating" placeholder="1" min="1" max="5" required />
            </p>
          </div>
          <div className={`${styles.postItem} ${styles.postPhotos}`}>
            <h3>写真</h3>
            <input type="file" name="photo" accept="image/*" required className={styles.postPhoto} />
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
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
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