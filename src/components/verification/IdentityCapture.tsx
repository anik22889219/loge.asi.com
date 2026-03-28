'use client';

import { useState, useRef, useEffect } from 'react';

export default function IdentityCapture({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
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
        setErrorMessage('Camera access is required for Face Video verification.');
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
        setErrorMessage('Face video is missing. Please record a short video.');
        return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'face-video.webm');

      const res = await fetch('/api/user/verification/submit-id', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        onComplete(); // Move to next step or dashboard
      } else {
        const data = await res.json();
        setErrorMessage(data.message || 'Failed to submit video verification.');
      }
    } catch (error) {
       console.error(error);
       setErrorMessage('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Live Face Verification</h2>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
        To ensure a safe community, please capture a 5-10 second live video of your face, looking straight into the camera. No ID card is required.
      </p>

      {errorMessage && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg text-center font-medium">{errorMessage}</div>}

      <div className="space-y-6">
        <div className="relative bg-black rounded-xl aspect-video overflow-hidden shadow-inner max-w-lg mx-auto border-4 border-gray-100 dark:border-gray-700">
            {/* Live Camera Feed */}
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`w-full h-full object-cover ${videoBlob ? 'hidden' : 'block'}`} 
            />
            
            {/* Recorded Video Playback */}
            {videoBlob && (
              <video 
                src={URL.createObjectURL(videoBlob)} 
                controls 
                className="w-full h-full object-cover bg-gray-900" 
              />
            )}

           {/* Recording indicator overlay */}
           {recording && (
             <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full text-white text-sm font-medium animate-pulse">
               <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
               Recording
             </div>
           )}
        </div>
        
        {!videoBlob ? (
          <div className="flex justify-center">
            {!recording ? (
              <button 
                type="button" 
                onClick={startRecording}
                disabled={!stream}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 shadow-lg shadow-red-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 transition-all flex items-center gap-2"
              >
                <span className="text-xl">🔴</span> Start Recording (10s Max)
              </button>
            ) : (
              <button 
                type="button" 
                onClick={stopRecording}
                className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all flex items-center gap-2"
              >
                <span className="text-xl">⏹</span> Stop Recording Early
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <button 
              type="button" 
              onClick={() => setVideoBlob(null)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-bold underline"
            >
              🔄 Retake Video
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 pt-6 border-t dark:border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={!videoBlob || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-300 flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Uploading securely...</>
          ) : 'Complete Verification'}
        </button>
        <p className="text-xs text-center text-gray-500 mt-4">
          Your video is entirely secure and will only be used by automated systems or admins for verification.
        </p>
      </div>
    </div>
  );
}
