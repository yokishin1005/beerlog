import React from 'react';
import ProfileCard from './ProfileCard';
import PostGrid from './PostGrid';

export default function UserProfile({ userInfo }) {
  // `userInfo.posts` が配列であることを確認します。
  const posts = Array.isArray(userInfo.posts) ? userInfo.posts : [];

  return (
    <>
      <ProfileCard userInfo={userInfo} />
      {posts.length > 0 && <PostGrid posts={posts} />}
    </>
  );
}
