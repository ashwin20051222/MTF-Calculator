import React, { useState } from 'react';
import type { TradeParams } from '../engine/calculator';
import { calculateCharges } from '../engine/calculator';

interface SimulatorPageProps {
  params: TradeParams;
  hasInput: boolean;
  onNavigateToCalc: () => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  params,
  hasInput,
  onNavigateToCalc,
}) => {
  const [simDays, setSimDays] = useState<number>(params.holdingDays || 10);
  const scenarios = [-10, -5, -2, 0, 2, 5, 10, 15, 20];

  const f = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-gutter">
      {!hasInput ? (
        <div className="bento-card pt-16 shadow-sm text-center py-16">
          <span className="bento-label">MTF Scenario Simulator</span>
          <span className="material-symbols-outlined text-5xl text-[#bbb] dark:text-[#555] mb-3 block">query_stats</span>
          <p className="text-sm font-medium text-[#5f6368] dark:text-[#9e9e9e]">No trade parameters entered yet.</p>
          <p className="text-xs text-[#777] mt-1 mb-4">Please input a buy price, quantity, and capital to simulate price and holding scenarios.</p>
          <button
            onClick={onNavigateToCalc}
            className="bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] text-xs font-bold py-2 px-6 rounded-lg hover:bg-primary transition-colors inline-block"
          >
            Go to Calculator
          </button>
        </div>
      ) : (
        <div className="bento-card pt-16 shadow-sm">
          <span className="bento-label">Price &amp; Holding Duration Simulator</span>

          {/* Holding Days Controller */}
          <div className="mb-6 bg-[#f8f8f4] dark:bg-[#252525] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
            <div className="flex justify-between items-center mb-2">
              <label className="label-dark mb-0">Simulated Holding Period</label>
              <span className="text-sm font-bold text-primary dark:text-[#d4cb00]">{simDays} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="180"
              value={simDays}
              onChange={(e) => setSimDays(parseInt(e.target.value) || 1)}
              className="w-full accent-primary dark:accent-[#d4cb00] bg-surface-container-highest dark:bg-[#333] h-1.5 rounded-full appearance-none outline-none"
            />
          </div>

          {/* Scenarios Table */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-sm min-w-[550px]">
              <thead>
                <tr className="border-b border-outline-variant dark:border-[#3a3a3a] text-xs text-[#5f6368] dark:text-[#9e9e9e] uppercase">
                  <th className="py-3 px-2 font-medium">Price Move</th>
                  <th className="py-3 px-2 font-medium">Sell Price</th>
                  <th className="py-3 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">Zerodha Net P&amp;L</th>
                  <th className="py-3 px-2 font-bold text-on-surface dark:text-[#e0e0e0]">Groww Net P&amp;L</th>
                  <th className="py-3 px-2 font-medium">Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 dark:divide-[#333]">
                {scenarios.map((pct) => {
                  const targetSellPrice = params.buyPrice * (1 + pct / 100);
                  const simParams = { ...params, sellPrice: targetSellPrice, holdingDays: simDays };
                  const zCharge = calculateCharges('zerodha', simParams);
                  const gCharge = calculateCharges('groww', simParams);
                  const isZWinner = zCharge.netPnL > gCharge.netPnL;

                  return (
                    <tr key={pct} className={pct === 0 ? 'bg-surface-container-high/40 dark:bg-[#2a2a2a]' : ''}>
                      <td className="py-2.5 px-2 font-bold text-xs">
                        <span className={pct > 0 ? 'text-primary dark:text-[#a8e063]' : pct < 0 ? 'text-error' : 'text-on-surface dark:text-[#e0e0e0]'}>
                          {pct > 0 ? `+${pct}%` : `${pct}%`}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-on-surface dark:text-[#e0e0e0] font-medium">
                        ₹{targetSellPrice.toFixed(2)}
                      </td>
                      <td className={`py-2.5 px-2 font-bold ${zCharge.netPnL >= 0 ? 'text-primary dark:text-[#a8e063]' : 'text-error'}`}>
                        {f(zCharge.netPnL)}
                        <span className="text-[10px] text-[#5f6368] dark:text-[#888] block font-normal">
                          ROI: {zCharge.netROI > 0 ? '+' : ''}{zCharge.netROI.toFixed(1)}%
                        </span>
                      </td>
                      <td className={`py-2.5 px-2 font-bold ${gCharge.netPnL >= 0 ? 'text-primary dark:text-[#a8e063]' : 'text-error'}`}>
                        {f(gCharge.netPnL)}
                        <span className="text-[10px] text-[#5f6368] dark:text-[#888] block font-normal">
                          ROI: {gCharge.netROI > 0 ? '+' : ''}{gCharge.netROI.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-xs">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${isZWinner ? 'bg-[#fdfd00]/20 text-[#656100] dark:text-[#d4cb00]' : 'bg-primary/10 text-primary dark:text-[#d4cb00]'}`}>
                          {isZWinner ? 'Zerodha' : 'Groww'} (+{f(Math.abs(zCharge.netPnL - gCharge.netPnL))})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
