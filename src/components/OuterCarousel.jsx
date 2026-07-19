import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import VideoThumbnailCard from "./VideoThumbnailCard";
import "swiper/css";

const navButtonClasses =
  "absolute top-1/2 z-20 grid h-12 w-8 -translate-y-1/2 place-items-center bg-black/60 text-white shadow-lg transition hover:bg-black/80 md:h-16 md:w-9";

export default function OuterCarousel({ videos, onOpen }) {
  const swiper = useRef(null);
  const [navigation, setNavigation] = useState({
    canGoBack: false,
    canGoForward: false,
  });

  const updateNavigation = (instance) => {
    setNavigation({
      canGoBack: !instance.isBeginning && !instance.isLocked,
      canGoForward: !instance.isEnd && !instance.isLocked,
    });
  };

  const setSwiper = (instance) => {
    swiper.current = instance;
    requestAnimationFrame(() => updateNavigation(instance));
  };

  return (
    <section
      aria-labelledby="social-title"
      className="mx-auto max-w-[1084px] overflow-hidden px-3 pb-12 pt-8 sm:px-[18px] md:overflow-visible md:pb-[72px] md:pt-[58px]"
    >
      <div className="relative mb-5 text-left sm:mb-[30px] md:text-center">
        <h1
          id="social-title"
          className="m-0 text-[clamp(22px,7vw,44px)] font-normal leading-[1.2] text-[#555]"
        >
          Use Code Thankyou For 10 % OFF. Valid for Today Only.
        </h1>
      </div>
      <div className="relative">
        <Swiper
          onSwiper={setSwiper}
          onSlideChange={updateNavigation}
          onResize={updateNavigation}
          onBreakpoint={updateNavigation}
          modules={[A11y, Keyboard]}
          keyboard
          watchOverflow
          centeredSlides={false}
          spaceBetween={12}
          slidesPerView={1.35}
          breakpoints={{
            420: { slidesPerView: 1.7, spaceBetween: 14 },
            520: { slidesPerView: 2.45, spaceBetween: 16 },
            768: { slidesPerView: 3.6, spaceBetween: 18 },
            1024: { slidesPerView: 5 },
          }}
        >
          {videos.map((video, index) => (
            <SwiperSlide key={video.id}>
              <VideoThumbnailCard video={video} index={index} onOpen={onOpen} />
            </SwiperSlide>
          ))}
        </Swiper>
        {navigation.canGoBack && (
          <button
            className={`${navButtonClasses} left-0 md:left-0`}
            aria-label="Previous videos"
            onClick={() => swiper.current?.slidePrev()}
          >
            <ChevronLeft />
          </button>
        )}
        {navigation.canGoForward && (
          <button
            className={`${navButtonClasses} right-0 md:right-0`}
            aria-label="Next videos"
            onClick={() => swiper.current?.slideNext()}
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}
