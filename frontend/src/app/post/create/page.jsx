"use client";
import { useRef, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';

export default function CreatePage() {
  const [isOpen, setIsOpen] = useState(true);  // モーダルを開いた状態で開始
  const [storeName, setStoreName] = useState('');
  const [storeNameSuggestions, setStoreNameSuggestions] = useState([]);
  const closeModal = () => {
    setIsOpen(false);
    router.push('/user');  // モーダルを閉じた時にマイページへ遷移
  };

  const formRef = useRef();
  const router = useRouter();

  const [rating, setRating] = useState(0);

  // rating stateの値を更新する関数
  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const jwt = localStorage.getItem('token');
    if (!jwt) {
      console.error('JWT token is missing');
      return;  // トークンがない場合はここで処理を中断
    }

    try {
      const postFormData = new FormData();
      postFormData.append('review', formData.get('review'));
      postFormData.append('rating', formData.get('rating'));
      postFormData.append('store_name', formData.get('store_name'));
      postFormData.append('photo', formData.get('photo'));

      const postRes = await fetch(`${process.env.API_ENDPOINT}/post`, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${jwt}`},
        body: postFormData,
      });

      if (postRes.ok) {
        closeModal();
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleStoreNameChange = async (event) => {
    const value = event.target.value;
    setStoreName(value);
    if (value.length > 0) {
      const response = await fetch(`${process.env.API_ENDPOINT}/store/suggest?query=${encodeURIComponent(value)}`);
      if (response.ok) {
        const suggestions = await response.json();
        setStoreNameSuggestions(suggestions);
      } else {
        setStoreNameSuggestions([]);
      }
    } else {
      setStoreNameSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setStoreName(suggestion);
    setStoreNameSuggestions([]);
  };

  const [fileName, setFileName] = useState('選択されたファイルはありません');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('選択されたファイルはありません');
    }
  };

  return (
<Transition appear show={isOpen} as={Fragment}>
  <Dialog as="div" className="relative z-10" onClose={closeModal}>
    <div className="fixed inset-0 bg-[url('/kampai.jpg')] bg-cover bg-center" />
    <div className="fixed inset-0 bg-gray-600 bg-opacity-80" />
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all font-sans">
            <Dialog.Title as="h2" className="text-lg font-medium leading-6 text-gray-700">
              新規投稿
            </Dialog.Title>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 py-6">
                <input type="text" name="store_name" placeholder="店の名前を入力してください" onChange={handleStoreNameChange} value={storeName} required className="input input-bordered w-full" />
                  {storeNameSuggestions.length > 0 && (
                    <ul className="absolute z-10 list-disc bg-white shadow-lg rounded mt-2 p-2">
                      {storeNameSuggestions.map((suggestion, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSuggestionClick(suggestion)}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                  <textarea name="review" placeholder="レビューを入力してください" required className="textarea textarea-bordered w-full"></textarea>
              {/* 星評価のラジオボタン */}
              <div className="flex items-center">
                    <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mr-2">
                      生ビール評価：
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <label key={num} className="cursor-pointer">
                          <input
                            type="radio"
                            id="rating"
                            name="rating"
                            value={num}
                            checked={rating === num}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="hidden"
                          />
                          <span className={rating >= num ? "text-amber-500 text-3xl" : "text-gray-400 text-3xl"}>
                            ★
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center px-2 py-1 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-amber-400 hover:text-white">
                      <img src='/newpostbeer.png' alt="Upload Icon" className="w-14 h-14" />
                      <span className="text-base leading-normal">ファイルを選択</span>
                      <input type='file' name="photo" accept="image/*" className="hidden" onChange={handleFileChange} required />
                    </label>
                  </div>
                  {/* 選択されたファイル名表示 */}
                  <div className="text-sm text-gray-600 text-center mt-1">
                    {fileName}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-700 text-white font-bold font-sans py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-colors duration-300"
                  >
                    投稿
                  </button>
            </form>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
      </Dialog>
    </Transition>
  );
}
