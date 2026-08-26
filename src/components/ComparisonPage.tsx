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
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">~0.0493% / day (~18% p.a.)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Brokerage (Equity Delivery)</span>
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">₹20 or 0.03% (Max ₹20)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">DP Charges</span>
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">₹13.50 + 18% GST = ₹15.93</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Pledge / Unpledge</span>
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">₹30 + 18% GST = ₹35.40</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Best Suited For</span>
              <span className="text-xs font-bold text-primary dark:text-[#d4cb00]">Shorter swing trades (1-10 days)</span>
            </div>
          </div>
        </div>

        {/* Groww Card */}
        <div className="bento-card pt-16 shadow-sm">
          <span className="bento-label">Groww MTF Model</span>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Interest Rate</span>
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">~0.0410% / day (~14.95% p.a.)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Brokerage (Equity Delivery)</span>
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">₹20 or 0.05% (Max ₹20)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">DP Charges</span>
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">₹20 + 18% GST = ₹23.60</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Pledge / Unpledge</span>
              <span className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">₹20 + 18% GST = ₹23.60</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 dark:border-[#333]">
              <span className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">Best Suited For</span>
              <span className="text-xs font-bold text-primary dark:text-[#d4cb00]">Longer holding periods (&gt;10 days)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Head-to-Head Side-by-Side Comparison */}
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant dark:border-[#3a3a3a] text-xs text-[#5f6368] dark:text-[#9e9e9e] uppercase">
                  <th className="py-3 px-2 font-medium">Metric</th>
                  <th className="py-3 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">Zerodha</th>
                  <th className="py-3 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">Groww</th>
                  <th className="py-3 px-2 font-medium">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 dark:divide-[#333]">
                <tr>
                  <td className="py-2.5 px-2 text-[#5f6368] dark:text-[#9e9e9e]">Net Profit / Loss</td>
                  <td className={`py-2.5 px-2 font-bold ${zerodhaCharges.netPnL >= 0 ? 'text-primary dark:text-[#a8e063]' : 'text-error'}`}>
                    {f(zerodhaCharges.netPnL)}
                  </td>
                  <td className={`py-2.5 px-2 font-bold ${growwCharges.netPnL >= 0 ? 'text-primary dark:text-[#a8e063]' : 'text-error'}`}>
                    {f(growwCharges.netPnL)}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">
                    {f(Math.abs(zerodhaCharges.netPnL - growwCharges.netPnL))} ({zerodhaCharges.netPnL > growwCharges.netPnL ? 'Zerodha + ' : 'Groww + '})
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 text-[#5f6368] dark:text-[#9e9e9e]">Total Charges</td>
                  <td className="py-2.5 px-2 font-bold text-error">{f(zerodhaCharges.totalCharges)}</td>
                  <td className="py-2.5 px-2 font-bold text-error">{f(growwCharges.totalCharges)}</td>
                  <td className="py-2.5 px-2 font-bold text-primary dark:text-[#d4cb00]">
                    {f(Math.abs(zerodhaCharges.totalCharges - growwCharges.totalCharges))} cheaper ({zerodhaCharges.totalCharges < growwCharges.totalCharges ? 'Zerodha' : 'Groww'})
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 text-[#5f6368] dark:text-[#9e9e9e]">MTF Interest ({params.holdingDays} days)</td>
                  <td className="py-2.5 px-2 font-medium text-error">{f(zerodhaCharges.mtfInterest)}</td>
                  <td className="py-2.5 px-2 font-medium text-error">{f(growwCharges.mtfInterest)}</td>
                  <td className="py-2.5 px-2 font-medium">{f(Math.abs(zerodhaCharges.mtfInterest - growwCharges.mtfInterest))}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 text-[#5f6368] dark:text-[#9e9e9e]">DP + Pledge Charges</td>
                  <td className="py-2.5 px-2 font-medium text-on-surface dark:text-[#e0e0e0]">{f(zerodhaCharges.dpCharges + zerodhaCharges.pledgeCharges)}</td>
                  <td className="py-2.5 px-2 font-medium text-on-surface dark:text-[#e0e0e0]">{f(growwCharges.dpCharges + growwCharges.pledgeCharges)}</td>
                  <td className="py-2.5 px-2 font-medium">{f(Math.abs((zerodhaCharges.dpCharges + zerodhaCharges.pledgeCharges) - (growwCharges.dpCharges + growwCharges.pledgeCharges)))}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-2 text-[#5f6368] dark:text-[#9e9e9e]">Break-Even Sell Price</td>
                  <td className="py-2.5 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">₹{zerodhaCharges.breakEvenSellPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">₹{growwCharges.breakEvenSellPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">₹{Math.abs(zerodhaCharges.breakEvenSellPrice - growwCharges.breakEvenSellPrice).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
