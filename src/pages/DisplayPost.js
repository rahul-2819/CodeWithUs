import React, { useState, useEffect } from 'react';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';

function DisplayPost() {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const postId = localStorage.getItem('postId');
  const selectedTab = localStorage.getItem('selectedTab');

  useEffect(() => {
    const fetchPost = async () => {
      const url = `http://localhost:5000/api/getpost?${selectedTab ? `selectedTab=${selectedTab}&` : ''}${postId ? `postId=${postId}` : ''}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPostData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchComments = async () => {
      const url = `http://localhost:5000/api/getcomment?postId=${postId}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setComments(data.comments);
        console.log(comments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
    fetchComments();
  }, [postId, selectedTab]);


  const handleCommentAdded = (comment) => {
    setComments([...comments, comment]);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!postData) {
    return <div className="text-center mt-10">No post found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">{postData.posts[0].title}</h1>
        {/* <div className="text-gray-500 mb-8 text-sm">{new Date(postData.posts[0].createdAt).toLocaleDateString()}</div> */}
        <div className="prose prose-lg max-w-none font-serif" style={{ fontFamily: 'Merriweather, serif' }} dangerouslySetInnerHTML={{ __html: postData.posts[0].content }}></div>
      </div>
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="text-l font-bold mb-4">Comments</div>
          <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
          <hr />
          {comments.map((comment, index) => (
            <Comment key={index} {...comment} />
          ))}
        </div>
    </div>
  );
}

export default DisplayPost;
