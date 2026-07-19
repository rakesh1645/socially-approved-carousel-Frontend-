import { Heart, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";

const playbackButton =
  "pointer-events-auto inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-50 [&_svg]:h-5 [&_svg]:w-5";
const socialButton =
  "pointer-events-auto grid min-h-12 min-w-[38px] gap-0 bg-transparent p-[3px] text-white [text-shadow:0_1px_3px_#000] disabled:opacity-50 [&_small]:text-[9px] [&_svg]:mx-auto [&_svg]:h-5 [&_svg]:w-5";

export default function VideoControls({
  active,
  playing,
  muted,
  liked,
  likes,
  shares,
  pending,
  onPlay,
  onMute,
  onLike,
  onShare,
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[22]">
      {active && !playing && <button
        className="pointer-events-auto absolute left-1/2 top-1/2 grid h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 [&_svg]:h-[25px] [&_svg]:w-[25px]"
        onClick={onPlay}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause /> : <Play className="ml-[3px]" fill="currentColor" />}
      </button>}
      {active && playing && (
        <button className={`${playbackButton} absolute left-3 top-[15px]`} onClick={onPlay} aria-label="Pause">
          <Pause />
        </button>
      )}
      <div className="absolute right-3 top-[15px]">
        <button
          className={playbackButton}
          onClick={onMute}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>
      <div className="absolute right-2 top-1/2 grid -translate-y-1/2 gap-1 sm:right-2.5 sm:gap-[5px]">
        <button
          className={`${socialButton} ${liked ? "text-rose-500" : ""}`}
          disabled={pending}
          onClick={onLike}
          aria-label="Like"
        >
          <Heart fill={liked ? "currentColor" : "none"} />
          <small>{likes}</small>
        </button>
        <button className={socialButton} onClick={onShare} aria-label="Share">
          <Share2 />
          <small>{shares}</small>
        </button>
      </div>
    </div>
  );
}
