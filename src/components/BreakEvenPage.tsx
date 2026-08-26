import React, { useState } from 'react';
import type { TradeParams, ChargeBreakdown } from '../engine/calculator';
import { calculateCharges } from '../engine/calculator';

interface BreakEvenPageProps {
  params: TradeParams;
  zerodhaCharges: ChargeBreakdown;
  growwCharges: ChargeBreakdown;
  hasInput: boolean;
  onNavigateToCalc: () => void;
}

export const BreakEvenPage: React.FC<BreakEvenPageProps> = ({
  params,
  zerodhaCharges,
  growwCharges,
  hasInput,
  onNavigateToCalc,
}) => {
  const [targetProfit, setTargetProfit] = useState<number>(5000);
  const [targetROI, setTargetROI] = useState<number>(10);

  // Helper to compute required sell price for target profit
  const calculateRequiredPrice = (broker: 'zerodha' | 'groww', desiredProfit: number) => {
    if (!hasInput || params.quantity <= 0) return 0;
    
    // Binary search for exact required sell price
    let low = params.buyPrice;
    let high = params.buyPrice * 3;
    let result = high;

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const testCharges = calculateCharges(broker, { ...params, sellPrice: mid });
      if (testCharges.netPnL >= desiredProfit) {
        result = mid;
        high = mid;
      } else {
        low = mid;
      }
    }
    return result;
  };

  const reqZerodhaForProfit = calculateRequiredPrice('zerodha', targetProfit);
  const reqGrowwForProfit = calculateRequiredPrice('groww', targetProfit);

  const desiredProfitFromROI = params.ownCapital > 0 ? (params.ownCapital * targetROI) / 100 : 0;
  const reqZerodhaForROI = calculateRequiredPrice('zerodha', desiredProfitFromROI);
  const reqGrowwForROI = calculateRequiredPrice('groww', desiredProfitFromROI);

  const f = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-gutter">
      {!hasInput ? (
        <div className="bento-card pt-16 shadow-sm text-center py-16">
          <span className="bento-label">Break-Even &amp; Target Calculator</span>
          <span className="material-symbols-outlined text-5xl text-[#bbb] dark:text-[#555] mb-3 block">trending_up</span>
          <p className="text-sm font-medium text-[#5f6368] dark:text-[#9e9e9e]">No trade parameters entered yet.</p>
          <p className="text-xs text-[#777] mt-1 mb-4">Please input a buy price, quantity, and capital to view break-even projections.</p>
          <button
            onClick={onNavigateToCalc}
            className="bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] text-xs font-bold py-2 px-6 rounded-lg hover:bg-primary transition-colors inline-block"
          >
            Go to Calculator
          </button>
        </div>
      ) : (
        <>
          {/* Top Cards: Pure Break-Even */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="bento-card pt-16 shadow-sm">
              <span className="bento-label">Zerodha Break-Even</span>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-xs text-[#5f6368] dark:text-[#9e9e9e] mb-1">Required Sell Price</div>
                  <div className="text-3xl font-bold text-on-surface dark:text-[#e0e0e0]">
                    ₹{zerodhaCharges.breakEvenSellPrice.toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-outline-variant/30 dark:border-[#333] text-xs">
                  <span className="text-[#5f6368] dark:text-[#9e9e9e]">Price Increase Required</span>
                  <span className="font-bold text-on-surface dark:text-[#e0e0e0]">
                    +{(((zerodhaCharges.breakEvenSellPrice - params.buyPrice) / params.buyPrice) * 100).toFixed(2)}% (+₹{(zerodhaCharges.breakEvenSellPrice - params.buyPrice).toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-outline-variant/30 dark:border-[#333] text-xs">
                  <span className="text-[#5f6368] dark:text-[#9e9e9e]">Total Recovery Cost</span>
                  <span className="font-bold text-error">{f(zerodhaCharges.totalCharges)}</span>
                </div>
              </div>
            </div>

            <div className="bento-card pt-16 shadow-sm">
              <span className="bento-label">Groww Break-Even</span>
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-xs text-[#5f6368] dark:text-[#9e9e9e] mb-1">Required Sell Price</div>
                  <div className="text-3xl font-bold text-primary dark:text-[#d4cb00]">
                    ₹{growwCharges.breakEvenSellPrice.toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-outline-variant/30 dark:border-[#333] text-xs">
                  <span className="text-[#5f6368] dark:text-[#9e9e9e]">Price Increase Required</span>
                  <span className="font-bold text-on-surface dark:text-[#e0e0e0]">
                    +{(((growwCharges.breakEvenSellPrice - params.buyPrice) / params.buyPrice) * 100).toFixed(2)}% (+₹{(growwCharges.breakEvenSellPrice - params.buyPrice).toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-outline-variant/30 dark:border-[#333] text-xs">
                  <span className="text-[#5f6368] dark:text-[#9e9e9e]">Total Recovery Cost</span>
                  <span className="font-bold text-error">{f(growwCharges.totalCharges)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Profit Price Calculator */}
          <div className="bento-card pt-16 shadow-sm">
            <span className="bento-label">Target Profit Target Price</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Target in INR */}
              <div className="bg-[#f8f8f4] dark:bg-[#252525] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a] flex flex-col gap-3">
                <label className="label-dark">Set Desired Net Profit (₹)</label>
                <input
                  type="number"
                  className="input-dark text-lg font-bold"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 5000"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e]">Zerodha Sell Target</div>
                    <div className="text-base font-bold text-on-surface dark:text-[#e0e0e0]">₹{reqZerodhaForProfit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e]">Groww Sell Target</div>
                    <div className="text-base font-bold text-primary dark:text-[#d4cb00]">₹{reqGrowwForProfit.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Target in ROI % */}
              <div className="bg-[#f8f8f4] dark:bg-[#252525] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a] flex flex-col gap-3">
                <label className="label-dark">Set Desired Net ROI on Capital (%)</label>
                <input
                  type="number"
                  className="input-dark text-lg font-bold"
                  value={targetROI}
                  onChange={(e) => setTargetROI(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 10"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e]">Zerodha ({f(desiredProfitFromROI)})</div>
                    <div className="text-base font-bold text-on-surface dark:text-[#e0e0e0]">₹{reqZerodhaForROI.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e]">Groww ({f(desiredProfitFromROI)})</div>
                    <div className="text-base font-bold text-primary dark:text-[#d4cb00]">₹{reqGrowwForROI.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
