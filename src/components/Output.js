import React, { useEffect } from 'react'

function Output({res}) {

  return (
    <div className=" h-80">
      <div className="border border-gray-400 p-4 h-full">
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <pre>{res}</pre>
      </div>
    </div>
  )
}

export default Output
