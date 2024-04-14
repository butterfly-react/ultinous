'use client'
import React, { useState, useRef, useEffect } from "react";
import { VIDEO_PATHS, JSON_PATHS } from "./constants";
import { currentUser } from "@clerk/nextjs";
import VideoWithOverlay from "@/components/video-withoverly";
import { convertData, convertData2 } from "./JsonConverter";
import VideoWithOverlay2 from "@/components/video-withoverlay2";

interface Detection {
  timestamp: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "PERSON" | "CAR";
}

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<"test1" | "test2">("test1"); 
  const [control, setControl] = useState(true)

  useEffect(() => {
      const jsonPath = JSON_PATHS[selectedVideo];
      const video = videoRef.current;
      fetch(jsonPath)
        .then((response) => response.json())
        .then((data) => {
          const detections: Detection[] = [];
  
          for (const timestamp in data) {
            if (data.hasOwnProperty(timestamp)) {
              const timestampDetections = data[timestamp];
              for (const jsonDetection of timestampDetections) {
                const detection: Detection = {
                  timestamp: timestamp,
                  x: jsonDetection.x,
                  y: jsonDetection.y,
                  w: jsonDetection.w,
                  h: jsonDetection.h,
                  type: jsonDetection.class as "PERSON" | "CAR",
                };
                detections.push(detection);
              }
            }
          }
  
          setDetections(detections);
        });
          
        if (!video) return;

        video.src = VIDEO_PATHS[selectedVideo];
    
}, [selectedVideo]);

  const handleVideoChange = (video: "test1" | "test2") => {
      setIsPlaying(false)
      setSelectedVideo(video);
    };

    const handleTimeChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const newTime = (e.target as HTMLVideoElement).currentTime;
        setCurrentTime(newTime);
      };

      if(detections){
        console.log(detections)
      }

 
    return (
    <div className="bg-gray-100 p-4">
      <div className="flex flex-col space-x-4 mb-5">
        <div className='ml-4 mb-4 flex gap-4'>

        <button
          className={`${
              selectedVideo === "test1" ? "bg-blue-500 text-white" : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleVideoChange("test1")}
        >
          Videó 1
        </button>
        <button
          className={`${
            selectedVideo === "test2" ? "bg-blue-500 text-white" : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleVideoChange("test2")}
        >
          Videó 2
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded`}
          onClick={() => setControl(!control)}
        >
          Control
        </button>
        </div>
        <div className='w-3/5 max-w-screen-lg'>
        { selectedVideo === 'test1' ? <VideoWithOverlay videoSrc="test_1.mp4" convert={convertData} control={control} /> : <VideoWithOverlay2 videoSrc="test_2.mp4" convert={convertData2} control={control}/>}

        </div>

    
      </div>
     
    </div>
  );
};

export default VideoPlayer;
