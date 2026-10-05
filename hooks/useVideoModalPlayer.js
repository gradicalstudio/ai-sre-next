"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared playback/controls state for the desktop and mobile video modals:
 * escape-to-close + scroll lock, native video event sync, auto-hiding
 * controls, play/pause/mute/seek/skip, and tap-feedback flash icons.
 */
export function useVideoModalPlayer({ onClose, isDirect }) {
  const videoRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const flashTimer = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [flashIcon, setFlashIcon] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setCurrentTime(vid.currentTime);
    const onLoadedMeta = () => {
      setDuration(vid.duration);
      vid.play().catch(() => {});
    };
    vid.addEventListener("play", onPlay);
    vid.addEventListener("pause", onPause);
    vid.addEventListener("timeupdate", onTimeUpdate);
    vid.addEventListener("loadedmetadata", onLoadedMeta);
    return () => {
      vid.removeEventListener("play", onPlay);
      vid.removeEventListener("pause", onPause);
      vid.removeEventListener("timeupdate", onTimeUpdate);
      vid.removeEventListener("loadedmetadata", onLoadedMeta);
    };
  }, [isDirect]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    // showControls already starts true; just arm the auto-hide timer.
    hideControlsTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 3000);
    return () => clearTimeout(hideControlsTimer.current);
  }, []);

  const triggerFlash = useCallback((icon) => {
    setFlashIcon(icon);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashIcon(null), 600);
  }, []);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      triggerFlash("play");
    } else {
      vid.pause();
      triggerFlash("pause");
    }
    resetHideTimer();
  }, [triggerFlash, resetHideTimer]);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  }, []);

  const skip = useCallback(
    (seconds) => {
      const vid = videoRef.current;
      if (!vid) return;
      vid.currentTime = Math.min(
        Math.max(vid.currentTime + seconds, 0),
        vid.duration || 0,
      );
      triggerFlash(seconds > 0 ? "forward" : "rewind");
      resetHideTimer();
    },
    [triggerFlash, resetHideTimer],
  );

  const handleSeek = useCallback((e) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Number(e.target.value);
    setCurrentTime(vid.currentTime);
  }, []);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return {
    videoRef,
    playing,
    muted,
    currentTime,
    duration,
    showControls,
    flashIcon,
    progress,
    resetHideTimer,
    togglePlay,
    toggleMute,
    skip,
    handleSeek,
  };
}
