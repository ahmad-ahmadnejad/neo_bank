'use client';

import { useState } from 'react';
import { Fingerprint, Delete } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasscodeKeypadProps {
  onSuccess: () => void;
}

export function PasscodeKeypad({ onSuccess }: PasscodeKeypadProps) {
  const [passcode, setPasscode] = useState('');

  const handleKeyPress = (key: string) => {
    if (passcode.length < 6) {
      const newPasscode = passcode + key;
      setPasscode(newPasscode);
      if (newPasscode.length === 6) {
        // Mock authentication process
        setTimeout(() => {
          onSuccess();
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPasscode((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      {/* Pin Indicator */}
      <div className="flex gap-4 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-3.5 h-3.5 rounded-full transition-colors',
              i < passcode.length ? 'bg-brand' : 'bg-stroke'
            )}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full text-2xl font-medium text-t1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num.toString())}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto hover:bg-surface-2 transition-colors active:bg-stroke"
          >
            {num}
          </button>
        ))}
        
        <button className="w-16 h-16 rounded-full flex items-center justify-center mx-auto hover:bg-surface-2 transition-colors text-t3 active:bg-stroke">
          <Fingerprint className="w-8 h-8" />
        </button>
        
        <button
          onClick={() => handleKeyPress('0')}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto hover:bg-surface-2 transition-colors active:bg-stroke"
        >
          0
        </button>
        
        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto hover:bg-surface-2 transition-colors text-t3 active:bg-stroke"
        >
          <Delete className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
