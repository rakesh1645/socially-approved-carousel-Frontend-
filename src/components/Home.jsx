import { useEffect, useRef, useState } from "react";
import { fetchVideos } from "../api";
import ErrorState from "./ErrorState";
import LoadingSpinner from "./LoadingSpinner";
import OuterCarousel from "./OuterCarousel";
import VideoModal from "./VideoModal";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("loading");
  const [openIndex, setOpenIndex] = useState(null);
  const openerRef = useRef(null);

  const load = async (signal) => {
    setStatus("loading");

    try {
      const { data } = await fetchVideos({ signal });
      setVideos(data);
      setStatus("ready");
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setStatus("error");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  const open = (index, element) => {
    openerRef.current = element;
    setOpenIndex(index);
  };

  const close = () => {
    setOpenIndex(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="mx-auto max-w-7xl px-4 pt-8 sm:px-8">
        <p className="text-sm font-bold tracking-[.22em]">DRIPTRIP</p>
      </header>

      {status === "loading" && (
        <div className="grid min-h-64 place-items-center">
          <LoadingSpinner label="Loading videos" />
        </div>
      )}
      {status === "error" && (
        <ErrorState
          message="We couldn't load the video collection."
          onRetry={() => load()}
        />
      )}
      {status === "ready" && videos.length === 0 && (
        <ErrorState message="No videos are available yet." onRetry={() => load()} />
      )}
      {status === "ready" && videos.length > 0 && (
        <OuterCarousel videos={videos} onOpen={open} />
      )}
      {openIndex !== null && (
        <VideoModal
          videos={videos}
          startIndex={openIndex}
          onClose={close}
          onVideosChange={setVideos}
        />
      )}
    </main>
  );
}
