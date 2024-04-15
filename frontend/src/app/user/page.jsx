"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import fetchUserInfo from './fetchUserInfo';

export default function Page() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    fetchUserInfo(jwt, setUserInfo);
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }


  return (
    <div className={styles.container}>
      {userInfo && (
        <>
          <div className={styles.profileCard}>
            <div className={styles.profileImage}>
              <img
                src={`data:image/jpeg;base64,${userInfo.user_picture}`}
                alt={`${userInfo.user_name}さんのプロフィール画像`}
              />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{userInfo.user_name}</h2>
              <p className={styles.profileDescription}>{userInfo.user_profile}</p>
              <div className={styles.profileStats}>
                <div className={styles.profileStat}>
                  <span className={styles.profileStatLabel}>フォロワー</span>
                  <span className={styles.profileStatValue}>{userInfo.follower_count}</span>
                </div>
                <div className={styles.profileStat}>
                  <span className={styles.profileStatLabel}>フォロー中</span>
                  <span className={styles.profileStatValue}>{userInfo.following_count}</span>
                </div>
                <div className={styles.profileStat}>
                  <span className={styles.profileStatLabel}>投稿</span>
                  <span className={styles.profileStatValue}>{userInfo.post_count}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.postGrid}>
            {userInfo.posts.map((post, index) => (
              <Link key={index} href={`/post`}>
                <div className={styles.postImage}>
                  <img
                    src={`data:image/jpeg;base64,${post.photos[0]}`}
                    alt={`User Post ${index}`}
                  />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}