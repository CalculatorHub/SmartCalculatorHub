import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Wifi, WifiOff } from 'lucide-react';

export default function DownloadAppButton() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownload = () => {
    window.open('https://smart-calculator-hub.vercel.app/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Dot */}
      <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`} />
        <span className="text-[8px] font-black uppercase tracking-[0.1em] text-gray-400">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 backdrop-blur-xl border border-white/10 rounded-full transition-all duration-300 group"
      >
        <Download className="w-3.5 h-3.5 text-blue-400 group-hover:animate-bounce" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest hidden xs:inline">
          App
        </span>
      </motion.button>
    </div>
  );
}
