import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function Modal({ children, onClose, label = 'Dialog', className = '' }) {
  const dialogRef = useRef(null);
  useBodyScrollLock();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = [...(dialog?.querySelectorAll('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])') || [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    dialog?.querySelector('button')?.focus();
    return () => { document.removeEventListener('keydown', handleKeyDown); previousFocus?.focus?.(); };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/90 p-0 backdrop-blur-[1px] sm:p-2 md:px-[18px] md:py-0" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-label={label} className={`relative h-[100dvh] w-full max-w-[1070px] sm:h-[96dvh] md:h-[min(660px,96dvh)] ${className}`}>
        <button className="absolute right-2 top-2 z-[100] grid h-10 w-10 cursor-pointer place-items-center rounded-full border-2 border-white/75 bg-white text-neutral-900 shadow-[0_5px_22px_rgb(0_0_0/45%)] hover:bg-neutral-900 hover:text-white sm:right-2.5 sm:top-2.5 sm:h-11 sm:w-11 md:fixed md:right-[18px] md:top-4 md:h-12 md:w-12" onClick={onClose} aria-label="Close modal" title="Close">
          <X className="h-[25px] w-[25px] stroke-[2.5]" />
        </button>
        {children}
      </section>
    </div>,
    document.body
  );
}
