import React from 'react';
import type { ChargeBreakdown } from '../engine/calculator';

interface BrokerSummaryCardProps {
  brokerName: string;
  isWinner: boolean;
  charges: ChargeBreakdown;
  hasInput: boolean;
}

export const BrokerSummaryCard: React.FC<BrokerSummaryCardProps> = ({ brokerName, isWinner, charges, hasInput }) => {
  const isProfit = charges.netPnL >= 0;
  const formatINR = (n: number) => `₹${Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  return (
    <div className="bento-card pt-16 pb-6 shadow-sm relative overflow-hidden">
      <span className="bento-label">{brokerName} MTF</span>
      
      {hasInput && isWinner ? (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-primary dark:text-[#d4cb00] text-[10px] font-bold uppercase tracking-wider bg-primary/10 dark:bg-[#d4cb00]/10 px-2 py-1 rounded">
          <span className="material-symbols-outlined text-[12px]">verified</span> Winner
        </div>
      ) : (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-outline-variant dark:bg-[#444]"></div>
      )}

      <div className="flex flex-col gap-4 relative z-10">
        <div>
          <div className="text-xs font-medium text-[#5f6368] dark:text-[#9e9e9e] mb-1">Net P&amp;L</div>
          {hasInput ? (
            <div className={`value-display ${isProfit ? 'profit-text' : 'loss-text'}`}>
              {isProfit ? '' : '-'}{formatINR(charges.netPnL)}
            </div>
          ) : (
            <div className="value-display text-[#bbb] dark:text-[#555]">--</div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant dark:border-[#3a3a3a]">
          <div>
            <div className="text-xs font-medium text-[#5f6368] dark:text-[#9e9e9e] mb-1">Net ROI</div>
            {hasInput ? (
              <div className={`text-lg font-bold ${charges.netROI >= 0 ? 'text-primary dark:text-[#a8e063]' : 'text-error dark:text-[#ff6b6b]'}`}>
                {charges.netROI > 0 ? '+' : ''}{charges.netROI.toFixed(1)}%
              </div>
            ) : (
              <div className="text-lg font-bold text-[#bbb] dark:text-[#555]">--%</div>
            )}
          </div>
          <div>
            <div className="text-xs font-medium text-[#5f6368] dark:text-[#9e9e9e] mb-1">Total Cost</div>
            {hasInput ? (
              <div className="text-lg font-bold text-error dark:text-[#ff6b6b]">
                {formatINR(charges.totalCharges)}
              </div>
            ) : (
              <div className="text-lg font-bold text-[#bbb] dark:text-[#555]">--</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
