import React, {useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

function Discuss() {
  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const user = auth.currentUser;
  const nav = useNavigate();


  useEffect(() => {
    fetch('http://localhost:5000/api/getpost')
    
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setSelectedTab(data[0]._id);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedTab(category._id);
  };

  const handlePostClick = (postId,selectedTab) => {
    alert(postId)
    localStorage.setItem('postId', postId);
    localStorage.setItem('selectedTab', selectedTab);
    nav('/post');
  };

  const handleAddPost = () => {
    if (user) {
      setShowModal(true);
    } else alert('You need to login to add a post');
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission
    console.log('New Post Title:', newPostTitle);
    console.log('New Post Category:', newPostCategory);
    console.log('New Post Content:', newPostContent);

    const postData = {
      categoryTitle: newPostCategory,
      postTitle: newPostTitle,
      postContent: newPostContent,
    }
    fetch('http://localhost:5000/api/addpost' ,{
      method:'POST',
      headers:{
        'Content-Type' :'application/json',
      },
      body: JSON.stringify(postData),
    })
    .then((response)=> response.json())
    .then((data)=>{
      if(data.success){
        alert('post has been added');

        
         // Reset form fields
        setNewPostTitle('');
        setNewPostCategory('');
        setNewPostContent('');
        // Close the modal
        setShowModal(false);
        window.location.reload();
      }else alert('Failed to submit post');
    })
    .catch((error)=> console.error('Error submitting ',error));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center space-x-4 mb-4">
        {categories.map((category) => (
          <motion.div
          key={category._id}
          onClick={() => handleCategoryClick(category)}
          className={`cursor-pointer border border-gray-500 px-4 py-2 rounded ${
            selectedTab === category._id ? 'bg-blue-200 text-gray-800' : 'bg-gray-200 text-gray-800'
          }`}
          whileHover={{ y: -5 }}
          whileTap={{ y: 5 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {category.title}
        </motion.div>
        
        ))}
        <button
          onClick={handleAddPost}
          className="cursor-pointer border border-gray-500 px-4 py-2 rounded bg-green-200 text-gray-800"
        >
          Add Post
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">{categories.find(cat => cat._id === selectedTab)?.title}</h2>
        {categories.find(cat => cat._id === selectedTab)?.posts.map((post, index) => (
          <div key={index} className="border-b border-gray-300 mb-6 pb-6">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-2">{post.content.substring(0, 100)}...</p>
            <button
              onClick={() => handlePostClick(post._id,selectedTab)}
              className="text-blue-500 hover:underline focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      {/* Modal for adding a new post */}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded p-4 w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Post</h2>
            <form onSubmit={handleFormSubmit} className="max-w-md mx-auto">
  <div className="mb-4">
    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
      Title
    </label>
    <input
      type="text"
      id="title"
      value={newPostTitle}
      onChange={(e) => setNewPostTitle(e.target.value)}
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="Enter title..."
      required
    />
  </div>
  <div className="mb-4">
    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
      Select Category
    </label>
    <select
      id="category"
      value={newPostCategory}
      onChange={(e) => setNewPostCategory(e.target.value)}
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
  <div className="mb-4">
    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
      Content
    </label>
    <textarea
      id="content"
      value={newPostContent}
      onChange={(e) => setNewPostContent(e.target.value)}
      rows={4}
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="Enter content..."
      required
    ></textarea>
  </div>
  <div className="flex justify-end">
    <button
      type="button"
      onClick={handleModalClose}
      className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-6 py-2 border border-transparent rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Add Post
    </button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
}

export default Discuss;
