const fetchPostDetails = async (jwt, setPostDetails) => {
    if (jwt) {
      try {
        const response = await fetch(`${process.env.API_ENDPOINT}/post`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setPostDetails(data);
        } else {
          throw new Error('投稿詳細の取得に失敗しました。');
        }
      } catch (error) {
        console.error(error);
        alert('投稿詳細の取得中にエラーが発生しました。');
      }
    } else {
      alert("ログインしていないので、ログインページへ遷移します。");
    }
  };
  
  export default fetchPostDetails;