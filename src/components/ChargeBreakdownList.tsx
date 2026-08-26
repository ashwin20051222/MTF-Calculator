import React, { useState } from 'react';
import type { ChargeBreakdown, Broker } from '../engine/calculator';

interface ChargeBreakdownListProps {
  zerodhaCharges: ChargeBreakdown;
  growwCharges: ChargeBreakdown;
  holdingDays: number;
  zerodhaDailyRate: number;
  growwDailyRate: number;
  hasInput: boolean;
}

export const ChargeBreakdownList: React.FC<ChargeBreakdownListProps> = ({
  zerodhaCharges,
  growwCharges,
  holdingDays,
  zerodhaDailyRate,
  growwDailyRate,
  hasInput,
}) => {
  const [activeTab, setActiveTab] = useState<Broker>('zerodha');

  const charges = activeTab === 'zerodha' ? zerodhaCharges : growwCharges;
  const dailyRate = activeTab === 'zerodha' ? zerodhaDailyRate : growwDailyRate;

  const formatRs = (num: number) => hasInput ? `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--';

  return (
    <div className="bento-card pt-16 flex-1 shadow-sm">
      <span className="bento-label">Charge Breakdown (Estimated)</span>
      
      <div className="flex gap-4 mb-4 border-b border-outline-variant dark:border-[#3a3a3a] pb-2">
        <button 
          onClick={() => setActiveTab('zerodha')}
          className={`text-sm pb-1 tracking-wide transition-colors ${activeTab === 'zerodha' ? 'font-bold text-primary dark:text-[#d4cb00] border-b-2 border-primary dark:border-[#d4cb00]' : 'font-medium text-[#5f6368] dark:text-[#9e9e9e] hover:text-on-surface dark:hover:text-[#ccc]'}`}
        >
          Zerodha
        </button>
        <button 
          onClick={() => setActiveTab('groww')}
          className={`text-sm pb-1 tracking-wide transition-colors ${activeTab === 'groww' ? 'font-bold text-primary dark:text-[#d4cb00] border-b-2 border-primary dark:border-[#d4cb00]' : 'font-medium text-[#5f6368] dark:text-[#9e9e9e] hover:text-on-surface dark:hover:text-[#ccc]'}`}
        >
          Groww
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        {/* Buy Side */}
        <div>
          <h4 className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e] uppercase tracking-wide mb-2 font-bold">Buy Side</h4>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">Brokerage</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.buyBrokerage)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">STT</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.buySTT)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">Exchange Txn</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.buyExchangeTxn)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">Stamp Duty</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.buyStampDuty)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">SEBI Charges</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.buySEBI)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">GST (18%)</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.buyGST)}</span>
          </div>
          <div className="flex justify-between py-1.5 mt-1 bg-surface-container-high/50 dark:bg-[#2a2a2a] px-2 rounded">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-bold text-xs">Total Buy</span>
            <span className="text-xs font-bold text-on-surface dark:text-[#e0e0e0]">{formatRs(charges.totalBuyCharges)}</span>
          </div>
        </div>

        {/* Sell Side & MTF */}
        <div>
          <h4 className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e] uppercase tracking-wide mb-2 font-bold">Sell/Hold Side</h4>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">Brokerage</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.sellBrokerage)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">STT</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.sellSTT)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">Exchange Txn</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.sellExchangeTxn)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">GST (18%)</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.sellGST)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">DP Charges</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.dpCharges)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333]">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">Pledge/Unpledge</span>
            <span className="text-xs font-bold dark:text-[#e0e0e0]">{formatRs(charges.pledgeCharges)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/30 dark:border-[#333] mt-2">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-medium text-xs">MTF Interest ({holdingDays}d)</span>
            <span className="text-xs font-bold text-error dark:text-[#ff6b6b]">{formatRs(charges.mtfInterest)}</span>
          </div>
          <div className="flex justify-between py-1 text-[11px] text-[#5f6368] dark:text-[#777] font-medium">
            <span>Daily Rate: ~{dailyRate.toFixed(3)}%</span>
          </div>
          <div className="flex justify-between py-1.5 mt-1 bg-surface-container-high/50 dark:bg-[#2a2a2a] px-2 rounded">
            <span className="text-[#5f6368] dark:text-[#9e9e9e] font-bold text-xs">Total Sell/Hold</span>
            <span className="text-xs font-bold text-on-surface dark:text-[#e0e0e0]">{formatRs(charges.totalSellCharges)}</span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="mt-4 pt-3 border-t-2 border-outline-variant dark:border-[#444] flex justify-between items-center">
        <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0] uppercase tracking-wide">Total All Charges</span>
        <span className="text-lg font-bold text-error dark:text-[#ff6b6b]">{formatRs(charges.totalCharges)}</span>
      </div>
    </div>
  );
};
