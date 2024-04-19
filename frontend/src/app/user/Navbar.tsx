import React from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Navbar = ({ isJwt, setIsJwt, setJwtMessage }) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleMyRedirect = () => {
    router.push('/my');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleAboutRedirect = () => {
    router.push('/about');
  };

  const handleIntroductionRedirect = () => {
    router.push('/introduction');
  };

  const handleColumnRedirect = () => {
    router.push('/column');
  };

  const handlePickupPubRedirect = () => {
    router.push('/pickup-pub');
  };

  return (
    <div className='container-body absolute top-0 right-0 left-0 z-30 flex justify-between items-center pt-3 pb-10'>
      <div className="flex space-x-4 p-4 ml-20">
        <button onClick={handleAboutRedirect} className="font-sans font-semibold text-gray-500 py-2 px-4 rounded-xl hover:bg-amber-400 focus:outline-none transition-colors duration-200">びあログとは？</button>
        <button onClick={handleIntroductionRedirect} className="font-sans font-semibold text-gray-500 py-2 px-4 rounded-xl hover:bg-amber-400 focus:outline-none transition-colors duration-200">おいしい生ビール入門</button>
        <button onClick={handleColumnRedirect} className="font-sans font-semibold text-gray-500 py-2 px-4 rounded-xl hover:bg-amber-400 focus:outline-none transition-colors duration-200">ビールコラム</button>
        <button onClick={handlePickupPubRedirect} className="font-sans font-semibold text-gray-500 py-2 px-4 rounded-xl hover:bg-amber-400 focus:outline-none transition-colors duration-200">ピックアップ居酒屋</button>
      </div>
      <div className="flex space-x-4 p-4 mr-20">
        <>
          <Link href="/post/create" prefetch={false}>
            <button className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-amber-600 focus:outline-none transition-colors duration-200">新規投稿作成</button>
          </Link>
          <button onClick={handleLogout} className="bg-amber-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-amber-600 focus:outline-none transition-colors duration-200">ログアウト</button>
        </>
      </div>
    </div>
  );
};

export default Navbar;