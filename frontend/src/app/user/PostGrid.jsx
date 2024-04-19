import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function PostGrid({ posts }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        Modal.setAppElement('body');
    }, []);

    const openModal = (post) => {
        console.log(post);  // デバッグのためにpostオブジェクトを出力
        setSelectedPost(post);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    // 評価を星で表示するロジックを関数として定義
    const renderRatingStars = (rating) => {
        const filledStars = '★'.repeat(rating);
        const emptyStars = '☆'.repeat(5 - rating);
        return filledStars + emptyStars;
    };

    if (!Array.isArray(posts)) {
        console.error('PostGrid expects an array of posts');
        return null;
    }

    return (
        <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">最近の投稿</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
                {posts.map((post, index) => (
                    <div key={index} className="block overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="cursor-pointer" onClick={() => openModal(post)}>
                            <img
                                className="object-cover w-full h-48 sm:h-64 transform transition duration-300 hover:scale-110"
                                src={`data:image/jpeg;base64,${post.photos[0]}`}
                                alt="Post Image"
                            />
                            {/* <div className="p-4 bg-white">
                                <h4 className="font-semibold">{post.title}</h4>
                                <p className="text-sm text-gray-600">{post.description}</p>
                                <p className="text-lg text-gray-600">評価: {post.rating}</p>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* モーダルの設定 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Post Details"
                className="Modal fixed inset-0 z-50 overflow-auto flex"
                overlayClassName="Overlay fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="relative p-5 bg-white rounded-xl shadow-lg m-auto flex-col flex max-w-2xl">
                    {selectedPost && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">{selectedPost.title}</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {selectedPost.photos.map((photo, index) => (
                                    <img key={index} src={`data:image/jpeg;base64,${photo}`} alt={`Photo ${index + 1}`} className="rounded-lg" />
                                ))}
                            </div>
                            <p className="font-sans text-gray-700 mb-1">店舗名: {selectedPost.store_name}</p>
                            <p className="font-sans text-gray-700 mb-1">レビュー: {selectedPost.review}</p>
                            <p className="font-sans text-gray-700 mb-3">評価: {renderRatingStars(selectedPost.rating)}</p>
                            <button onClick={closeModal} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-700">閉じる</button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
