const fetchUserInfo = async (jwt, setUserInfo) => {
    if (jwt) {
      try {
        const response = await fetch(`${process.env.API_ENDPOINT}/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setUserInfo(data);
        } else {
          throw new Error('ユーザー情報の取得に失敗しました。');
        }
      } catch (error) {
        console.error(error);
        alert('ユーザー情報の取得中にエラーが発生しました。');
      }
    } else {
      alert("ログインしていないので、ログインページへ遷移します。");
    }
  };
  
  export default fetchUserInfo;