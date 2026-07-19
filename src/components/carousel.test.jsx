import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import VideoProgressBar from './VideoProgressBar';
import VideoThumbnailCard from './VideoThumbnailCard';

describe('carousel controls', () => {
  it('opens the exact thumbnail index', () => {
    const onOpen = vi.fn();
    render(
      <VideoThumbnailCard
        video={{
          id: 'video-8',
          title: 'Customer Video 8',
          videoUrl: '/video.mp4',
          thumbnailUrl: '/thumbnail.png',
          profileUrl: '/profile.png',
        }}
        index={7}
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open Customer Video 8' }));
    expect(onOpen).toHaveBeenCalledWith(7, expect.any(HTMLElement));
  });

  it('supports keyboard seeking on the progress slider', () => {
    const onSeek = vi.fn();
    render(
      <VideoProgressBar
        progress={50}
        currentTime={30}
        duration={60}
        onSeek={onSeek}
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Video progress' });

    expect(slider).toHaveAttribute('aria-valuetext', '0:30 of 1:00');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onSeek).toHaveBeenCalledWith(expect.closeTo(35 / 60));
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onSeek).toHaveBeenLastCalledWith(0);
  });
});
