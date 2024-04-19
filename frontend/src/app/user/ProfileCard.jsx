import React from 'react';

export default function ProfileCard({ userInfo }) {
  // ダミーでベタ打ち
  const beerStats = {
    marathon: '生ビールマラソン',
    totalBeers: 1232,
    visitedStores: 182,
    beerRank: '神'
  };

  return (
    <div className="font-sans bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center pl-10">
          <img
            className="h-48 w-48 rounded-full object-cover mr-4"
            src={`data:image/jpeg;base64,${userInfo.user_picture}`}
            alt={`${userInfo.user_name}さんのプロフィール画像`}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{userInfo.user_name}</h2>
            <p className="text-gray-600">{userInfo.user_profile}</p>
            <div className="flex mt-2 space-x-2">
              <div className="text-center">
                {/* フォロワー、フォロー中、投稿はダミーの数字 */}
                <span className="text-sm font-semibold">フォロワー</span>
                <span className="block font-bold text-sm">{userInfo.follower_count}256</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold">フォロー中</span>
                <span className="block font-bold text-sm">{userInfo.following_count}82</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold">投稿</span>
                <span className="block font-bold text-sm">{userInfo.post_count}4</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">好きな銘柄：{userInfo.favorite_brand || 'ソラチ'}</p>
              <p className="text-sm text-gray-600">好きなジャンル：{userInfo.favorite_genre || '焼き鳥'}</p>
              <p className="text-sm text-gray-600">出没エリア：{userInfo.hangout_area || '神楽坂・吉祥寺'}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-500 text-white rounded-lg p-4 shadow-md pr-10 w-1/3 relative">
          <h3 className="font-bold text-lg mb-2">{beerStats.marathon}</h3>
          <div className="flex justify-around items-end">
            <div className="text-center">
              <span className="text-sm font-semibold block mb-1">累計</span>
              <span className="text-xl font-bold">{beerStats.totalBeers}杯</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold block mb-1">訪問店舗</span>
              <span className="text-xl font-bold">{beerStats.visitedStores}店舗</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-semibold block mb-1">生ビールランク</span>
              <span className="text-xl font-bold">{beerStats.beerRank}</span>
            </div>
          </div>
          <a href="/ranking" className="absolute top-2 right-2 text-sm underline" style={{ fontSize: '14px' }}>生ビールランキング＞</a>
        </div>
      </div>
    </div>
  );
}
