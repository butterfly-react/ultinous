//@ts-nocheck
'use client'
import React, { useRef, useEffect } from 'react';

const VideoWithOverlay = ({ videoSrc, convert, control }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const objectData = convert()
  
  
    useEffect(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
  
      const drawOverlay = () => {
        const currentTime = video.currentTime.toFixed(1); // Kerekítés egy tized másodpercre
        const currentData = objectData[currentTime]; // Az aktuális időbélyeghez tartozó adatok
  
        if (currentData && !video.paused && !video.ended) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
  
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
          currentData.forEach(obj => {
            ctx.strokeStyle = obj.class === 'PERSON' ? 'red' : 'yellow';
            ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
          });
        }
  
        requestAnimationFrame(drawOverlay);
      };
  
      video.addEventListener('play', drawOverlay);
      video.addEventListener('timeupdate', drawOverlay);
  
      return () => {
        video.removeEventListener('play', drawOverlay);
        video.removeEventListener('timeupdate', drawOverlay);
      };
    }, [objectData]);
  
    return (
        <div style={{ position: 'relative', width: '60vw', height: '60vh' }}>
        <video 
          ref={videoRef} 
          src={"test_1.mp4"} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }} 
          autoPlay
          controls={control}
        />
        <canvas 
          ref={canvasRef} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} 
        />
      </div>
    );
  };

  export default VideoWithOverlay