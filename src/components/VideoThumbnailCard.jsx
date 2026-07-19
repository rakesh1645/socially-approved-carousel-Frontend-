import { useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";

export default function VideoThumbnailCard({ video, index, onOpen }) {
  const [cardRef, isInView] = useInView({
    threshold: 0.25,
    rootMargin: "150px",
  });
  const videoRef = useRef(null);

  useEffect(() => {
    const preview = videoRef.current;
    if (!preview) return;
    if (isInView) preview.play()?.catch(() => {});
    else preview.pause();
  }, [isInView]);

  return (
    <button
      ref={cardRef}
      className="group relative block aspect-[194/346] w-full overflow-hidden rounded-[11px] border border-neutral-200 bg-neutral-900 text-left shadow-[0_2px_8px_rgb(0_0_0/8%)]"
      onClick={(event) => onOpen(index, event.currentTarget)}
      aria-label={`Open ${video.title}`}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.035]"
        src={isInView ? video.videoUrl : undefined}
        poster={isInView ? video.thumbnailUrl : undefined}
        preload="none"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <span className="absolute inset-x-[9px] bottom-[10px] flex min-h-[66px] min-w-0 items-center gap-[9px] rounded-full bg-white py-2 pl-2 pr-3 shadow-[0_3px_12px_rgb(0_0_0/22%)]">
        <img
          src={video.profileUrl}
          alt={`${video.title} profile`}
          loading="lazy"
          className="h-[46px] w-[46px] shrink-0 rounded-full border-2 border-neutral-200 object-cover"
        />
        <span className="min-w-0">
          <strong className="block truncate text-[13px] font-bold text-neutral-800">
            {video.title}
          </strong>
          <small className="mt-0.5 block text-[13px] font-bold text-[#b74b00]">
            Rs. {index % 5 === 4 ? "599" : "2199"}
          </small>
        </span>
      </span>
    </button>
  );
}
