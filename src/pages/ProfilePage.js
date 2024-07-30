import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { get, getDatabase, ref, update } from 'firebase/database';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJs,Legend,Tooltip, ArcElement,ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaMobileAlt, FaCode, FaEye, FaComments, FaTrophy } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as Tooltip1, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
ChartJs.register(ArcElement,Legend,ChartDataLabels);

function ProfilePage() {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [newDetails, setNewDetails] = useState({ name: '', mobile: '',skills:''});
  const [submissions,setSubmissions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [dailySubmissions, setDailySubmissions] = useState([]);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + currentUser.uid);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUserData(snapshot.val());
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + user.uid);
    update(userRef, {
      name: newDetails.name,
      mobile: newDetails.mobile,
      skills: newDetails.skills
    }).then(() => {
      setUserData({ ...userData, ...newDetails });
      setNewDetails({name:'', mobile:'',skills:''})
      setEditMode(false);
    }).catch((error) => {
      alert(error.message);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const db = getDatabase();
        const submissionRef = ref(db, 'submissions/' + currentUser.uid);
        
        get(submissionRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const submissionsData = snapshot.val();
              // console.log('Submissions data structure:', JSON.stringify(submissionsData, null, 2));
              setSubmissions(submissionsData);
              try {
                const processedData = processSubmissionsData(submissionsData, selectedMonth);
                // console.log('Processed daily submissions:', processedData);
                setDailySubmissions(processedData);
              } catch (error) {
                console.error('Error processing submissions data:', error);
                setDailySubmissions([]);
              }
            } else {
              console.log('No data available');
              setDailySubmissions([]);
            }
          })
          .catch((error) => {
            console.log('Error fetching submissions:', error);
            setDailySubmissions([]);
          });
      }
    });
  
    return () => unsubscribe();
  }, [selectedMonth]);

  const processSubmissionsData = (submissions, month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start, end });
  
    const dailyCount = daysInMonth.map(day => {
      let count = 0;
      Object.entries(submissions).forEach(([questionId, questionData]) => {
        // Check if the questionData is an object and has submissions
        if (typeof questionData === 'object' && questionData !== null) {
          Object.values(questionData).forEach(submission => {
            if (submission.time) {
              const submissionDate = new Date(submission.time);
              if (!isNaN(submissionDate.getTime()) && 
                  format(submissionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')) {
                count++;
              }
            }
          });
        }
      });
  
      return { date: format(day, 'dd'), count };
    });
  
    return dailyCount;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  // Pie chart data
  const solvedQuestionsCount = userData.solved_questions ? Object.keys(userData.solved_questions).length : 0;
  const totalQuestions = 10;

  const doughnutData = {
    labels: ['Solved', 'Remaining'],
    datasets: [
      {
        data: [solvedQuestionsCount, totalQuestions - solvedQuestionsCount],
        backgroundColor: ['#81C784', '#E57373'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value} (${((value / totalQuestions) * 100).toFixed(1)}%)`;
          },
        },
      },
    },
    responsive: true,
    cutout: '80%',
    maintainAspectRatio: false,
  };

  function getRelativeTime(timestamp) {
    const now = new Date();
    const submittedDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - submittedDate) / 1000);
  
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  }

  const handleSubmissionClick = (questionId, questionData) => {
    setSelectedSubmission({ questionId, ...questionData });
  };




  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen py-10 text-white">
      <div className="w-full max-w-6xl bg-gray-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/3 bg-gray-700 p-6 flex flex-col items-center"
        >
          <div className="relative mb-6">
            <img
              src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
              <FaUser className="text-white text-xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {user ? userData.name : "--"}
          </h2>
          <p className="text-gray-300 text-sm mb-4">{user ? userData.email : "Email Not Found"}</p>
          <button
            className="mb-6 bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-105"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
          
          <div className="w-full space-y-6">
            <div className="bg-gray-800 p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">Personal Details</h3>
              <div className="space-y-2">
                <p className="text-sm flex items-center"><FaUser className="mr-2 text-green-500" /> {userData ? userData.username : "--"}</p>
                <p className="text-sm flex items-center"><FaMobileAlt className="mr-2 text-green-500" /> {userData ? userData.mobile : "--"}</p>
                <p className="text-sm flex items-center"><FaCode className="mr-2 text-green-500" /> {userData ? userData.skills : "--"}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">Community Stats</h3>
              <div className="space-y-2">
                <p className="text-sm flex items-center"><FaEye className="mr-2 text-blue-500" /> Views: 0</p>
                <p className="text-sm flex items-center"><FaCode className="mr-2 text-blue-500" /> Solutions: 0</p>
                <p className="text-sm flex items-center"><FaComments className="mr-2 text-blue-500" /> Discuss: 0</p>
                <p className="text-sm flex items-center"><FaTrophy className="mr-2 text-blue-500" /> Reputation: 0</p>
              </div>
            </div>
          </div>

          <button
            className="mt-6 bg-red-400 text-white py-2 px-6 rounded-full w-full hover:bg-red-500 transition duration-300 transform hover:scale-105"
            onClick={handleLogout}
          >
            Logout
          </button>
        </motion.div>

        {/* Right Column */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 p-6 flex flex-col space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-gray-700 p-6 rounded-xl shadow-md flex flex-col items-center h-64 transition-transform duration-300 ">
                  <h3 className="text-xl font-semibold mb-3">Submissions</h3>
                  <div className="w-full flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                      className="text-sm bg-blue-700 px-3 py-1 rounded-full transition-colors duration-300 hover:bg-blue-600"
                    >
                      ← Prev
                    </button>
                    <span className="text-lg font-medium">{format(selectedMonth, 'MMMM yyyy')}</span>
                    <button 
                      onClick={() => setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                      className="text-sm bg-blue-700 px-3 py-1 rounded-full transition-colors duration-300 hover:bg-blue-600"
                    >
                      Next →
                    </button>
                  </div>
                  <div className="w-full h-56">
                    {dailySubmissions.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={dailySubmissions}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#999"
                            tick={{ fill: '#999', fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="#999"
                            tick={{ fill: '#999', fontSize: 12 }}
                          />
                          <Tooltip1
                            contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff' }}
                            itemStyle={{ color: '#8884d8' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorCount)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No data available for this month
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-xl shadow-md flex flex-col items-center h-64 transition-transform duration-300">
                          {/* <h3 className="text-xl font-semibold mb-4">Solve Count</h3> */}
                          <div className="w-full">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                          </div>
                          <p className="flex items-center mt-3">
                            <span className="font-medium text-lg">{solvedQuestionsCount}</span>
                            <span className="text-sm text-gray-300"> / 10</span>    
                          </p>
                          <p className="flex items-center" >
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                          Solved
                          </p>
                        </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-xl shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Submissions</h3>
            {userData.solved_questions ? (
              <div className="w-full h-64 overflow-y-auto">
                <ul className="w-full space-y-2">
                  {Object.entries(userData.solved_questions).map(([questionId, questionData]) => (
                    <motion.li 
                      key={questionId}
                      className="p-3 bg-gray-600 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-500"
                      onClick={() => handleSubmissionClick(questionId, questionData)}
                    >
                      <span className="font-semibold">{questionId}</span>
                      <span className="text-sm text-gray-300">
                        {questionData.time ? getRelativeTime(questionData.time) : 'Time not available'}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No submissions yet</p>
            )}
          </div>
        </motion.div>
      </div>

      
      {/* Edit Profile Modal */}
<AnimatePresence>
  {editMode && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="name"
            placeholder="Name"
            value={newDetails.name}
            onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={newDetails.mobile}
            onChange={(e) => setNewDetails({ ...newDetails, mobile: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="skills"
            placeholder="Skills"
            value={newDetails.skills}
            onChange={(e) => setNewDetails({ ...newDetails, skills: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={handleSaveProfile}
          >
            Save
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {selectedSubmission && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-3xl w-full h-[80vh] flex flex-col"
      >
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold mb-2">{selectedSubmission.questionId}</h2>
          <p className="mb-1">Submitted: {new Date(selectedSubmission.time).toLocaleString()}</p>
          <p>Result: {selectedSubmission.result}</p>
        </div>
        
        {/* Scrollable Code Section */}
        <div className="flex-grow overflow-y-auto p-6">
          <h3 className="text-xl font-semibold mb-2">Code:</h3>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <code>{selectedSubmission.code}</code>
          </pre>
        </div>
        
        {/* Fixed Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => setSelectedSubmission(null)}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}

export default ProfilePage;
