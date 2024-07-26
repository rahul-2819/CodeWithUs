import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';

export default function Home() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  
  const checkUser = () => {
    if (user) {
      navigate('/profilePage');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4 overflow-hidden">
      <div className="container mx-auto flex flex-col items-center gap-12">
        <motion.header 
          className="text-center mt-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to CodeWithUs</h1>
          <p className="text-2xl text-gray-300">Sharpen your coding skills and ace your interviews</p>
        </motion.header>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
              onClick={() => navigate('/problems')}>
            Start Solving
          </button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FeatureCard 
            title="Practice Daily"
            description="Solve our curated problems and improve your skills every day."
            icon="🏆"
            onClick={() => navigate('/problems')}
          />
          <FeatureCard 
            title="Learn from Others"
            description="Engage in discussions and see how others approach problems."
            icon="💬"
            onClick={() => navigate('/discuss')}
          />
          <FeatureCard 
            title="Track Progress"
            description="Monitor your improvement with detailed statistics and insights."
            icon="📊"
            onClick={checkUser}
          />
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose CodeWithUs?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            CodeWithUs is your one-stop platform for honing your coding skills, and connecting with a community of like-minded developers. With our extensive problem set, real-time discussions, and performance tracking, you'll be well-equipped to tackle any coding challenge that comes your way.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon, onClick }) {
  return (
    <div 
      className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
