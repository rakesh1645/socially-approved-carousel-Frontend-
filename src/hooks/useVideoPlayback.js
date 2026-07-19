import { useCallback, useEffect, useRef, useState } from 'react';

const initialState = {
  isPlaying: false,
  isMuted: true,
  isLoading: true,
  currentTime: 0,
  duration: 0,
  error: '',
};

export default function useVideoPlayback({ src, active, visible }) {
  const ref = useRef(null);
  const [state, setState] = useState(initialState);
  const patch = useCallback((value) => {
    setState((previous) => ({ ...previous, ...value }));
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return undefined;

    patch({ error: '', isLoading: true, currentTime: 0, duration: 0 });
    if (video.src !== src) {
      video.src = src;
      video.load();
    }

    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [patch, src]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!active || !visible) {
      video.pause();
      return;
    }

    video.muted = true;
    patch({ isMuted: true });
    video.play()?.catch(() => {
      // The centered play button remains available if autoplay is blocked.
    });
  }, [active, patch, src, visible]);

  const togglePlay = useCallback(async () => {
    const video = ref.current;
    if (!video || !active) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      patch({ error: 'Playback could not start.' });
    }
  }, [active, patch]);

  const toggleMute = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    patch({ isMuted: video.muted });
  }, [patch]);

  const seek = useCallback((ratio) => {
    const video = ref.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    video.currentTime = Math.min(1, Math.max(0, ratio)) * video.duration;
  }, []);

  const events = {
    onLoadStart: () => patch({ isLoading: true, error: '' }),
    onWaiting: () => patch({ isLoading: true }),
    onCanPlay: () => patch({ isLoading: false, error: '' }),
    onPlaying: () => patch({ isPlaying: true, isLoading: false, error: '' }),
    onPause: () => patch({ isPlaying: false }),
    onTimeUpdate: (event) => patch({ currentTime: event.currentTarget.currentTime }),
    onLoadedMetadata: (event) => patch({
      duration: Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0,
      error: '',
    }),
    onEnded: () => patch({ isPlaying: false }),
    onError: (event) => {
      if (!event.currentTarget.currentSrc) return;
      patch({ isLoading: false, error: 'This video could not be played. Try another clip.' });
    },
  };

  return {
    ref,
    ...state,
    progress: state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0,
    togglePlay,
    toggleMute,
    seek,
    events,
  };
}
