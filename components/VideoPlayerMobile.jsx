"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      muteEmbedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`,
    };
  }

  return { type: "direct", src: url };
}

function getIsIOS() {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|ad|od)/i.test(navigator.userAgent);
}

// ─── Flash Icon ───────────────────────────────────────────────────────────────

function FlashIcon({ icon }) {
  if (icon === "play") return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="white">
      <path d="M5 3.5l12 6.5-12 6.5V3.5z" />
    </svg>
  );
  if (icon === "pause") return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="white">
      <rect x="4" y="3" width="4" height="14" rx="1" />
      <rect x="12" y="3" width="4" height="14" rx="1" />
    </svg>
  );
  if (icon === "rewind") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
      <text x="12" y="14" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">5</text>
    </svg>
  );
  if (icon === "forward") return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
      <text x="12" y="14" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">5</text>
    </svg>
  );
  return null;
}

// ─── Mobile Modal ─────────────────────────────────────────────────────────────
// Separate from the desktop modal — handles iOS native controls vs Android custom controls

function MobileVideoModal({ item, onClose }) {
  const videoRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const flashTimer = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [flashIcon, setFlashIcon] = useState(null);
  const [isIOS] = useState(getIsIOS);

  const resolved = resolveVideoSrc(item?.video_link);
  const isDirect = resolved?.type === "direct";

  // Escape key + scroll lock
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCloseRef.current(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, []);

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

  const triggerFlash = useCallback((icon) => {
    setFlashIcon(icon);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashIcon(null), 600);
  }, []);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play(); triggerFlash("play"); }
    else { vid.pause(); triggerFlash("pause"); }
    resetHideTimer();
  }, [triggerFlash, resetHideTimer]);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  }, []);

  const skip = useCallback((seconds) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Math.min(Math.max(vid.currentTime + seconds, 0), vid.duration || 0);
    triggerFlash(seconds > 0 ? "forward" : "rewind");
    resetHideTimer();
  }, [triggerFlash, resetHideTimer]);

  const handleSeek = useCallback((e) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Number(e.target.value);
    setCurrentTime(vid.currentTime);
  }, []);

  const fmt = (s) => {
    if (!isFinite(s)) return "00:00";
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-650 flex items-center justify-center  bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 bg-[#0E1618] hover:text-white transition-colors text-sm w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 z-10"
        aria-label="Close video"
      >
        ✕
      </button>

      {/* Modal container */}
      <div
        className="relative w-full mx-4 rounded-lg overflow-hidden bg-[#1a1a1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={isDirect && !isIOS ? resetHideTimer : undefined}
      >
        <div
          className="relative bg-black aspect-video"
          onClick={isDirect && !isIOS ? togglePlay : undefined}
          style={{ cursor: isDirect && !isIOS ? "pointer" : "default" }}
        >
          {/* YouTube / Vimeo embed */}
          {(resolved?.type === "youtube" || resolved?.type === "vimeo") && (
            <iframe
              src={resolved.embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Speaker video"
            />
          )}

          {/* Direct video
              iOS  → native controls (handles fullscreen, scrubbing natively)
              Android → no native controls, we render our own below */}
          {resolved?.type === "direct" && (
            <video
              ref={videoRef}
              src={resolved.src}
              className="w-full h-full object-cover"
              playsInline
              controls={isIOS}
            />
          )}

          {resolved?.type !== "youtube" &&
           resolved?.type !== "vimeo" &&
           resolved?.type !== "direct" && (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
              No video source available
            </div>
          )}

          {/* ── Android custom controls (not shown on iOS) ── */}
          {isDirect && !isIOS && (
            <>
              {/* Flash icon feedback */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: flashIcon ? 1 : 0,
                  transition: flashIcon ? "opacity 0ms" : "opacity 400ms ease",
                }}
              >
                <div className="w-16 h-16 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <FlashIcon icon={flashIcon} />
                </div>
              </div>

              {/* Controls overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none"
                style={{
                  opacity: showControls ? 1 : 0,
                  transition: "opacity 300ms ease",
                }}
              >
                {/* Center row: rewind | play-pause | forward */}
                <div
                  className="flex items-center gap-8 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Rewind 5s */}
                  <button
                    onClick={() => skip(-5)}
                    aria-label="Rewind 5 seconds"
                    className="flex flex-col items-center gap-1 text-white/80 active:scale-90 transition-transform"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    <span className="text-white text-[10px] font-medium -mt-1">5s</span>
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={togglePlay}
                    aria-label={playing ? "Pause" : "Play"}
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
                  >
                    {playing ? (
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
                        <rect x="4" y="3" width="4" height="14" rx="1" />
                        <rect x="12" y="3" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
                        <path d="M5 3.5l12 6.5-12 6.5V3.5z" />
                      </svg>
                    )}
                  </button>

                  {/* Forward 5s */}
                  <button
                    onClick={() => skip(5)}
                    aria-label="Forward 5 seconds"
                    className="flex flex-col items-center gap-1 text-white/80 active:scale-90 transition-transform"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                    </svg>
                    <span className="text-white text-[10px] font-medium -mt-1">5s</span>
                  </button>
                </div>

                {/* Bottom: seek + mute */}
                <div
                  className="absolute bottom-4 left-4 right-4 flex items-center gap-3 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-white text-xs tabular-nums shrink-0">
                    {fmt(currentTime)}
                    <span className="text-white/40 mx-1">/</span>
                    {fmt(duration)}
                  </span>

                  <div className="relative flex-1 h-1" style={{ cursor: "pointer" }}>
                    <div className="absolute inset-0 rounded-full bg-white/20" />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      style={{ width: `${progress}%` }}
                    />
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

                  <button
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="text-white shrink-0"
                  >
                    {muted ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 3.17-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Single Card ─────────────────────────────────────────────────────────────

function MobileVideoCard({ item, isActive, onOpenModal }) {
  const resolved = resolveVideoSrc(item?.video_link);

  return (
    <div
      className="relative shrink-0 w-[75vw]  max-w-90 md:max-w-120 select-none rounded-xl overflow-hidden cursor-pointer"
     
      onClick={() => isActive && onOpenModal(item)}
    >
      <div className="relative h-80 md:h-100">
        {/* Active: muted autoplay video */}
        {isActive && (
          <>
            {resolved?.type === "direct" && (
              <video
                src={resolved.src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            )}
            {(resolved?.type === "youtube" || resolved?.type === "vimeo") && (
              <iframe
                src={resolved.muteEmbedUrl}
                className="absolute inset-0 w-full h-full pointer-events-none scale-110"
                allow="autoplay"
                title="Active video preview"
                tabIndex={-1}
              />
            )}
          </>
        )}

        {/* Inactive: static thumbnail */}
        {!isActive && item?.thumbnail_image && (
          <PrismicNextImage
            field={item.thumbnail_image}
            fill
            className="object-cover object-top"
            sizes="75vw"
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Play button */}
        <div className="absolute bottom-21 left-6 -translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36.0005 72.0009C16.118 72.0009 0 55.8831 0 36.0005C0 16.118 16.118 0 36.0005 0C55.8831 0 72.0009 16.118 72.0009 36.0005C72.0009 55.8831 55.8831 72.0009 36.0005 72.0009ZM50.4509 40.0256C51.3218 39.59 52.028 38.8838 52.4632 38.013C53.575 35.79 52.6737 33.087 50.4509 31.9755L29.0128 21.2565C28.388 20.9441 27.699 20.7814 27.0004 20.7814C24.515 20.7814 22.5003 22.7962 22.5003 25.2815V46.7196C22.5003 47.4181 22.6629 48.1071 22.9754 48.7319C24.0868 50.955 26.7899 51.8559 29.0128 50.7445L50.4509 40.0256Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        {/* Bottom info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          }}
        >
          {item?.name_of_person && (
            <div className="text-white text-lg font-semibold leading-tight [&_p]:m-0">
              <PrismicRichText field={item.name_of_person} />
            </div>
          )}
          {item?.role_of_person_company && (
            <div className="text-white/60 text-sm leading-tight [&_p]:m-0">
              <PrismicRichText field={item.role_of_person_company} />
            </div>
          )}
          {item?.company_logo && (
            <div className="mt-2">
              <PrismicNextImage
                field={item.company_logo}
                className="h-5 w-auto object-contain brightness-0 invert opacity-80"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root Mobile Component ────────────────────────────────────────────────────

export default function VideoPlayerMobile({ items, onOpenModal }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: false,
    dragFree: false,
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [modalItem, setModalItem] = useState(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Open our own mobile modal instead of the desktop one
  const handleOpenModal = useCallback((item) => {
    setModalItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalItem(null);
  }, []);

  if (!items?.length) return null;

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 pl-4">
            {items.map((item, index) => (
              <MobileVideoCard
                key={index}
                item={item}
                isActive={index === selectedIndex}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        </div>

        {/* Dots + arrows */}
        <div className="flex items-center gap-4 pl-4">
          <button
            onClick={scrollPrev}
            disabled={selectedIndex === 0}
            className="w-9 h-9 rounded-full  bg-[#1D1E27]  flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors disabled:opacity-30"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="transition-all duration-300"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: index === selectedIndex ? "#FF6A50" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            disabled={selectedIndex === scrollSnaps.length - 1}
            className="w-9 h-9 rounded-full bg-[#1D1E27] flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors disabled:opacity-30"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile-only modal with iOS/Android split */}
      {modalItem && (
        <MobileVideoModal item={modalItem} onClose={handleCloseModal} />
      )}
    </>
  );
}