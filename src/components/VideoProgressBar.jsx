const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
};

export default function VideoProgressBar({ progress, currentTime, duration, onSeek }) {
  const seekFromPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width) onSeek((event.clientX - rect.left) / rect.width);
  };

  const seekFromKeyboard = (event) => {
    if (!duration) return;
    const step = Math.min(1, 5 / duration);
    const currentRatio = progress / 100;
    const targets = {
      ArrowLeft: currentRatio - step,
      ArrowDown: currentRatio - step,
      ArrowRight: currentRatio + step,
      ArrowUp: currentRatio + step,
      Home: 0,
      End: 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    onSeek(targets[event.key]);
  };

  return (
    <div
      className="absolute inset-x-3 top-[5px] z-20 h-5 cursor-pointer touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      role="slider"
      tabIndex={0}
      aria-label="Video progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(progress)}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      onKeyDown={seekFromKeyboard}
      onPointerDown={seekFromPointer}
    >
      <div className="mt-2 h-1 overflow-hidden rounded bg-white/35">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
