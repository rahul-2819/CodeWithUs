import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faComments } from '@fortawesome/free-solid-svg-icons';

function Discuss() {
  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const nav = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/getpost')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setSelectedTab(data[0]?._id || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedTab(category._id);
  };

  const handlePostClick = (postId, selectedTab) => {
    localStorage.setItem('postId', postId);
    localStorage.setItem('selectedTab', selectedTab);
    nav('/post');
  };

  const handleAddPost = () => {
    if (user) {
      setShowModal(true);
    } else {
      alert('You need to login to add a post');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      categoryTitle: newPostCategory,
      postTitle: newPostTitle,
      postContent: newPostContent,
    };

    try {
      const response = await fetch('http://localhost:5000/api/addpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Post has been added successfully.');
        setNewPostTitle('');
        setNewPostCategory('');
        setNewPostContent('');
        setShowModal(false);
      } else {
        alert('Failed to submit post.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Failed to submit post. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Discussion Forum</h1>
      <div className="flex justify-center space-x-4 mb-8">
        {loading ? (
          <div className="flex justify-center items-center w-full h-64">
            <ClipLoader size={50} color="#4F46E5" />
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <motion.div
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer px-6 py-3 rounded-full shadow-md transition-all duration-300 ${
                  selectedTab === category._id
                    ? 'bg-indigo-700 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.title}
              </motion.div>
            ))}
            <motion.button
              onClick={handleAddPost}
              className="cursor-pointer px-6 py-3 rounded-full bg-green-600 text-white shadow-md hover:bg-green-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Post
            </motion.button>
          </>
        )}
      </div>
      <div>
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-300">
          {categories.find((cat) => cat._id === selectedTab)?.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories
            .find((cat) => cat._id === selectedTab)
            ?.posts.map((post, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white">{post.title}</h3>
                  <p className="text-gray-400 mb-4">{post.content.substring(0, 100)}...</p>
                  <button
                    onClick={() => handlePostClick(post._id, selectedTab)}
                    className="text-indigo-400 hover:text-indigo-500 font-semibold focus:outline-none transition duration-300 ease-in-out flex items-center"
                  >
                    <FontAwesomeIcon icon={faComments} className="mr-2" />
                    Read More
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Post</h2>
              <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-300">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter title..."
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Select Category
                </label>
                <select
                  id="category"
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                  className="block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter content..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Post
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Discuss;
