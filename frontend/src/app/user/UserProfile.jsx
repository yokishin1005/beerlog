import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ProfileCard from './ProfileCard';
import PostGrid from './PostGrid';

export default function UserProfile({ userInfo }) {
  return (
    <>
      <ProfileCard userInfo={userInfo} />
      {userInfo.posts && userInfo.posts.length > 0 && (
        <PostGrid post={userInfo.posts[0]} />
      )}
    </>
  );
}