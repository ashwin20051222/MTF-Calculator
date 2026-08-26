import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in MTF Pro:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] text-[#e0e0e0] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#6b6d13]/20 flex items-center justify-center text-[#d4cb00]">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-[#9e9e9e]">
              MTF Pro encountered an unexpected issue while loading. You can reload or reset the app to recover.
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#6b6d13] hover:bg-[#808216] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
              >
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-[#ccc] font-bold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer border border-[#444]"
              >
                Reset &amp; Clear
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
