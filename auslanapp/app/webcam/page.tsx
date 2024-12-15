'use client'

import React, { useState } from 'react';
import { WebcamCapture } from '@/components/webcam-capture';

export default function Home() {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handlePermissionClick = () => {
    setPermissionGranted(true);
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-100 to-purple-200 bg-opacity-55 h-screen flex flex-col items-center justify-center">
      {!permissionGranted ? (
        <><div className=" absolute top-20 w-1/2 text-center p-4 text-4xl text-gray-700 justify-center"> 
        <p className="mb-4">🤙 Auslan Fingerspelling Quiz ✌️</p>
        <p className="text-lg text-gray-700">Powered by machine learning and AI</p>
      </div>
      <p className="text-xl text-gray-700 mb-4 leading-tight">
          This feature requires access to your webcam.
        </p>
        <button
          onClick={handlePermissionClick}
          className="bg-purple-700 text-white px-10 py-2 text-xl rounded mt-2"
        >
            Enable Webcam
          </button></>
      ) : (
        <WebcamCapture />
      )}
    </div>
  );
}
