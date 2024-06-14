import React, { useState } from 'react'


function CommentForm({ postId, onCommentAdded }){
    const [user, setUser] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        
    };
    return (
        <>
            <form onSubmit={handleSubmit} className="mt-8">
            <div className="mb-4">
                <textarea
                id="content"
                value={content}
                placeholder='Type comment here...'
                onChange={(e) => setContent(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                required
                ></textarea>
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Add Comment
            </button>
            </form>
        </>
    )
}

export default CommentForm