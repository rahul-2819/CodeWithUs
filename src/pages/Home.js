import React from 'react'

export default function Home() {
  return (
    <div className = "flex col max-w-30  mx-auto">
       <div className='h-[90vh] w-[30%] bg-blue-50 m-2 rounded-lg p-2 flex item-center justify-center'>
           Recent Activities
         
       </div>
       <div className='w-[70%]  m-2 flex flex-col h-auto'>
        <div className='bg-blue-50 m-2 br-lg h-[10vh] rounded-lg flex item-center justify-center'>
          Weekly Contest 001
        </div>
        <div className='bg-blue-50 m-2 br-lg h-[10vh] rounded-lg flex item-center justify-center'>
          Weekly Contest 002
        </div>
        <div className='bg-blue-50 m-2 br-lg h-[10vh] rounded-lg flex item-center justify-center'>
          Weekly Contest 002
        </div>
        <div className='bg-blue-50 m-2 br-lg h-[10vh] rounded-lg flex item-center justify-center'>
          Weekly Contest 002
        </div>
         
       </div>
   </div>
  );
}
