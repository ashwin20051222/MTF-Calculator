import React from 'react';
import type { TradeParams } from '../engine/calculator';

interface HistoryEntry {
  id: string;
  timestamp: string;
  params: TradeParams;
  stockSymbol: string;
}

interface HistoryPageProps {
  history: HistoryEntry[];
  onLoad: (params: TradeParams) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export type { HistoryEntry };

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onLoad, onDelete, onClear }) => {
  const f = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-gutter">
      <div className="bento-card pt-16 shadow-sm">
        <span className="bento-label">Saved Calculations</span>

        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onClear}
              className="text-xs font-medium text-error dark:text-[#ff6b6b] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span> Clear All
            </button>
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-12 text-[#5f6368] dark:text-[#9e9e9e]">
            <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">history</span>
            <p className="text-sm font-medium">No saved calculations yet.</p>
            <p className="text-xs mt-1">Calculations are saved automatically when you click "New Calculation".</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map(entry => (
              <div
                key={entry.id}
                className="bg-[#f8f8f4] dark:bg-[#252525] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a] flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-on-surface dark:text-[#e0e0e0] uppercase">
                      {entry.stockSymbol || 'Unknown'}
                    </span>
                    <span className="text-[10px] text-[#5f6368] dark:text-[#777]">
                      {new Date(entry.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-[#5f6368] dark:text-[#9e9e9e]">
                    <span>Buy: {f(entry.params.buyPrice)}</span>
                    <span>Sell: {f(entry.params.sellPrice)}</span>
                    <span>Qty: {entry.params.quantity}</span>
                    <span>{entry.params.holdingDays}d</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onLoad(entry.params)}
                    className="bg-primary/10 dark:bg-[#d4cb00]/10 text-primary dark:text-[#d4cb00] text-xs font-bold px-3 py-1.5 rounded hover:bg-primary/20 dark:hover:bg-[#d4cb00]/20 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-[#5f6368] dark:text-[#777] hover:text-error dark:hover:text-[#ff6b6b] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
