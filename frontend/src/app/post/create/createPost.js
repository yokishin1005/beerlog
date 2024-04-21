"use server";
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { cookies } from 'next/headers';

const createPost = async (formData) => {
  const review = formData.get("review");
  const rating = formData.get("rating");
  const storeName = formData.get("store_name");
  const photoData = formData.get("photo");

  // レビュー、評価、店名、写真が空の場合にエラーをスロー
  if (!review || !rating || !storeName || !photoData) {
    throw new Error('レビュー、評価、店名、写真を入力してください');
  }

  const postRequestData = {
    review: review,
    rating: parseInt(rating),
    store_name: storeName,
  };

  // 写真データを含むFormDataオブジェクトを作成
  const photoFormData = new FormData();
  photoFormData.append('photo', photoData);

  // POSTの作成
  const postRes = await fetch(process.env.API_ENDPOINT + `/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(postRequestData),
  });

  if (!postRes.ok) {
    throw new Error('Failed to create post');
  }

  const postResponseData = await postRes.json();

  // 写真データの送信
  const photoRes = await fetch(process.env.API_ENDPOINT + `/post/${postResponseData.post_id}/photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`
    },
    body: photoFormData,
  });

  if (!photoRes.ok) {
    throw new Error('Failed to upload photo');
  }

  revalidatePath(`/posts`);
};

export default createPost;