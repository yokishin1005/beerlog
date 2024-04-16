"use client";
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import PostDetails from './PostDetails';
import EditPost from './edit/EditPost';
import fetchPostDetails from './fetchPostDetails';

export default function PostPage() {
 const [postDetails, setPostDetails] = useState(null);
 const [isEditing, setIsEditing] = useState(false);

 useEffect(() => {
   const jwt = localStorage.getItem('token');
   fetchPostDetails(jwt, setPostDetails);
 }, []);

 const handleEditClick = () => {
   setIsEditing(true);
 };

 const handleUpdateSuccess = () => {
   setIsEditing(false);
   fetchPostDetails(localStorage.getItem('token'), setPostDetails);
 };

 if (!postDetails) {
   return <div>Loading...</div>;
 }

 return (
   <>
     {postDetails && (
       <div className={styles.postDetails}>
         <h2 className={styles.postTitle}>投稿詳細</h2>
         {isEditing ? (
           <EditPost postDetails={postDetails} onUpdateSuccess={handleUpdateSuccess} />
         ) : (
           <>
             <PostDetails postDetails={postDetails} />
             <button onClick={handleEditClick}>編集</button>
           </>
         )}
       </div>
     )}
   </>
 );
}