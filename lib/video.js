export function resolveVideoSrc(linkField) {
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

  const wistiaMatch = url.match(
    /wistia\.(?:com|net)\/(?:medias|embed\/iframe)\/([a-zA-Z0-9]+)/,
  );
  if (wistiaMatch) {
    return {
      type: "wistia",
      embedUrl: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}?autoPlay=true`,
      muteEmbedUrl: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}?autoPlay=true&muted=true&loop=true&silentAutoPlay=true`,
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

export function formatTime(s) {
  if (!isFinite(s)) return "00:00";
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
}

export function getIsIOS() {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|ad|od)/i.test(navigator.userAgent);
}
