import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Wifi, WifiOff } from 'lucide-react';

export default function DownloadAppButton() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownload = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
    } else {
      // Fallback: Open the external hub link
      window.open('https://smart-calculator-hub.vercel.app/', '_blank', 'noopener,noreferrer');
    }
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
