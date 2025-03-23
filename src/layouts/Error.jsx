import React from 'react';

export default function Error() {
  return (
    <div className=" bg-gray-200 flex flex-col items-center justify-center h-screen  text-center">
      <img src="../public/back404.png"/>
      <p className="text-lg text-gray-500 mt-2">We Are Sorry, Page Not Found.</p>
      <button 
        className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600 transition"
        onClick={() => window.location.href = '/'}>
        Back To Home
      </button>
    </div>
  );
}