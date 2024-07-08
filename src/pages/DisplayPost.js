import React, { useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faChevronDown, faChevronUp, faPaperPlane, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

function Comment({ comment, onReply, depth = 0 }) {
    const [replyText, setReplyText] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(depth < 2);

    const handleReplyChange = (e) => setReplyText(e.target.value);

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(comment._id, replyText);
            setReplyText('');
            setShowReply(false);
        }
    };

    const bgColors = ['bg-gray-800', 'bg-gray-700', 'bg-gray-600', 'bg-gray-500', 'bg-gray-400', 'bg-gray-300'];

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${bgColors[depth % bgColors.length]} p-4 rounded-lg shadow-md mb-4`}
        >
            <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-300 mr-2" />
                <span className="font-semibold text-gray-100">User</span>
                <FontAwesomeIcon icon={faClock} className="text-gray-300 ml-4 mr-2" />
                <span className="text-sm text-gray-400">2 hours ago</span>
            </div>
            <p className="mb-3 text-gray-100">{comment.text}</p>
            <div className="flex items-center gap-4 text-sm">
                <button onClick={() => setShowReply(!showReply)} className="flex items-center text-blue-400 hover:text-blue-500 transition-colors duration-200">
                    <FontAwesomeIcon icon={faReply} className="mr-2" /> Reply
                </button>
                {comment.replies && comment.replies.length > 0 && (
                    <button onClick={() => setShowReplies(!showReplies)} className="flex items-center text-green-400 hover:text-green-500 transition-colors duration-200">
                        <FontAwesomeIcon icon={showReplies ? faChevronUp : faChevronDown} className="mr-2" />
                        {showReplies ? 'Hide Replies' : 'Show Replies'} ({comment.replies.length})
                    </button>
                )}
            </div>
            <AnimatePresence>
                {showReply && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                    >
                        <div className="flex">
                            <input 
                                type="text" 
                                value={replyText} 
                                onChange={handleReplyChange} 
                                placeholder="Write a reply"
                                className="flex-grow p-2 border border-gray-600 rounded-l-md bg-gray-700 text-white focus:ring-blue-400 focus:border-blue-400"
                            />
                            <button onClick={handleReplySubmit} className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors duration-200">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showReplies && comment.replies && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                    >
                        {comment.replies.map(reply => (
                            <Comment key={reply._id} comment={reply} onReply={onReply} depth={depth + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
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
                };
        
                const fetchComments = async () => {
                  const url = `http://localhost:5000/api/getcomment?postId=${postId}`;
                  try {
                    const response = await fetch(url);
                    const data = await response.json();
                    setComments(data.comments);
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
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <ClipLoader size={50} color="#3B82F6" />
            </div>
        );
    }

    if (!postData) {
        return <div className="text-center mt-10 text-gray-400">No post found.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-12"
                >
                    <div className="bg-gray-900 p-6 text-white">
                        <h1 className="text-3xl font-bold">{postData.posts[0].title}</h1>
                        <div className="mt-2 flex items-center text-sm">
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                            <span>Posted by User</span>
                            <FontAwesomeIcon icon={faClock} className="ml-4 mr-2 text-gray-400" />
                            <span>3 days ago</span>
                        </div>
                    </div>
                    <div 
                        className="prose prose-lg max-w-none p-6 text-gray-300" 
                        dangerouslySetInnerHTML={{ __html: postData.posts[0].content }}
                    ></div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-800 rounded-xl shadow-xl p-6"
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-100">Discussion</h2>
                    <div className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Add to the discussion"
                            className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows="3"
                        ></textarea>
                        <button
                            onClick={handleCommentSubmit}
                            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Post Comment
                        </button>
                    </div>
                    <div className="space-y-6">
                        {comments && comments.map(comment => (
                            <Comment key={comment._id} comment={comment} onReply={handleReplySubmit} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default DisplayPostWithComments;