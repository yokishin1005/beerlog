import axios from 'axios';

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        reject(error);
        alert('位置情報の取得に失敗しました。');
      }
    );
  });
};

export const fetchStoresByLocation = async (setMapData) => {
  try {
    const position = await getCurrentPosition();
    const response = await axios.get(`${process.env.API_ENDPOINT}/search`, {
      params: {
        latitude: position.latitude,
        longitude: position.longitude
      }
    });
    setMapData(response.data.map_data);
  } catch (error) {
    console.error('Error fetching stores:', error);
  }
};
