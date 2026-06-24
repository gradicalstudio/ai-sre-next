"use client";

import { useEffect, useRef } from "react";

const getWistiaId = (url) => {
  const match = url?.match(
    /(?:wistia\.com\/(?:medias|s)\/|wistia\.net\/medias\/)([a-zA-Z0-9]+)/,
  );

  return match?.[1] ?? null;
};

/**
 * Renders a muted, looping <video> preview (your own mp4) layered with a
 * custom hover overlay. The real <wistia-player> is pre-mounted but kept
 * fully hidden/inert until the user clicks — at which point we unmute,
 * play, and request fullscreen on it. Because the Wistia player is never
 * visible at rest, its native hover controls never have a chance to show.
 */
const WistiaPlayer = ({ wistiaUrl, previewSrc, posterSrc }) => {
  const scriptLoaded = useRef(false);
  const playerRef = useRef(null);
  const previewVideoRef = useRef(null);
  const hasEnteredFullscreen = useRef(false);

  const videoId = getWistiaId(wistiaUrl);

  // Load wistia scripts immediately so the player is fully upgraded and
  // ready to go the instant the user clicks (no load delay at click time).
  useEffect(() => {
    if (!videoId || scriptLoaded.current) return;

    scriptLoaded.current = true;

    const script1 = document.createElement("script");
    script1.src = "https://fast.wistia.com/player.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = `https://fast.wistia.com/embed/${videoId}.js`;
    script2.async = true;
    script2.type = "module";

    document.body.appendChild(script1);
    document.body.appendChild(script2);
  }, [videoId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const player = playerRef.current;
      const previewVideo = previewVideoRef.current;

      if (!document.fullscreenElement) {
        // User exited fullscreen (Esc, swipe, browser chrome, or our own
        // double-click handler) — reset Wistia player back to its
        // hidden/inert resting state and resume the preview loop.
        player?.pause?.();

        if (player) {
          player.muted = true;
          player.currentTime = 0;
        }

        hasEnteredFullscreen.current = false;

        previewVideo?.play?.().catch(() => {
          // Autoplay can occasionally be blocked on resume; not critical.
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleClick = async () => {
    const player = playerRef.current;
    const previewVideo = previewVideoRef.current;

    if (!player) return;
    if (document.fullscreenElement) return;

    try {
      previewVideo?.pause?.();

      player.muted = false;
      hasEnteredFullscreen.current = true;
      player.currentTime = 0; // always restart the recap from the beginning

      await player.requestFullscreen?.();
      await player.play?.();
    } catch (error) {
      console.error("Wistia fullscreen error:", error);

      // If fullscreen/play failed, go back to showing the preview rather
      // than leaving the user looking at a frozen hidden element.
      previewVideo?.play?.().catch(() => {});
    }
  };

  const handleDoubleClick = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  if (!videoId) return null;

  return (
    <div
      className="relative group cursor-pointer overflow-hidden"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ aspectRatio: "16/9" }}
    >
      {/* Preview layer: plain, inert video — no Wistia UI can ever attach
          to this, so hover is 100% controlled by us. */}
      <video
        ref={previewVideoRef}
        src={previewSrc}
        poster={posterSrc}
        muted
        autoPlay
        loop
        playsInline
        controls={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Wistia player: pre-mounted so it's fully upgraded and ready, but
          fully hidden and non-interactive until fullscreen is requested
          on click. Sits behind the preview and is never shown at rest. */}
      <wistia-player
        ref={playerRef}
        media-id={videoId}
        muted
        controls-visible-on-load="false"
        seo="false"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2 text-white tracking-wide text-sm">
          <span>Watch Event Recap</span>

          <div className="bg-[#3ED4F5] rounded-full p-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2L10 6L3 10V2Z" fill="#04050F" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WistiaPlayer;