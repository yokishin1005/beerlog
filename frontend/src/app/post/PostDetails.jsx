import React from 'react';
import styles from './page.module.css';
import PostStore from './PostStore';
import PostReview from './PostReview';
import PostRating from './PostRating';
import PostPhotos from './PostPhotos';

export default function PostDetails({ postDetails }) {
  return (
    <div className={styles.postItem}>
      <PostStore storeName={postDetails.store_name} />
      <PostReview review={postDetails.review} />
      <PostRating rating={postDetails.rating} />
      <PostPhotos photos={postDetails.photos} />
    </div>
  );
}