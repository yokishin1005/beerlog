const updatePost = async (jwt, postId, editedPostDetails) => {
  if (jwt) {
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/post`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          store_name: editedPostDetails.store_name,
          review: editedPostDetails.review,
          rating: editedPostDetails.rating,
          photos: editedPostDetails.photos.map(photo => ({
            photo_id: photo.photo_id,
            photo_data: photo.photo_data
          })),
        }),
      });

      if (response.ok) {
        alert('投稿が更新されました。');
      } else {
        throw new Error('投稿の更新に失敗しました。');
      }
    } catch (error) {
      console.error(error);
      alert('投稿の更新中にエラーが発生しました。');
    }
  } else {
    alert("ログインしていないので、ログインページへ遷移します。");
  }
};

export default updatePost;