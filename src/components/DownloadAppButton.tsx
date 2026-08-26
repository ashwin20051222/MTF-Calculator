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
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    return (window as unknown as { deferredInstallPrompt?: BeforeInstallPromptEvent }).deferredInstallPrompt || null;
  });
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    try {
      if (
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (window.navigator as unknown as { standalone?: boolean })?.standalone === true
      ) {
        setIsInstalled(true);
      }
    } catch {
      // ignore
    }

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
    const promptEvent =
      deferredPrompt || (window as unknown as { deferredInstallPrompt?: BeforeInstallPromptEvent }).deferredInstallPrompt;

    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          (window as unknown as { deferredInstallPrompt?: null }).deferredInstallPrompt = null;
        }
        return;
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    }

    // Direct fallback: Download the MTF Pro App Shortcut / Web Launcher directly
    const appUrl = window.location.href;
    const shortcutContent = `[InternetShortcut]\nURL=${appUrl}\nIconIndex=0\nHotKey=0\n[{000214A0-0000-0000-C000-000000000046}]\nProp3=19,11\n`;
    const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MTF-Pro-Calculator.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          className={`flex items-center gap-1 bg-[#6b6d13]/10 dark:bg-[#d4cb00]/15 text-[#6b6d13] dark:text-[#d4cb00] px-2.5 py-1 rounded-full text-xs font-bold hover:bg-[#6b6d13]/20 transition-all border border-[#6b6d13]/30 dark:border-[#d4cb00]/30 shadow-xs cursor-pointer active:scale-95 ${className}`}
          title="Direct Download / Install MTF Pro"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          <span>Install App</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-3 text-[#5f6368] dark:text-[#9e9e9e] font-medium hover:bg-surface-variant dark:hover:bg-[#2a2a2a] rounded-lg px-2 py-2 hover:text-primary dark:hover:text-[#d4cb00] transition-colors w-full text-left cursor-pointer active:scale-98 ${className}`}
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
              <h4 className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">Download MTF Pro App</h4>
              <p className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Directly install or download the calculator app for offline use.</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shrink-0 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download Now
          </button>
        </div>
      )}
    </>
  );
};
