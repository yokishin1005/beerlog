"use client";
import React, { useEffect, useState } from 'react';
import MapNavbar from './mapNavbar';

const SearchPage = () => {
  const [mapData, setMapData] = useState('');
  const [isJwt, setIsJwt] = useState(false);
  const [jwtMessage, setJwtMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoresByLocation();
  }, []);

  const fetchStoresByLocation = async () => {
    // 会場の緯度経度
    const latitude = 35.69261;
    const longitude = 139.76229;
  
    // APIを呼び出し
    const response = await fetch(`${process.env.API_ENDPOINT}/stores?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();
    setMapData(data.map_html);
    setLoading(false);
  };

  return (
    <div className="relative bg-[url('/kampai.jpg')] bg-cover bg-center">
      <MapNavbar isJwt={isJwt} setIsJwt={setIsJwt} setJwtMessage={setJwtMessage} />
      <div className="pt-20 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-gray-600 bg-opacity-80 absolute inset-x-0 top-0 bottom-0 z-10"></div>
        <div className="w-full max-w-7xl p-6 bg-white rounded-2xl shadow-2xl overflow-hidden z-20 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: mapData }} className="w-[500px] md:w-[700px] lg:w-full h-[300px] md:h-[600px] overflow-hidden"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
