import React from 'react';
import styles from './page.module.css';

export default function ProfileCard({ userInfo }) {
  return (
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
  );
}