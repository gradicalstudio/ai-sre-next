"use client";

import { useEffect, useRef } from "react";

const getWistiaId = (url) => {
  const match = url?.match(
    /(?:wistia\.com\/(?:medias|s)\/|wistia\.net\/medias\/)([a-zA-Z0-9]+)/,
  );
  return match?.[1] ?? null;
};

const WistiaPlayer = ({ wistiaUrl, previewSrc, posterSrc }) => {
  const scriptLoaded = useRef(false);
  const playerRef = useRef(null);
  const previewVideoRef = useRef(null);
  const hasEnteredFullscreen = useRef(false);

  const videoId = getWistiaId(wistiaUrl);

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

  // Helper to enable/disable interactivity on the Wistia player
  const setPlayerInteractive = (interactive) => {
    const player = playerRef.current;
    if (!player) return;
    player.style.pointerEvents = interactive ? "auto" : "none";
    player.style.zIndex = interactive ? "9999" : "-1";
    player.removeAttribute("aria-hidden");
    if (!interactive) player.setAttribute("aria-hidden", "true");
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const player = playerRef.current;
      const previewVideo = previewVideoRef.current;

      if (!document.fullscreenElement) {
        // Exited fullscreen — lock the player back down
        setPlayerInteractive(false);

        player?.pause?.();
        if (player) {
          player.muted = true;
          player.currentTime = 0;
        }

        hasEnteredFullscreen.current = false;
        previewVideo?.play?.().catch(() => {});
      } else {
        // Entered fullscreen — unlock so Wistia touch handlers work
        setPlayerInteractive(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleClick = async () => {
    const player = playerRef.current;
    const previewVideo = previewVideoRef.current;

    if (!player) return;
    if (document.fullscreenElement) return;

    try {
      previewVideo?.pause?.();
      player.currentTime = 0;
      hasEnteredFullscreen.current = true;

      if (player.requestFullscreen) {
        await player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        await player.webkitRequestFullscreen();
      } else {
        // iOS Safari — reach into the shadow DOM for the native <video>
        const innerVideo =
          player.shadowRoot?.querySelector("video") ??
          player.querySelector?.("video");
        if (innerVideo?.webkitEnterFullscreen) {
          // For iOS, enable interactivity now since fullscreenchange
          // may not fire reliably for webkitEnterFullscreen
          setPlayerInteractive(true);
          innerVideo.webkitEnterFullscreen();
        }
      }

      player.muted = false;
      await player.play?.();
    } catch (error) {
      console.error("Wistia fullscreen error:", error);
      setPlayerInteractive(false);
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

      <wistia-player
        ref={playerRef}
        media-id={videoId}
        muted
        seo="false"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "100%",
          height: "100%",
          pointerEvents: "none", // re-enabled dynamically on fullscreen enter
          zIndex: -1,
        }}
      />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-[#FF6A50]/50 from-0% to-transparent to-100%" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white tracking-wide text-sm font-medium drop-shadow-md">
            <span>Watch Event Recap</span>
            <div className="bg-[#3ED4F5] rounded-full p-2.5 shadow-lg shadow-[#3ED4F5]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-0.5">
                <path d="M3 2L10 6L3 10V2Z" fill="#04050F" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WistiaPlayer;