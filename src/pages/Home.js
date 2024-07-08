import React from 'react'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row gap-4">
        <div className='md:w-1/3 bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col'>
          <h2 className='text-2xl font-bold mb-4'>Recent Activities</h2>
          <div className='flex-grow overflow-y-auto'>
            {/* Your recent activities data will go here */}
          </div>
        </div>
        <div className='md:w-2/3 flex flex-col gap-4'>
          {['Weekly Contest 1', 'Weekly Contest 2', 'Weekly Contest 3', 'Weekly Contest 4'].map((contest, index) => (
            <div key={index} className='bg-gray-800 rounded-xl shadow-lg p-6 transition duration-300 ease-in-out hover:bg-gray-700'>
              <h3 className='text-xl font-semibold'>{contest}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}