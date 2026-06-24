"use client";

import { useEffect, useRef } from "react";

const getWistiaId = (url) => {
  const match = url?.match(
    /(?:wistia\.com\/(?:medias|s)\/|wistia\.net\/medias\/)([a-zA-Z0-9]+)/,
  );
  return match?.[1] ?? null;
};

const isIOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream;

const WistiaPlayer = ({ wistiaUrl, previewSrc, posterSrc }) => {
  const scriptLoaded = useRef(false);
  const playerRef = useRef(null);
  const previewVideoRef = useRef(null);
  const hasEnteredFullscreen = useRef(false);

  const videoId = getWistiaId(wistiaUrl);

  useEffect(() => {
    if (!isIOS) return;

    const video = previewVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [previewSrc]);

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

  const setPlayerInteractive = (interactive) => {
    const player = playerRef.current;
    if (!player) return;
    player.style.pointerEvents = interactive ? "auto" : "none";
    player.style.zIndex = interactive ? "9999" : "-1";
    player.removeAttribute("aria-hidden");
    if (!interactive) player.setAttribute("aria-hidden", "true");
  };

  // Shared resume logic — called from both fullscreenchange and
  // webkitendfullscreen so either path reliably restores the preview
  const resumePreview = () => {
    const player = playerRef.current;
    const previewVideo = previewVideoRef.current;

    setPlayerInteractive(false);

    player?.pause?.();
    if (player) {
      player.muted = true;
      player.currentTime = 0;
    }

    hasEnteredFullscreen.current = false;

    if (isIOS && previewVideo) {
      previewVideo.muted = true;
      previewVideo.play().catch(() => {});
    } else {
      previewVideo?.play?.().catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        resumePreview();
      } else {
        setPlayerInteractive(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
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
        // iOS Safari path
        const innerVideo =
          player.shadowRoot?.querySelector("video") ??
          player.querySelector?.("video");
        if (innerVideo?.webkitEnterFullscreen) {
          setPlayerInteractive(true);

          // webkitendfullscreen fires on the inner <video> element directly
          // on iOS — more reliable than document fullscreenchange for this path
          innerVideo.addEventListener("webkitendfullscreen", resumePreview, {
            once: true,
          });

          innerVideo.webkitEnterFullscreen();
        }
      }

      player.muted = false;
      await player.play?.();
    } catch (error) {
      console.error("Wistia fullscreen error:", error);
      setPlayerInteractive(false);

      if (isIOS && previewVideo) {
        previewVideo.muted = true;
        previewVideo.play().catch(() => {});
      } else {
        previewVideo?.play?.().catch(() => {});
      }
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
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-[#FF6A50]/50 from-0% to-transparent to-100%" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white tracking-wide text-sm font-medium drop-shadow-md">
            <span>Watch Event Recap</span>
            <div className="bg-[#3ED4F5] rounded-full p-2.5 shadow-lg shadow-[#3ED4F5]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="ml-0.5"
              >
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
