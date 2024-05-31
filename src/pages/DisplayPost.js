import React, { useState, useEffect } from 'react';

function DisplayPost() {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const postId = localStorage.getItem('postId');
  const selectedTab = localStorage.getItem('selectedTab');

  useEffect(() => {
    const url = `http://localhost:5000/api/getpost?${selectedTab ? `selectedTab=${selectedTab}&` : ''}${postId ? `postId=${postId}` : ''}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setPostData(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [postId, selectedTab]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!postData) {
    return <div className="text-center mt-10">No post found.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">{postData.posts[0].title}</h1>
      <div className="text-gray-600 mb-8">{new Date(postData.posts[0].createdAt).toLocaleDateString()}</div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: postData.posts[0].content }}></div>
    </div>
  );
}

export default DisplayPost;