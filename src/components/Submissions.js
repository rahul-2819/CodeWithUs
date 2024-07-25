import React, { useEffect, useState } from 'react'
import { auth } from '../firebase-config';
import { getDatabase, onValue, ref } from 'firebase/database';

export default function Submissions() {
  const [submissions,setSubmissions] = useState([]);
  const [loading,setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const user = auth.currentUser;
  const db = getDatabase();

  useEffect(()=>{
      if(!user){
        alert("You need to log in to view your submissions");
        return;
      }

      const questionId = localStorage.getItem("CurrentQuestionName");
      const userId = user.uid;

      const submissionRef = ref(db,`submissions/${userId}/${questionId}`);
      const unsubscribe = onValue(submissionRef,(snapshot)=>{
        const data = snapshot.val();
        if(data){
          const submissionList = Object.values(data);
          setSubmissions(submissionList);
        }else{
          setSubmissions([]);
        }
        setLoading(false);
      });

      return()=>{
        unsubscribe();
      }
  },[db,user]);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission); // Set the selected submission
  };

  const closeModal = () => {
    setSelectedSubmission(null); // Close the modal
  };

  return (
<div className="container mx-auto p-6" style={{ backgroundColor: '#1a202c', color: '#e2e8f0' }}>
      <h2 className="text-2xl font-bold mb-4">Submissions</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">Result</th>
              <th className="py-2 px-4 border-b border-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={index} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleRowClick(submission)}>
                <td
                  className={`py-2 px-4 border-b border-gray-700 ${
                    submission.result === 'Accepted' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                  }`}
                >
                  {submission.result}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {new Date(submission.time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg max-w-3xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-white">Submission Code</h3>
            <pre className="bg-gray-900 p-4 rounded max-h-96 overflow-y-auto text-gray-300">
              {selectedSubmission.code}
            </pre>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
