import React, { useState } from 'react';
import { auth } from '../firebase-config';


function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (user) {
      const commentData = {
        postId,
        content,
        author: user.uid, // User ID from Firebase Auth
        createdAt: new Date().toISOString(), // Current date and time
      };

      try {
        const response = await fetch('http://localhost:5000/api/addcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData),
        });
        
        const data = await response.json();
        onCommentAdded(data);
        setContent('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    } else {
      console.log('User not authenticated');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="mb-4">
          <textarea
            id="content"
            value={content}
            placeholder="Type comment here..."
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Comment
          </button>
        </div>
      </form>
    </>
  );
}

export default CommentForm;
