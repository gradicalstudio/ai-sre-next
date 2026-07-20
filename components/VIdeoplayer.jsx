"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import VideoPlayerMobile from "./VideoPlayerMobile";

// ─── Helpers ────────────────────────────────────────────────────────────────

function resolveVideoSrc(linkField) {
  if (!linkField) return null;
  const url = linkField.url || linkField;
  if (!url || typeof url !== "string") return null;

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (ytMatch) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0`,
      muteEmbedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&rel=0&controls=0&modestbranding=1`,
    };
  }

  const wistiaMatch = url.match(/wistia\.(?:com|net)\/(?:medias|embed\/iframe)\/([a-zA-Z0-9]+)/);
  if (wistiaMatch) {
    return {
      type: "wistia",
      embedUrl: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}?autoPlay=true`,
      muteEmbedUrl: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}?autoPlay=true&muted=true&loop=true&silentAutoPlay=true`,
    };
  }

  return { type: "direct", src: url };
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function VideoModal({ item, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const flashTimer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [flashIcon, setFlashIcon] = useState(false); // center play/pause flash

  const resolved = resolveVideoSrc(item?.video_link);
  const isDirect = resolved?.type === "direct";

  // Escape key + scroll lock

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Video event sync

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

  // Auto-hide controls
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
    resetHideTimer();
    return () => clearTimeout(hideControlsTimer.current);
  }, [resetHideTimer]);

  const triggerFlash = () => {
    setFlashIcon(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashIcon(false), 600);
  };

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.paused ? vid.play() : vid.pause();
    triggerFlash();
    resetHideTimer();
  }, [resetHideTimer]);

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  const handleSeek = (e) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Number(e.target.value);
    setCurrentTime(vid.currentTime);
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  const fmt = (s) => {
    if (!isFinite(s)) return "00:00";
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-650 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="text-white/60 p-4 bg-[#0E1618] absolute lg:top-15 lg:right-14 xl:top-10 xl:right-35 2xl:top-15 2xl:right-20 hover:text-white transition-colors text-sm w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
        aria-label="Close video"
      >
        ✕
      </button>

      {/* Modal container */}
      <div
        ref={containerRef}
        className="relative w-full lg:max-w-3xl xl:max-w-220 2xl:max-w-250 4xl:max-w-345 mx-4 rounded-lg overflow-hidden bg-[#1a1a1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={isDirect ? resetHideTimer : undefined}
      >
        {/* Video / embed */}
        <div
          className="relative bg-black aspect-video"
          onClick={isDirect ? togglePlay : undefined}
          style={{ cursor: isDirect ? "pointer" : "default" }}
        >
          {resolved?.type === "youtube" || resolved?.type === "wistia" ? (
            <iframe
              src={resolved.embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Speaker video"
            />
          ) : resolved?.type === "direct" ? (
            <video
              ref={videoRef}
              src={resolved.src}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
              No video source available
            </div>
          )}

          {/* Center flash icon (play/pause tap feedback) */}
          {isDirect && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                opacity: flashIcon ? 1 : 0,
                transition: flashIcon ? "opacity 0ms" : "opacity 400ms ease",
              }}
            >
              <div className="w-16 h-16 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                {playing ? (
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="white">
                    <rect x="4" y="3" width="4" height="14" rx="1" />
                    <rect x="12" y="3" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="white">
                    <path d="M5 3.5l12 6.5-12 6.5V3.5z" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Bottom controls overlay */}
          {isDirect && (
            <div
              className="absolute w-full bottom-2 left-0 right-0 px-4 pt-8 pb-4 flex  gap-3"
              style={{
                opacity: showControls ? 1 : 0,
                transition: "opacity 300ms ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Controls row */}
              <div className="flex flex-row w-full   items-center gap-4">
                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  className="text-white hover:text-white/70 transition-colors"
                >
                  {playing ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <rect x="4" y="3" width="4" height="14" rx="1" />
                      <rect x="12" y="3" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 3.5l12 6.5-12 6.5V3.5z" />
                    </svg>
                  )}
                </button>

                {/* Timestamp */}
                <span className="text-white text-xs tabular-nums tracking-wide">
                  {fmt(currentTime)}
                  <span className="text-white/40 mx-1">/</span>
                  {fmt(duration)}
                </span>

                {/* Seek bar */}
                <div
                  className="relative w-full h-1 group/seek"
                  style={{ cursor: "pointer" }}
                >
                  {/* Track background */}
                  <div className="absolute inset-0 rounded-full bg-white/20" />
                  {/* Buffered / progress fill */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Native range */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    style={{ height: "100%" }}
                    aria-label="Seek"
                  />
                </div>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="text-white hover:text-white/70 transition-colors"
                >
                  {muted ? (
                    // Muted 
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M16.5 12A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 3.17-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    // Unmuted
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  aria-label="Toggle fullscreen"
                  className="text-white hover:text-white/70 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VIDEO CARD

function VideoCard({ item, isActive, onActivate, onOpenModal }) {
  const resolved = resolveVideoSrc(item?.video_link);
  const videoRef = useRef(null);

  return (
    <div
      className="relative cursor-pointer  w-full overflow-hidden rounded-lg min-w-0 group"
      style={{
        flexBasis: isActive ? "70%" : "15%",
        flexShrink: 1,
        flexGrow: 0,
        transition: "flex-basis 200ms cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
      onClick={isActive ? onOpenModal : onActivate}
    >
      {/* Active — inline muted video */}
      {isActive && (
        <>
          {resolved?.type === "direct" ? (
            <video
              ref={videoRef}
              src={resolved.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : resolved?.type === "youtube" ? (
            <iframe
              src={resolved.muteEmbedUrl}
              className="absolute inset-0 w-full h-full pointer-events-none scale-110"
              allow="autoplay"
              title="Active video"
              tabIndex={-1}
            />
          ) : resolved?.type === "wistia" ? (
            <iframe
              src={resolved.muteEmbedUrl}
              className="absolute inset-0 w-full h-full pointer-events-none scale-110"
              allow="autoplay"
              title="Active video"
              tabIndex={-1}
            />
          ) : null}
        </>
      )}

      {/* Inactive — thumbnail image */}
      {!isActive && item?.thumbnail_image && (
        <PrismicNextImage
          field={item.thumbnail_image}
          fill
          className="object-cover object-center grayscale group-hover:grayscale-0 transition-all opacity duration-100 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-100 " />

      {/* Active — play button + name / role / logo */}
      {isActive && (
        <>
          <button
            className="absolute lg:bottom-20 lg:left-8  2xl:bottom-30 2xl:left-15 lg:w-10 lg:h-10 2xl:w-14 2xl:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm  flex items-center justify-center transition-all duration-100 hover:scale-105"
            aria-label="Play video with audio"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
          >
            <svg
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full "
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36.0005 72.0009C16.118 72.0009 0 55.8831 0 36.0005C0 16.118 16.118 0 36.0005 0C55.8831 0 72.0009 16.118 72.0009 36.0005C72.0009 55.8831 55.8831 72.0009 36.0005 72.0009ZM50.4509 40.0256C51.3218 39.59 52.028 38.8838 52.4632 38.013C53.575 35.79 52.6737 33.087 50.4509 31.9755L29.0128 21.2565C28.388 20.9441 27.699 20.7814 27.0004 20.7814C24.515 20.7814 22.5003 22.7962 22.5003 25.2815V46.7196C22.5003 47.4181 22.6629 48.1071 22.9754 48.7319C24.0868 50.955 26.7899 51.8559 29.0128 50.7445L50.4509 40.0256Z"
                fill="white"
              />
            </svg>
          </button>

          <div className="absolute lg:bottom-6 lg:left-6 2xl:bottom-8 2xl:left-16 right-4 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              {item?.name_of_person && (
                <div className="text-white lg:text-base 2xl:text-xl font-semibold leading-tight [&_p]:m-0">
                  <PrismicRichText field={item.name_of_person} />
                </div>
              )}
              {item?.role_of_person_company && (
                <div className="text-white/50 lg:text-sm 2xl:text-base leading-tight [&_p]:m-0">
                  <PrismicRichText field={item.role_of_person_company} />
                </div>
              )}
            </div>
            {item?.company_logo && (
              <div className="shrink-0">
                <PrismicNextImage
                  field={item.company_logo}
                  className="lg:h-4 2xl:h-7 w-auto object-contain brightness-0 invert opacity-80"
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Inactive — thumbnail logo */}
      {item?.thumbnail_logo && (
        <div
          className={`absolute bottom-6 left-0 right-0 flex justify-center transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            isActive
              ? "opacity-0 translate-y-20 pointer-events-none"
              : "opacity-70 translate-y-0"
          }`}
        >
          {item?.thumbnail_logo && (
            <PrismicNextImage
              field={item.thumbnail_logo}
              className="m-0 h-6 w-auto object-contain brightness-0 invert"
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── VideoPlayer (root client component) ─────────────────────────────────────

export default function VideoPlayer({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalItem, setModalItem] = useState(null);

  const openModal = useCallback((item) => setModalItem(item), []);
  const closeModal = useCallback(() => setModalItem(null), []);

  if (!items?.length) return null;

  return (
    <>
      <div className="hidden lg:flex lg:min-h-80 xl:min-h-130 2xl:min-h-120  gap-2 w-full overflow-hidden">
        {items.map((item, index) => (
          <VideoCard
            key={index}
            item={item}
            isActive={index === activeIndex}
            onActivate={() => setActiveIndex(index)}
            onOpenModal={() => openModal(item)}
          />
        ))}
      </div>
      {/* Mobile Video Player */}
      <div className="lg:hidden">
        <VideoPlayerMobile items={items} onOpenModal={openModal} />
      </div>

      {modalItem && <VideoModal item={modalItem} onClose={closeModal} />}
    </>
  );
}
