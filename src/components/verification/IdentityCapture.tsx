'use client';

import { useState, useRef, useEffect } from 'react';

export default function IdentityCapture({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Request camera access
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setErrorMessage('Camera access is required for verification.');
        console.error(err);
      }
    };
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    setVideoBlob(null);
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoBlob(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);

    // Stop recording automatically after 10 seconds
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setRecording(false);
      }
    }, 10000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoBlob) {
        setErrorMessage('Face video is missing.');
        return;
    }
    if (!idFile) {
        setErrorMessage('Government ID picture is missing.');
        return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'face-video.webm');
      formData.append('idCard', idFile, idFile.name);

      const res = await fetch('/api/user/verification/submit-id', {
        method: 'POST',
        body: formData, // the browser sets the matching Content-Type automatically
      });

      if (res.ok) {
        onComplete(); // Move to pending screen
      } else {
        const data = await res.json();
        setErrorMessage(data.message || 'Failed to submit verification data.');
      }
    } catch (error) {
       console.error(error);
       setErrorMessage('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Face Video & ID Verification</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Please capture a 5-10 second video of your face, looking straight into the camera, and upload a clear picture of your National ID or Passport.
      </p>

      {errorMessage && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{errorMessage}</div>}

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Step 1: Video Capture */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg dark:text-white">1. Face Video</h3>
          <div className="relative bg-black rounded-lg aspect-auto overflow-hidden shadow-inner">
             {/* Live Camera Feed */}
             <video 
               ref={videoRef} 
               autoPlay 
               muted 
               playsInline 
               className={`w-full h-48 object-cover ${videoBlob ? 'hidden' : 'block'}`} 
             />
             
             {/* Recorded Video Playback */}
             {videoBlob && (
               <video 
                 src={URL.createObjectURL(videoBlob)} 
                 controls 
                 className="w-full h-48 object-cover" 
               />
             )}
          </div>
          
          {!videoBlob ? (
            <div className="flex justify-center">
              {!recording ? (
                <button 
                  type="button" 
                  onClick={startRecording}
                  disabled={!stream}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full disabled:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                  🔴 Start Recording (10s)
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={stopRecording}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full animate-pulse focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  ⏹ Stop Recording
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <button 
                type="button" 
                onClick={() => setVideoBlob(null)}
                className="text-blue-500 hover:text-blue-700 underline text-sm"
              >
                Retake Video
              </button>
            </div>
          )}
        </div>

        {/* Step 2: ID Upload */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg dark:text-white">2. Government ID</h3>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center h-48 bg-gray-50 dark:bg-gray-700 text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition">
             {!idFile ? (
               <>
                 <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 <label className="cursor-pointer text-blue-600 hover:underline">
                   <span>Click to upload NID or Passport</span>
                   <input type="file" accept="image/*" className="hidden" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
                 </label>
                 <p className="text-xs text-gray-500 mt-2">Maximum file size: 5MB</p>
               </>
             ) : (
               <div className="flex flex-col items-center">
                 <p className="text-green-600 font-semibold mb-2 flex items-center gap-2">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                   File Selected
                 </p>
                 <p className="text-sm truncate w-48 text-gray-700 dark:text-gray-300 mx-auto">{idFile.name}</p>
                 <button onClick={() => setIdFile(null)} className="text-red-500 text-xs mt-3 underline">Remove</button>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t dark:border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={!videoBlob || !idFile || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md transition-shadow focus:ring-4 focus:ring-blue-300"
        >
          {loading ? 'Submitting encrypted data...' : 'Submit Verification Data'}
        </button>
        <p className="text-xs text-center text-gray-500 mt-3">
          Your data is securely transmitted and encrypted. Only authorized personnel have access for verification.
        </p>
      </div>
    </div>
  );
}
