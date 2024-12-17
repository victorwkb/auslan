"use client";

import React, { useState } from "react";
import { WebcamCapture } from "@/components/webcam-capture";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handlePermissionClick = () => {
    setPermissionGranted(true);
  };

  return (
    <div className="md:h-screen flex flex-col bg-gradient-to-b from-primary from-10% via-secondary via-30% to-tertiary to-90% items-center">
      {!permissionGranted ? (
        <div className="container h-screen flex flex-col justify-center items-center mx-auto px-4 py-16">
          <div className="text-center mb-20">
            <>
              <h1
                className="animate-in-reverse text-5xl md:text-6xl lg:text-7xl font-bold py-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
                style={{ "--index": 3 } as React.CSSProperties}
              >
                Fingerspelling
                <br />
                🤙 Quiz ✌️
              </h1>
              <p
                className="text-xl md:text-3xl text-gray-600 px-16 py-2 mx-auto animate-in-reverse"
                style={{ "--index": 2 } as React.CSSProperties}
              >
                Powered by Machine learning and AI
              </p>
              <Button
                onClick={handlePermissionClick}
                className="animate-in text-l text-white uppercase px-14 py-6 mt-8"
                style={{ "--index": 1 } as React.CSSProperties}
              >
                Enable Webcam
              </Button>
            </>
          </div>
          <footer className="absolute bottom-8 text-center text-sm text-primary max-w-xs px-4">
            This app processes your webcam data locally to recognize Auslan hand
            signs. No data is stored or sent anywhere.
          </footer>
        </div>
      ) : (
        <WebcamCapture />
      )}
    </div>
  );
}
