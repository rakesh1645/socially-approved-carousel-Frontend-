import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import VideoPlayer from "./VideoPlayer";

export default function InnerCarousel({ videos, startIndex, onVideosChange }) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const swiperRef = useRef(null);
  const updateVideo = (id, patch) =>
    onVideosChange((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  const handleSlideChange = (swiper) => {
    document
      .querySelectorAll(".video-modal video")
      .forEach((video) => video.pause());
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <>
      <Swiper
        key={startIndex}
        initialSlide={startIndex}
        centeredSlides
        observer
        observeParents
        modules={[A11y, Keyboard]}
        keyboard
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={8}
        slidesPerView={1}
        breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
        onInit={(swiper) =>
          requestAnimationFrame(() => {
            swiper.update();
            swiper.slideTo(startIndex, 0);
          })
        }
        onSlideChange={handleSlideChange}
        className="h-full w-full !overflow-hidden px-3 pb-3 pt-12 [&_.swiper-wrapper]:items-center sm:px-[14px] sm:pb-5 sm:pt-[54px] md:!overflow-visible md:px-[58px] md:py-[18px]"
      >
        {videos.map((video, index) => {
          const mounted = Math.abs(index - activeIndex) <= 1;
          const active = index === activeIndex;
          return (
            <SwiperSlide
              key={video.id}
              className={`!flex items-center transition duration-300 ${active ? "z-[4] scale-100 opacity-100 md:scale-[1.08]" : "scale-[.92] opacity-25 md:scale-[.86]"}`}
            >
              <div
                className={`relative m-auto aspect-[352/596] max-h-[calc(100dvh-64px)] w-full overflow-hidden rounded bg-black shadow-[0_22px_56px_rgb(0_0_0/55%)] sm:max-h-[82dvh] md:max-h-[86dvh] ${active ? "max-w-[min(calc(100vw-32px),360px)] md:max-w-[352px]" : "max-w-[326px]"}`}
              >
                {mounted ? (
                  <VideoPlayer
                    video={video}
                    isActive={active}
                    onVideoChange={updateVideo}
                  />
                ) : (
                  <img
                    src={video.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full rounded-xl object-cover"
                  />
                )}
                {active && (
                  <div className="absolute inset-x-2 bottom-3 z-30 overflow-hidden rounded-lg border border-white/65 bg-neutral-50/95 text-neutral-800 shadow-lg backdrop-blur sm:inset-x-3 sm:bottom-[18px] sm:rounded-xl md:inset-x-6 md:bottom-4">
                    <div className="grid min-h-[72px] grid-cols-[46px_minmax(0,1fr)] items-center gap-2 p-1.5 sm:min-h-[88px] sm:grid-cols-[54px_minmax(0,1fr)] sm:p-2 md:grid-cols-[68px_minmax(0,1fr)] md:gap-2.5">
                      <div className="relative self-stretch">
                        <img
                          src={video.thumbnailUrl}
                          alt={`${video.title} thumbnail`}
                          className="h-[58px] w-[46px] rounded-[7px] object-cover sm:h-[62px] sm:w-[54px] md:h-[72px] md:w-[68px]"
                        />
                        <b className="absolute -left-[3px] bottom-px rounded-full bg-[#ff4774] px-[7px] py-1 text-[9px] text-white">
                          44% OFF
                        </b>
                      </div>
                      <span className="min-w-0">
                        <strong className="block truncate text-xs">
                          {video.title}
                        </strong>
                        <small className="mt-1 block truncate text-sm font-extrabold">
                          Rs. 2199.00
                        </small>
                        <del className="mt-0.5 block truncate text-[10px] text-neutral-400">
                          Rs. 3900.00
                        </del>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        type="button"
        aria-label="Previous reel"
        disabled={activeIndex === 0}
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-1 top-1/2 z-40 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0 sm:h-11 sm:w-11 md:left-2 md:h-[50px] md:w-[50px]"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        aria-label="Next reel"
        disabled={activeIndex === videos.length - 1}
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-1 top-1/2 z-40 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0 sm:h-11 sm:w-11 md:right-2 md:h-[50px] md:w-[50px]"
      >
        <ChevronRight />
      </button>
    </>
  );
}
