import React, { useState, useEffect } from 'react';
import { auth } from '../firebase-config';

function Comment({ comment, onReply }) {
    const [replyText, setReplyText] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(comment._id, replyText);
            setReplyText('');
            setShowReply(false);
        }
    };

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
                <Comment key={reply._id} comment={reply} onReply={onReply} />
            ))}
        </div>
    );
}

function DisplayPostWithComments() {
    const [postData, setPostData] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;
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
            console.log(postData);
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

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        if (user) {
            if (newComment.trim()) {
                const commentData = { postId, text: newComment, parentId: null, userId: user.uid };
                fetch('http://localhost:5000/api/addcomment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(commentData),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setComments([...comments, { _id: data.commentId, text: newComment, parentId: null, userId: user.uid, replies: [] }]);
                        setNewComment('');
                    } else {
                        console.error('Error:', data.error);
                    }
                })
                .catch(error => {
                    console.error('There was an error posting the comment:', error);
                });
            }
        } else {
            alert('Please login to post a comment');
        }
    };

    const handleReplySubmit = (parentId, text) => {
        if (user) {
            const replyData = { postId, text, parentId, userId: user.uid };
            fetch('http://localhost:5000/api/addcommentreply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(replyData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setComments(updateCommentsWithReply(comments, data.reply));
                } else {
                    console.error('Error:', data.error);
                }
            })
            .catch(error => {
                console.error('There was an error posting the reply:', error);
            });
        } else {
            alert('Please login to reply');
        }
    };

    const updateCommentsWithReply = (comments, newReply) => {
        return comments.map(comment => {
            if (comment._id === newReply.parentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                };
            } else if (comment.replies) {
                return {
                    ...comment,
                    replies: updateCommentsWithReply(comment.replies, newReply),
                };
            } else {
                return comment;
            }
        });
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
                <div className="prose prose-lg max-w-none font-serif" style={{ fontFamily: 'Merriweather, serif' }} dangerouslySetInnerHTML={{ __html: postData.posts[0].content }}></div>
            </div>
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <div className="text-l font-bold mb-4">Comments</div>
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
                        <Comment key={comment._id} comment={comment} onReply={handleReplySubmit} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DisplayPostWithComments;
