// import React, { useEffect, useState } from 'react';
// import { auth } from '../firebase-config';
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { get, getDatabase, ref, update } from 'firebase/database';

// function ProfilePage() {
//   const [user, setUser] = useState(auth.currentUser);
//   const [userData,setUserData]= useState([]);
//   const navigate = useNavigate();
//   const [editMode,setEditMode]=useState(false);
//   const [newDetails,setNewDetails] = useState({ username: '', mobile: '' });
//   const [experience,setExperience]=useState("");

//   useEffect(()=>{
//     if(user){
//       const db = getDatabase();
//       const userRef = ref(db,'users/'+user.uid);
//       get(userRef)
//         .then((snapshot)=>{
//           if(snapshot.exists()){
//             setUserData(snapshot.val());
//           }else console.log("No data available");
//         })
//         .catch((error)=>{
//           console.error(error);
//         })
//     }
//   },[user]);

//   const handleEditProfile=()=>{
//     setEditMode(true);
//   }

//   const handleSaveProfile=()=>{
//     const db = getDatabase();
//     const userRef = ref(db,'users/'+user.uid);
//     update(userRef,{
//       username: newDetails.username,
//       mobile: newDetails.mobile
//     }).then(()=>{
//       setUserData({...userData,...newDetails});
//       setEditMode(false);
//     }).catch((error)=>{
//       alert(error.message);
//     })
//   };

//   const handleAddExperience =()=>{
//     const db =getDatabase();
//     const userRef = ref(db,'users/'+user.uid);

//     update(userRef,{
//       experience
//     }).then(()=>{
//       setUserData({...userData, experience});
//       setExperience('');
//     }).catch((error)=>{
//       alert(error.message);
//     })
//   }

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       navigate('/');
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-gray-900 min-h-screen py-10 text-white">
//       <div className="w-full max-w-6xl bg-gray-800 shadow-md rounded-lg overflow-hidden flex">
//         {/* Left Column */}
//         <div className="w-full max-w-xs bg-gray-700 p-6 flex flex-col items-center">
//           <img
//             src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg"
//             alt="Profile"
//             className="w-32 h-32 rounded-full mb-4"
//           />
//           <h2 className="text-2xl font-semibold">
//             {user ? userData.name : "--"}
//           </h2>
//           <p className="text-gray-400">{user ? userData.email : "Email Not Found"}</p>
//           <button
//             className="mt-2 bg-green-500 text-white py-1 px-3 rounded-lg"
//             onClick={handleEditProfile}
//           >
//             Edit Profile
//           </button>
//           <div className="mt-4 w-full">
//             <div className="text-lg font-semibold mb-2">Personal Details</div>
//             <p>Username: {userData ? userData.username : "--"}</p>
//             <p>Mobile: {userData ? userData.mobile : "--"}</p>
//             <p>Skills: C++</p>
//           </div>
//           <div className="mt-4 w-full">
//             <div className="text-lg font-semibold mb-2">Experience</div>
//             <p>No Experience</p>
//           </div>
//           <div className="mt-4 w-full">
//             <div className="text-lg font-semibold mb-2">Community Stats</div>
//             <p>Views: 0</p>
//             <p>Solution: 0</p>
//             <p>Discuss: 0</p>
//             <p>Reputation: 0</p>
//           </div>
//           <button
//             className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//         {/* Right Column */}
//         <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//           <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
//             <h3 className="text-xl font-semibold mb-2">Contest Rating</h3>
//             <p>Not Available</p>
//           </div>
//           <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
//             <h3 className="text-xl font-semibold mb-2">Global Ranking</h3>
//             <p>Not Available</p>
//           </div>
//           <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
//             <h3 className="text-xl font-semibold mb-2">Solve Count</h3>
//             <p>Not Available</p>
//           </div>
//           <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
//             <h3 className="text-xl font-semibold mb-2">Badges</h3>
//             <p>Not Available</p>
//           </div>
//           <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center md:col-span-2">
//             <h3 className="text-xl font-semibold mb-2">Submissions</h3>
//             <p>Not Available</p>
//           </div>
//         </div>
//       </div>

