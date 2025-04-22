import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg shadow-lg">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Đang tải...</p>
      </div>
    </div>
  )
} 