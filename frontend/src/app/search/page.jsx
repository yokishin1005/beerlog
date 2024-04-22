"use client";
import React, { useEffect, useState } from 'react';
import '../globals.css';

const SearchPage = () => {
  const [mapData, setMapData] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoresByLocation();
  }, []);

  const fetchStoresByLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`${process.env.API_ENDPOINT}/stores?lat=${latitude}&lng=${longitude}`);
          const data = await response.json();
          setMapData(data.map_html);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/kampai.jpg')] bg-cover bg-center">
      <div className="absolute bg-gray-600 bg-opacity-80 inset-0 z-10"></div>
      
      <div className="w-full max-w-2xl h-100 bg-white rounded-lg shadow-md overflow-hidden z-20">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-lg text-gray-800">
            Loading...
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: mapData }} className="z-20"></div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
