import { useState } from "react";
import { recordShare, toggleLike } from "../api";
import useVideoPlayback from "../hooks/useVideoPlayback";
import LoadingSpinner from "./LoadingSpinner";
import VideoControls from "./VideoControls";
import VideoProgressBar from "./VideoProgressBar";

export default function VideoPlayer({ video, isActive, onVideoChange }) {
  const playback = useVideoPlayback({
    src: video.videoUrl,
    active: isActive,
    visible: true,
  });
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState("");

  const like = async () => {
    if (pending) return;
    const previous = { likes: video.likes, isLiked: video.isLiked };
    onVideoChange(video.id, {
      likes: video.likes + (video.isLiked ? -1 : 1),
      isLiked: !video.isLiked,
    });
    setPending(true);
    try {
      const { data } = await toggleLike(video.id);
      onVideoChange(video.id, data);
    } catch {
      onVideoChange(video.id, previous);
      setFeedback("Like failed. Please retry.");
    } finally {
      setPending(false);
    }
  };

  const share = async () => {
    const url = `${location.origin}?video=${video.id}`;
    let platform = "copy_link";
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
        platform = "native_share";
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback("Link copied");
      }
      const { data } = await recordShare(video.id, platform);
      onVideoChange(video.id, data);
    } catch (error) {
      if (error?.name !== "AbortError")
        setFeedback("Share failed. Please retry.");
    }
  };

  return (
    <article className="relative h-full overflow-hidden rounded-2xl bg-black text-white">
      <video
        key={video.id}
        ref={playback.ref}
        poster={video.thumbnailUrl}
        preload="metadata"
        playsInline
        muted={playback.isMuted}
        onClick={playback.togglePlay}
        className="h-full w-full cursor-pointer object-cover"
        {...playback.events}
      />
      {playback.isLoading && !playback.error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/25">
          <LoadingSpinner label="" />
        </div>
      )}
      {playback.error && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/75 p-6 text-center text-sm">
          <div>
            <p>{playback.error}</p>
            <button
              className="mt-4 rounded-full bg-white px-4 py-2 font-semibold text-black"
              onClick={playback.togglePlay}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80" />
      {isActive && (
        <>
          <VideoControls
            active
            playing={playback.isPlaying}
            muted={playback.isMuted}
            liked={video.isLiked}
            likes={video.likes}
            shares={video.shares}
            pending={pending}
            onPlay={playback.togglePlay}
            onMute={playback.toggleMute}
            onLike={like}
            onShare={share}
          />
          <VideoProgressBar
            progress={playback.progress}
            currentTime={playback.currentTime}
            duration={playback.duration}
            onSeek={playback.seek}
          />
        </>
      )}
      {feedback && (
        <span
          role="status"
          className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-2 text-xs"
        >
          {feedback}
        </span>
      )}
    </article>
  );
}
