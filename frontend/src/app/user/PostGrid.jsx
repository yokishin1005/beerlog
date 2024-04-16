import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function PostGrid({ post }) {
  return (
    <div className={styles.postGrid}>
      <Link href={`/post`}>
        <div className={styles.postImage}>
          <img src={`data:image/jpeg;base64,${post.photos[0]}`} alt="Post Image" />
        </div>
      </Link>
    </div>
  );
}