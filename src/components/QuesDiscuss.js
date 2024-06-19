import React, { useState } from 'react';

function Comment({ comment, onReply }) {
    const [replyText, setReplyText] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    }

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText('');
            setShowReply(false);
        }
    }

    return (
        <div style={{ marginLeft: comment.parentId ? '20px' : '0', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
            <p>{comment.text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setShowReply(!showReply)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none', color: '#007bff' }}>
                    <span role="img" aria-label="reply">💬</span> Reply
                </button>
                {comment.replies && comment.replies.length > 0 && (
                    <button onClick={() => setShowReplies(!showReplies)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
                        {showReplies ? 'Hide Replies' : 'Show Replies'} ({comment.replies.length})
                    </button>
                )}
            </div>
            {showReply && (
                <div style={{ marginTop: '10px' }}>
                    <input 
                        type="text" 
                        value={replyText} 
                        onChange={handleReplyChange} 
                        placeholder="Write a reply"
                        style={{ width: '80%', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}
                    />
                    <button onClick={handleReplySubmit} style={{ padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Post
                    </button>
                </div>
            )}
            {showReplies && comment.replies && comment.replies.map(reply => (
                <Comment key={reply.id} comment={reply} onReply={onReply} />
            ))}
        </div>
    );
}

function QuesDiscuss({ questionId }) {

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    }

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            const commentData = { id: comments.length + 1, text: newComment, parentId: null, replies: [] };
            setComments([...comments, commentData]);
            setNewComment('');
        }
    }

    const handleReplySubmit = (parentId, text) => {
        const newReply = { id: comments.length + 1 + Math.random(), text, parentId, replies: [] };
        setComments(updateCommentsWithReply(comments, newReply));
    }

    const updateCommentsWithReply = (comments, newReply) => {
    // Map through the current comments array
    return comments.map(comment => {
        // Check if this comment is the parent comment
        if (comment.id === newReply.parentId) {
            // If it is, return a new comment object with the new reply added to the replies array
            return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
            };
        // If this comment has replies, recursively call the function on the replies
        } else if (comment.replies) {
            return {
                ...comment,
                replies: updateCommentsWithReply(comment.replies, newReply)
            };
        // If this comment is not the parent and has no replies, return it unchanged
        } else {
            return comment;
        }
    });
}

    return (
        <div>
            <div className="mt-3 flex">
                <input
                    type="text"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    style={{ flex: '1', padding: '10px', border: '1px solid #ccc', borderRadius: '5px 0 0 5px' }}
                />
                <button
                    onClick={handleCommentSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700"
                    style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer' }}
                >
                    Post
                </button>
            </div>
            <div>
                {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} onReply={handleReplySubmit} />
                ))}
            </div>
        </div>
    );
}

export default QuesDiscuss;
