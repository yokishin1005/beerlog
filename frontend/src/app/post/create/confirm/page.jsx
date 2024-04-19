"use client";
import PostInfoCard from "src/app/components/post_info_card.jsx";
import fetchPost from "./fetchPost";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmPage() {
  const router = useRouter();
  const post_id = useSearchParams().get("post_id");
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchAndSetPost = async () => {
      const postData = await fetchPost(post_id);
      setPost(postData);
    };
    fetchAndSetPost();
  }, [post_id]);

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
        <div className="alert alert-success p-4 text-center">
          正常に作成しました
        </div>
        <PostInfoCard {...post} />
        <button onClick={() => router.push("./../../user")}>
          <div className="btn btn-primary m-4 text-2xl">
            戻る
          </div>
        </button>
      </div>
    </>
  );
}