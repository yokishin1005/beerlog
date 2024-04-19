"use client";
import React, { useEffect, useState } from 'react';
import UserProfile from './UserProfile';
import fetchUserInfo from './fetchUserInfo';
import Navbar from './Navbar';

export default function Page() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    fetchUserInfo(jwt, setUserInfo);
  }, []);

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto pt-20 mb-16">
        {userInfo && <UserProfile userInfo={userInfo} />}
      </div>
    </div>
  );
}


