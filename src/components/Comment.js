import React from 'react'

function Comment({ author, content, createdAt }) {
        return (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="text-gray-600 text-sm mb-1">{new Date(createdAt).toLocaleDateString()}</div>
            <div className="font-semibold text-gray-800">{author}</div>
            <div className="text-gray-700">{content}</div>
          </div>
  )
}

export default Comment