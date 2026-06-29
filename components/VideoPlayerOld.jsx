"use client";

import { useRef, useState, useEffect } from "react";

export default function VideoPlayerOld({
  src = "/videos/AI SRE Next Highlights.mp4",
}) {
  const videoRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const visibilityTimerRef = useRef(null);

  // Note: We leave browser video element defaulted to muted, but control state toggles
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const resetVisibilityTimer = () => {
    setControlsVisible(true);
    if (visibilityTimerRef.current) clearTimeout(visibilityTimerRef.current);

    if (videoRef.current && !videoRef.current.paused) {
      visibilityTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2000);
    }
  };

  useEffect(() => {
    resetVisibilityTimer();

    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Autoplay silently after 5s (safe from browser blocks)
    autoplayTimerRef.current = setTimeout(() => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current
          .play()
          .catch((err) => console.log("Autoplay blocked:", err));
        setIsPlaying(true);
        resetVisibilityTimer();
      }
    }, 5000);

    return () => {
      clearTimeout(autoplayTimerRef.current);
      clearTimeout(visibilityTimerRef.current);
    };
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuteState = !isMuted;
      videoRef.current.muted = nextMuteState;
      setIsMuted(nextMuteState);
      resetVisibilityTimer();
    }
  };

  const togglePlay = () => {
    clearTimeout(autoplayTimerRef.current);

    if (videoRef.current) {
      if (videoRef.current.paused) {
        // CRITICAL FIX: Since the user explicitly clicked the video to play it,
        // we can now safely unmute the audio without the browser blocking it.
        videoRef.current.muted = false;
        setIsMuted(false);

        videoRef.current.play();
        setIsPlaying(true);
        resetVisibilityTimer();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setControlsVisible(true);
        if (visibilityTimerRef.current)
          clearTimeout(visibilityTimerRef.current);
      }
    }
  };

  const handleMouseMove = () => {
    resetVisibilityTimer();
  };

  const handleMouseLeave = () => {
    if (visibilityTimerRef.current) clearTimeout(visibilityTimerRef.current);
    if (isPlaying) {
      setControlsVisible(false);
    }
  };

  return (
    <div
      className="group relative w-full aspect-video cursor-pointer overflow-hidden rounded-2xl bg-black"
      onClick={togglePlay}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video - Must render with 'muted' attribute initially for browser bypass */}
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className="w-full h-full object-contain"
      />

      {/* Overlay */}
      <div
        className={`
          absolute inset-0 transition-all duration-500 pointer-events-none
          ${isPlaying ? "bg-black/10" : "bg-black/20"}
        `}
      />

      {/* Center Button */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${controlsVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="relative">
          {/* Moving Border */}
          {!isPlaying && (
            <div className="absolute inset-0 rounded-full p-0.5 overflow-hidden">
              <div className="absolute inset-0 rounded-full border border-[#3FD9FB]/20" />
              <div className="absolute inset-0 rounded-full animate-[spin_5s_linear_forwards]">
                <div className="absolute top-0 left-0 h-full w-14 bg-[#3FD9FB] blur-[10px]" />
              </div>
            </div>
          )}

          {/* White Button */}
          <div
            className="
              relative z-10
              flex items-center gap-3
              px-6 py-3
              rounded-full
              bg-white
              text-black
              border border-white/60
              shadow-[0_10px_40px_rgba(0,0,0,0.35)]
              transition-all duration-300
              hover:scale-105
            "
          >
            <div className="flex items-center justify-center">
              {isPlaying ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>

            <span className="text-sm lg:text-base font-semibold tracking-wide">
              {isPlaying ? "Pause Video" : "Watch Video"}
            </span>
          </div>
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className={`
          absolute bottom-3 right-3
          p-2 lg:p-3
          rounded-full
          bg-black/40
          backdrop-blur-md
          border border-white/10
          text-white
          transition-all duration-500 ease-in-out
          hover:scale-110
          ${controlsVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        {isMuted ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </div>
  );
}
