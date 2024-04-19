export default async function createPost(postData) {
  const res = await fetch('http://127.0.0.1:5000/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    throw new Error('Failed to create post');
  }

  return res.json();
}