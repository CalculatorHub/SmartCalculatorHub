import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, X, Info, HelpCircle, FileDown } from 'lucide-react';

export default function DownloadAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const isAndroidDevice = /Android/.test(ua);
    setIsAndroid(isAndroidDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAction = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      setShowHowTo(true);
    }
  };

  const handleAPKDownload = () => {
    // This expects calhub.apk to be in the /public folder
    const link = document.createElement('a');
    link.href = '/calhub.apk';
    link.download = 'calhub.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {isAndroid && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAPKDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-xl transition-all duration-300 group border border-emerald-500/30"
          >
            <FileDown className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Download APK
            </span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAction}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl transition-all duration-300 group border border-blue-500/30"
        >
          <Smartphone className="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isInstallable ? 'Install App' : 'Get App'}
          </span>
        </motion.button>
      </div>

      {/* How to install modal */}
      <AnimatePresence>
        {showHowTo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowTo(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#020617] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden p-6"
            >
              <button 
                onClick={() => setShowHowTo(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Get CALHUB</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Add to your home screen or download the native Android app.</p>
                </div>

                <div className="space-y-4">
                  {/* APK Download Link for Everyone */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                    <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileDown className="w-3 h-3" />
                      Direct APK (Android)
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 font-bold mb-3">
                      Download the standalone app file directly to your phone.
                    </p>
                    <button 
                      onClick={handleAPKDownload}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all"
                    >
                      Download calhub.apk
                    </button>
                    <p className="text-[9px] text-gray-400 mt-2 italic text-center">Note: Enable "Install from unknown sources" in settings.</p>
                  </div>

                  {isIOS ? (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                      <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Smartphone className="w-3 h-3" />
                        iOS Instructions (PWA)
                      </h4>
                      <ol className="text-[11px] text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside font-bold">
                        <li>Open Safari browser</li>
                        <li>Tap the 'Share' icon (bottom center)</li>
                        <li>Scroll down and tap 'Add to Home Screen'</li>
                        <li>Tap 'Add' in the top right corner</li>
                      </ol>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                      <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <HelpCircle className="w-3 h-3" />
                         General Web App Install
                      </h4>
                      <ol className="text-[11px] text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside font-bold">
                        <li>Tap the three dots (menu) in your browser</li>
                        <li>Select 'Install App' or 'Add to Home Screen'</li>
                        <li>Follow the on-screen prompts to confirm</li>
                      </ol>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                     <Info className="w-4 h-4 text-emerald-500 shrink-0" />
                     <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">Works offline once installed! ⚡</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowHowTo(false)}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-lg transition-transform active:scale-95 uppercase tracking-widest text-[11px]"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

