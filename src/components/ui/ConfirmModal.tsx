'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'بله، حذف شود',
  cancelText = 'انصراف'
}: ConfirmModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    const handleCancel = (e: Event) => {
      e.preventDefault(); // prevent native close, let React/Framer handle it
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [isOpen, onClose]);

  return (
    <dialog 
      ref={dialogRef} 
      className="bg-transparent m-0 p-0 max-w-none max-h-none w-full h-full backdrop:bg-transparent overflow-hidden"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
              aria-hidden="true"
            />
            <div className="fixed inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
              <motion.section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-desc"
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full max-w-sm bg-surface-raised border border-white/10 rounded-3xl shadow-glass p-6 sm:p-8 pointer-events-auto flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" aria-hidden="true" />
                
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-6 relative z-10 shadow-neon">
                  <AlertTriangle className="w-8 h-8" aria-hidden="true" />
                </div>
                
                <h3 id="confirm-title" className="text-xl font-bold text-white mb-3 relative z-10">{title}</h3>
                <p id="confirm-desc" className="text-sm text-foreground-muted mb-8 relative z-10 leading-relaxed">{description}</p>
                
                <div className="flex items-center gap-3 w-full relative z-10">
                  <Button variant="ghost" onClick={onClose} className="w-full border border-white/10 hover:bg-white/5 h-12 focus-visible:ring-2 focus-visible:ring-primary outline-none">
                    {cancelText}
                  </Button>
                  <Button 
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }} 
                    className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white border-none shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  >
                    {confirmText}
                  </Button>
                </div>
              </motion.section>
            </div>
          </>
        )}
      </AnimatePresence>
    </dialog>
  );
}
