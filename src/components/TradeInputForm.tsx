import React, { useState, useEffect } from 'react';
import type { TradeParams } from '../engine/calculator';

interface TradeInputFormProps {
  params: TradeParams;
  onChange: (params: TradeParams) => void;
  onSave?: (symbol: string) => void;
  savedToast?: boolean;
}

export const TradeInputForm: React.FC<TradeInputFormProps> = ({ params, onChange, onSave, savedToast }) => {
  const [localParams, setLocalParams] = useState<TradeParams>(params);
  const [stockSymbol, setStockSymbol] = useState<string>('TRADE');

  useEffect(() => {
    setLocalParams(params);
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    const newParams = {
      ...localParams,
      [name]: isNaN(numValue) && value !== '' ? localParams[name as keyof TradeParams] : value === '' ? 0 : numValue,
    };
    
    setLocalParams(newParams);
    
    if (!isNaN(numValue) || value === '') {
        onChange(newParams);
    }
  };

  const totalValue = localParams.buyPrice * localParams.quantity;
  const marginPercent = totalValue > 0 ? ((localParams.ownCapital / totalValue) * 100).toFixed(0) : '0';
  const hasValidInput = localParams.buyPrice > 0 && localParams.sellPrice > 0 && localParams.quantity > 0;

  const formatINR = (n: number) => n > 0 ? n.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0';

  const zerodhaFundedDisplay = localParams.zerodhaFunded > 0 ? `₹${formatINR(localParams.zerodhaFunded)}` : '--';
  const growwFundedDisplay = localParams.growwFunded > 0 ? `₹${formatINR(localParams.growwFunded)}` : '--';

  return (
    <div className="col-span-4 md:col-span-8 lg:col-span-4 bento-card pt-16 shadow-sm">
      <span className="bento-label">Trade Parameters</span>
      <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-dark">Stock Symbol</label>
            <input 
              className="input-dark text-base font-medium uppercase" 
              type="text" 
              value={stockSymbol === 'TRADE' ? '' : stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value.toUpperCase() || 'TRADE')}
              placeholder="e.g. RELIANCE" 
            />
          </div>
          <div>
            <label className="label-dark">Quantity</label>
            <input 
              name="quantity"
              className="input-dark text-base font-medium" 
              type="number" 
              value={localParams.quantity || ''} 
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-dark">Buy Price (₹)</label>
            <input 
              name="buyPrice"
              className="input-dark text-base font-medium text-on-surface dark:text-[#e0e0e0]" 
              type="number" 
              step="0.05"
              value={localParams.buyPrice || ''} 
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="label-dark">Sell Price (₹)</label>
            <input 
              name="sellPrice"
              className="input-dark text-base font-medium text-on-surface dark:text-[#e0e0e0]" 
              type="number" 
              step="0.05"
              value={localParams.sellPrice || ''} 
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="label-dark">My Capital (₹)</label>
          <input 
            name="ownCapital"
            className="input-dark text-base font-medium" 
            type="number" 
            value={localParams.ownCapital || ''} 
            onChange={handleChange}
            placeholder="0"
          />
          <div className="flex justify-between mt-1 text-[10px] font-medium text-[#5f6368] dark:text-[#777]">
            <span>Total Value: ₹{formatINR(totalValue)}</span>
            <span>Required Margin: {marginPercent}%</span>
          </div>
        </div>

        <div>
          <label className="label-dark">Holding Days</label>
          <input 
            name="holdingDays"
            className="w-full accent-primary dark:accent-[#d4cb00] bg-surface-container-highest dark:bg-[#333] h-1 rounded-full appearance-none outline-none" 
            type="range" 
            min="1" 
            max="365" 
            value={localParams.holdingDays} 
            onChange={handleChange}
          />
          <div className="text-right mt-1 text-[12px] font-medium text-on-surface dark:text-[#ccc]">
            {localParams.holdingDays} Days
          </div>
        </div>

        {/* Funding Details Sub-section */}
        <div className="pt-4 border-t border-outline-variant dark:border-[#3a3a3a]">
          <h3 className="text-[11px] font-medium text-[#5f6368] dark:text-[#9e9e9e] mb-3 uppercase tracking-wide">Funding Required</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f8f8f4] dark:bg-[#252525] p-3 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
              <div className="text-[10px] font-medium text-[#5f6368] dark:text-[#888] uppercase mb-1 tracking-wide">
                Zerodha ({(localParams.zerodhaDailyRate * 365).toFixed(0)}% p.a)
              </div>
              <div className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">{zerodhaFundedDisplay}</div>
            </div>
            <div className="bg-[#f8f8f4] dark:bg-[#252525] p-3 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
              <div className="text-[10px] font-medium text-[#5f6368] dark:text-[#888] uppercase mb-1 tracking-wide">
                Groww ({(localParams.growwDailyRate * 365).toFixed(0)}% p.a)
              </div>
              <div className="text-sm font-bold text-on-surface dark:text-[#e0e0e0]">{growwFundedDisplay}</div>
            </div>
          </div>
        </div>

        {/* Save to History Button */}
        <button
          type="button"
          onClick={() => onSave && onSave(stockSymbol)}
          disabled={!hasValidInput}
          className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            hasValidInput
              ? 'bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] hover:opacity-90 active:scale-[0.99]'
              : 'bg-surface-container-highest dark:bg-[#2e2e2e] text-[#888] dark:text-[#666] opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-sm">bookmark</span>
          {savedToast ? 'Calculation Saved to History ✓' : 'Save Calculation to History'}
        </button>
      </form>
    </div>
  );
};
