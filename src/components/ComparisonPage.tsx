import React from 'react';
import type { TradeParams, ChargeBreakdown } from '../engine/calculator';

interface ComparisonPageProps {
  params: TradeParams;
  zerodhaCharges: ChargeBreakdown;
  growwCharges: ChargeBreakdown;
  hasInput: boolean;
  onNavigateToCalc: () => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  params,
  zerodhaCharges,
  growwCharges,
  hasInput,
  onNavigateToCalc,
}) => {
  const f = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const comparisonRows = hasInput ? [
    {
      label: 'Net Profit / Loss',
      z: { value: f(zerodhaCharges.netPnL), positive: zerodhaCharges.netPnL >= 0 },
      g: { value: f(growwCharges.netPnL), positive: growwCharges.netPnL >= 0 },
      diff: `${f(Math.abs(zerodhaCharges.netPnL - growwCharges.netPnL))} (${zerodhaCharges.netPnL > growwCharges.netPnL ? 'Zerodha +' : 'Groww +'})`,
    },
    {
      label: 'Total Charges',
      z: { value: f(zerodhaCharges.totalCharges), positive: false },
      g: { value: f(growwCharges.totalCharges), positive: false },
      diff: `${f(Math.abs(zerodhaCharges.totalCharges - growwCharges.totalCharges))} cheaper (${zerodhaCharges.totalCharges < growwCharges.totalCharges ? 'Zerodha' : 'Groww'})`,
    },
    {
      label: `MTF Interest (${params.holdingDays}d)`,
      z: { value: f(zerodhaCharges.mtfInterest), positive: false },
      g: { value: f(growwCharges.mtfInterest), positive: false },
      diff: f(Math.abs(zerodhaCharges.mtfInterest - growwCharges.mtfInterest)),
    },
    {
      label: 'DP + Pledge Charges',
      z: { value: f(zerodhaCharges.dpCharges + zerodhaCharges.pledgeCharges), positive: true },
      g: { value: f(growwCharges.dpCharges + growwCharges.pledgeCharges), positive: true },
      diff: f(Math.abs((zerodhaCharges.dpCharges + zerodhaCharges.pledgeCharges) - (growwCharges.dpCharges + growwCharges.pledgeCharges))),
    },
    {
      label: 'Break-Even Sell Price',
      z: { value: `₹${zerodhaCharges.breakEvenSellPrice.toFixed(2)}`, positive: true },
      g: { value: `₹${growwCharges.breakEvenSellPrice.toFixed(2)}`, positive: true },
      diff: `₹${Math.abs(zerodhaCharges.breakEvenSellPrice - growwCharges.breakEvenSellPrice).toFixed(2)}`,
    },
  ] : [];

  return (
    <div className="flex flex-col gap-gutter">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Zerodha Card */}
        <div className="bento-card pt-16 shadow-sm">
          <span className="bento-label">Zerodha MTF Model</span>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Interest Rate</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">~0.0493% / day (~18% p.a.)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Brokerage</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">₹20 or 0.03% (Max ₹20)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">DP Charges</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">₹13.50 + 18% GST = ₹15.93</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Pledge / Unpledge</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">₹30 + 18% GST = ₹35.40</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Best Suited For</span>
              <span className="text-xs font-bold text-primary dark:text-[#d4cb00] text-right">Shorter swing trades (1-10 days)</span>
            </div>
          </div>
        </div>

        {/* Groww Card */}
        <div className="bento-card pt-16 shadow-sm">
          <span className="bento-label">Groww MTF Model</span>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Interest Rate</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">~0.0410% / day (~14.95% p.a.)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Brokerage</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">₹20 or 0.05% (Max ₹20)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">DP Charges</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">₹20 + 18% GST = ₹23.60</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Pledge / Unpledge</span>
              <span className="text-xs sm:text-sm font-bold text-on-surface dark:text-[#e0e0e0] text-right">₹20 + 18% GST = ₹23.60</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Best Suited For</span>
              <span className="text-xs font-bold text-primary dark:text-[#d4cb00] text-right">Longer holding periods (&gt;10 days)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison */}
      <div className="bento-card pt-16 shadow-sm">
        <span className="bento-label">Current Trade Head-to-Head Comparison</span>
        
        {!hasInput ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-[#bbb] dark:text-[#555] mb-2 block">compare_arrows</span>
            <p className="text-sm text-[#5f6368] dark:text-[#9e9e9e]">No trade parameters currently entered.</p>
            <button
              onClick={onNavigateToCalc}
              className="mt-4 bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] text-xs font-bold py-2 px-4 rounded-lg hover:bg-primary transition-colors"
            >
              Go to Calculator to Input Trade
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-outline-variant dark:border-[#3a3a3a] text-xs text-[#5f6368] dark:text-[#9e9e9e] uppercase">
                    <th className="py-3 px-2 font-medium">Metric</th>
                    <th className="py-3 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">Zerodha</th>
                    <th className="py-3 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">Groww</th>
                    <th className="py-3 px-2 font-medium">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 dark:divide-[#333]">
                  {comparisonRows.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-2 text-[#5f6368] dark:text-[#9e9e9e]">{row.label}</td>
                      <td className={`py-2.5 px-2 font-bold ${row.z.positive ? 'text-primary dark:text-[#a8e063]' : 'text-error'}`}>
                        {row.z.value}
                      </td>
                      <td className={`py-2.5 px-2 font-bold ${row.g.positive ? 'text-primary dark:text-[#a8e063]' : 'text-error'}`}>
                        {row.g.value}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-on-surface dark:text-[#e0e0e0] text-xs">
                        {row.diff}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden flex flex-col gap-3">
              {comparisonRows.map((row, i) => (
                <div key={i} className="bg-[#f8f8f4] dark:bg-[#252525] p-3 rounded-lg border border-outline-variant/30 dark:border-[#333]">
                  <div className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e] uppercase tracking-wide font-medium mb-2">{row.label}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] text-[#777] dark:text-[#888] mb-0.5">Zerodha</div>
                      <div className={`text-sm font-bold ${row.z.positive ? 'text-primary dark:text-[#a8e063]' : 'text-error dark:text-[#ff6b6b]'}`}>
                        {row.z.value}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#777] dark:text-[#888] mb-0.5">Groww</div>
                      <div className={`text-sm font-bold ${row.g.positive ? 'text-primary dark:text-[#a8e063]' : 'text-error dark:text-[#ff6b6b]'}`}>
                        {row.g.value}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-outline-variant/20 dark:border-[#333]">
                    <span className="text-[10px] text-[#777] dark:text-[#888]">Diff: </span>
                    <span className="text-xs font-bold text-on-surface dark:text-[#e0e0e0]">{row.diff}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
