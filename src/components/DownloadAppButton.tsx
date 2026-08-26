import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface DownloadAppProps {
  variant?: 'nav' | 'sidebar' | 'card' | 'badge';
  className?: string;
}

export const DownloadAppButton: React.FC<DownloadAppProps> = ({ variant = 'nav', className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Check if already in standalone/PWA mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Show instructional modal for iOS / manual Android install
      setModalOpen(true);
    }
  };

  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className={`flex items-center gap-3 px-2 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 ${className}`}>
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>App Installed</span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {variant === 'nav' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1 bg-[#6b6d13]/10 dark:bg-[#d4cb00]/15 text-[#6b6d13] dark:text-[#d4cb00] px-2.5 py-1 rounded-full text-xs font-bold hover:bg-[#6b6d13]/20 transition-all border border-[#6b6d13]/30 dark:border-[#d4cb00]/30 shadow-xs cursor-pointer ${className}`}
          title="Install / Download App on Mobile"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          <span>Install App</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-3 text-[#5f6368] dark:text-[#9e9e9e] font-medium hover:bg-surface-variant dark:hover:bg-[#2a2a2a] rounded-lg px-2 py-2 hover:text-primary dark:hover:text-[#d4cb00] transition-colors w-full text-left cursor-pointer ${className}`}
        >
          <span className="material-symbols-outlined text-sm text-[#6b6d13] dark:text-[#d4cb00]">install_mobile</span>
          <span className="text-sm font-semibold">Download App</span>
        </button>
      )}

      {variant === 'card' && (
        <div className={`bg-surface-container-high/40 dark:bg-[#232323] p-4 rounded-xl border border-outline-variant dark:border-[#3a3a3a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 rounded-xl shrink-0" size={40} />
            <div>
              <h4 className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">Install MTF Pro on Mobile</h4>
              <p className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Access the calculator with 1 tap directly from your home screen.</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Install Now
          </button>
        </div>
      )}

      {/* Guide Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#fcfcf9] dark:bg-[#1e1e1e] border border-outline-variant dark:border-[#3a3a3a] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Logo className="w-9 h-9 rounded-xl shadow-xs" size={36} />
                <div>
                  <h3 className="text-base font-bold text-on-surface dark:text-[#e0e0e0]">Download MTF Pro</h3>
                  <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Add to Mobile Home Screen</span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#5f6368] hover:text-on-surface dark:text-[#9e9e9e] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-on-surface-variant dark:text-[#cccccc]">
                <p className="font-medium text-[#6b6d13] dark:text-[#d4cb00]">Follow these steps in Safari on iPhone / iPad:</p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Tap the <strong>Share</strong> button <span className="inline-flex items-center align-middle font-bold text-blue-600 dark:text-blue-400"><span className="material-symbols-outlined text-sm">ios_share</span></span> at the bottom of Safari.
                  </li>
                  <li>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> <span className="inline-flex items-center align-middle font-bold text-[#6b6d13] dark:text-[#d4cb00]"><span className="material-symbols-outlined text-sm">add_box</span></span>.
                  </li>
                  <li>
                    Tap <strong>Add</strong> at top right to complete.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-on-surface-variant dark:text-[#cccccc]">
                <p className="font-medium text-[#6b6d13] dark:text-[#d4cb00]">To install on Android (Chrome / Brave / Edge):</p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Tap the <strong>Menu</strong> (3 dots <span className="inline-flex items-center align-middle font-bold">⋮</span>) in the top-right corner.
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    Confirm by tapping <strong>Install</strong>.
                  </li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="mt-5 w-full bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-sm hover:opacity-95 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
