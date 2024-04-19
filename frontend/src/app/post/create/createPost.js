"use server";
import { revalidatePath } from 'next/cache';

const createPost = async (formData) => {
  const review = formData.get("review");
  const rating = formData.get("rating");
  const photoData = formData.get("photo");

  // レビュー、評価、写真が空の場合にエラーをスロー
  if (!review || !rating || !photoData) {
    throw new Error('レビュー、評価、写真を入力してください');
  }

  const postData = {
    review: review,
    rating: parseInt(rating),
  };

  // POSTの作成
  const postRes = await fetch(process.env.API_ENDPOINT + `/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!postRes.ok) {
    throw new Error('Failed to create post');
  }

  revalidatePath(`/posts`);
};

export default createPost;