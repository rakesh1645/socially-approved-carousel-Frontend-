import Modal from './Modal';
import InnerCarousel from './InnerCarousel';

export default function VideoModal({ videos, startIndex, onClose, onVideosChange }) {
  return (
    <Modal onClose={onClose} label="Customer video carousel" className="video-modal">
      <InnerCarousel videos={videos} startIndex={startIndex} onVideosChange={onVideosChange} />
    </Modal>
  );
}
