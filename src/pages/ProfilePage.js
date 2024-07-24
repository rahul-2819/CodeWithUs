import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { get, getDatabase, ref, update } from 'firebase/database';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJs, Tooltip,Legend, ArcElement,ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

ChartJs.register(ArcElement,Tooltip,Legend,ChartDataLabels);

function ProfilePage() {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [newDetails, setNewDetails] = useState({ name: '', mobile: '',skills:''});

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
        backgroundColor: ['#4caf50', '#f44336'],
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
    cutout: '70%',
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
    <div className="flex flex-col items-center bg-gray-900 min-h-screen py-10 text-white">
      <div className="w-full max-w-6xl bg-gray-800 shadow-md rounded-lg overflow-hidden flex">
        {/* Left Column */}
        <div className="w-full max-w-xs bg-gray-700 p-4 flex flex-col items-center">
            <img
              src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg"
              alt="Profile"
              className="w-24 h-24 rounded-full mb-3 border-4 border-green-500 shadow-lg"
            />
            <h2 className="text-xl font-semibold mb-1">
              {user ? userData.name : "--"}
            </h2>
            <p className="text-gray-400 text-sm mb-2">{user ? userData.email : "Email Not Found"}</p>
            <button
              className="mb-4 bg-green-500 text-white py-1 px-3 text-sm rounded-lg hover:bg-green-600 transition duration-300"
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>
            
            <div className="w-full space-y-4">
              <div className="bg-gray-800 p-3 rounded-lg shadow-md">
                <h3 className="text-base font-semibold mb-2 border-b border-gray-600 pb-1">Personal Details</h3>
                <p className="text-sm mb-2"><span className="font-medium">Username:</span> {userData ? userData.username : "--"}</p>
                <p className="text-sm mb-2"><span className="font-medium">Mobile:</span> {userData ? userData.mobile : "--"}</p>
                <p className="text-sm"><span className="font-medium">Skills:</span> {userData ? userData.skills : "--"}</p>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg shadow-md">
                <h3 className="text-base font-semibold mb-2 border-b border-gray-600 pb-1">Community Stats</h3>
                {/* <p className="text-sm mb-1"><span className="font-medium">Views:</span> 0</p> */}
                <p className="text-sm mb-2"><span className="font-medium">Solution:</span> 0</p>
                <p className="text-sm mb-2"><span className="font-medium">Discuss:</span> 0</p>
                <p className="text-sm"><span className="font-medium">Reputation:</span> 0</p>
              </div>
            </div>

            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full hover:bg-red-600 transition duration-300 text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        {/* Right Column */}
          <div className="flex-1 p-6 flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center h-48">
                <h3 className="text-xl font-semibold mb-2">Contest Rating</h3>
                <p>Coming Soon...</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center h-48">
                <h3 className="text-xl font-semibold mb-2">Solve Count</h3>
                <div className="w-full h-28">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-2">Submissions</h3>
                {userData.solved_questions ? (
                  <div className="w-full h-48 overflow-y-auto">
                    <ul className="w-full">
                    {Object.entries(userData.solved_questions).map(([questionId, questionData]) => (
                        <li 
                          key={questionId} 
                          className="mb-2 p-2 bg-gray-600 rounded flex justify-between items-center cursor-pointer hover:bg-gray-500"
                          onClick={() => handleSubmissionClick(questionId, questionData)}
                        >
                          <span className="font-semibold">{questionId}</span>
                          <span className="text-sm text-gray-300">
                            {questionData.time ? getRelativeTime(questionData.time) : 'Time not available'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No submissions yet</p>
                )}
              </div>
            </div>
      </div>

      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>
          <div className="mb-6">
            <input
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
              type="text"
              name="name"
              placeholder="Name"
              value={newDetails.name}
              onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={newDetails.mobile}
              onChange={(e) => setNewDetails({ ...newDetails, mobile: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
              type="text"
              name="skills"
              placeholder="Skills"
              value={newDetails.skills}
              onChange={(e) => setNewDetails({ ...newDetails, skills: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-blue-600"
              onClick={handleSaveProfile}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      )}
      {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg max-w-3xl w-full h-[80vh] flex flex-col">
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
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default ProfilePage;
