"use client";
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import UserProfile from './UserProfile';
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
      {userInfo && <UserProfile userInfo={userInfo} />}
    </div>
  );
}