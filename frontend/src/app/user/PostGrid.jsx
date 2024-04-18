import React from 'react';
import Link from 'next/link';

export default function PostGrid({ posts }) {
    // ここでpostsの内容をコンソールに出力
    console.log(posts);

    if (!Array.isArray(posts)) {
        console.error('PostGrid expects an array of posts');
        return null;
    }

// 現状のDBはpostは2件だけど写真が2件目に紐づいていないので、枠だけが表示されている。
    return (
        <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">最近の投稿</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
                {posts.map((post, index) => (
                    <div key={index} className="block overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <Link href={`/post/${post.id || ''}`}>
                            <div className="cursor-pointer">
                                <img
                                    className="object-cover w-full h-48 sm:h-64 transform transition duration-300 hover:scale-110"
                                    src={`data:image/jpeg;base64,${post.photos[0]}`}
                                    alt="Post Image"
                                />
                            <div className="p-4 bg-white">
                                <h4 className="font-semibold">{post.title}</h4>
                                <p className="text-sm text-gray-600">{post.description}</p>
                                <p className="text-lg text-gray-600">評価: {post.rating}</p>
                            </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