//       {editMode && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//           <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>
//           <div className="mb-6">
//             <input
//               className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 placeholder-gray-500"
//               type="text"
//               name="username"
//               placeholder='Username'
//               value={newDetails.username}
//               onChange={(e) => setNewDetails({ ...newDetails, username: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <input
//               className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 placeholder-gray-500"
//               type="text"
//               name="mobile"
//               placeholder='Mobile Number'
//               value={newDetails.mobile}
//               onChange={(e) => setNewDetails({ ...newDetails, mobile: e.target.value })}
//               required
//             />
//           </div>
//           <div className="flex justify-end">
//             <button
//               className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
//               onClick={handleSaveProfile}
//             >
//               Save
//             </button>
//             <button
//               className="bg-gray-500 text-white py-2 px-4 rounded-lg"
//               onClick={() => setEditMode(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//       )}
//       {/* <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold text-center mb-4">Add Experience</h2>
//         <textarea
//           className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 placeholder-gray-500"
//           name="experience"
//           placeholder="Add your experience here..."
//           value={experience}
//           onChange={(e) => setExperience(e.target.value)}
//         />
//         <div className="flex justify-end mt-4">
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded-lg"
//             onClick={handleAddExperience}
//           >
//             Add Experience
//           </button>
//         </div>
//       </div> */}
//     </div>
//   );
// }

// export default ProfilePage;
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { get, getDatabase, ref, update } from 'firebase/database';

function ProfilePage() {
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [experienceMode, setExperienceMode] = useState(false);
  const [newDetails, setNewDetails] = useState({ username: '', mobile: '' });
  const [experience, setExperience] = useState('');

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else console.log("No data available");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + user.uid);
    update(userRef, {
      username: newDetails.username,
      mobile: newDetails.mobile
    }).then(() => {
      setUserData({ ...userData, ...newDetails });
      setEditMode(false);
    }).catch((error) => {
      alert(error.message);
    });
  };

  const handleAddExperience = () => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + user.uid);

    update(userRef, {
      experience
    }).then(() => {
      setUserData({ ...userData, experience });
      setExperience('');
      setExperienceMode(false);
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

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen py-10 text-white">
      <div className="w-full max-w-6xl bg-gray-800 shadow-md rounded-lg overflow-hidden flex">
        {/* Left Column */}
        <div className="w-full max-w-xs bg-gray-700 p-6 flex flex-col items-center">
          <img
            src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold">
            {user ? userData.name : "--"}
          </h2>
          <p className="text-gray-400">{user ? userData.email : "Email Not Found"}</p>
          <button
            className="mt-2 bg-green-500 text-white py-1 px-3 rounded-lg"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
          <div className="mt-4 w-full">
            <div className="text-lg font-semibold mb-2">Personal Details</div>
            <p>Username: {userData ? userData.username : "--"}</p>
            <p>Mobile: {userData ? userData.mobile : "--"}</p>
            <p>Skills: C++</p>
          </div>
          <div className="mt-4 w-full">
            <div className="text-lg font-semibold mb-2">Experience</div>
            <p>{userData.experience ? userData.experience : "No Experience"}</p>
            <button
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg"
              onClick={() => setExperienceMode(true)}
            >
              Add Experience
            </button>
          </div>
          <div className="mt-4 w-full">
            <div className="text-lg font-semibold mb-2">Community Stats</div>
            <p>Views: 0</p>
            <p>Solution: 0</p>
            <p>Discuss: 0</p>
            <p>Reputation: 0</p>
          </div>
          <button
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {/* Right Column */}
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Contest Rating</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Global Ranking</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Solve Count</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Badges</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center md:col-span-2">
            <h3 className="text-xl font-semibold mb-2">Submissions</h3>
            <p>Not Available</p>
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
              name="username"
              placeholder="Username"
              value={newDetails.username}
              onChange={(e) => setNewDetails({ ...newDetails, username: e.target.value })}
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

      {experienceMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">Add Experience</h2>
          <textarea
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
            name="experience"
            placeholder="Add your experience here..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-blue-600"
              onClick={handleAddExperience}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              onClick={() => setExperienceMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
}

export default ProfilePage;
