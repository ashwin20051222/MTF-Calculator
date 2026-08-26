import React, { useState } from 'react';
import type { TradeParams } from '../engine/calculator';
import { DownloadAppButton } from './DownloadAppButton';

interface SettingsPageProps {
  params: TradeParams;
  ratesDate: string;
  showRatesDate: boolean;
  onUpdateParams: (newParams: Partial<TradeParams>) => void;
  onUpdateRatesDate: (newDate: string) => void;
  onToggleShowRatesDate: (show: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  params,
  ratesDate,
  showRatesDate,
  onUpdateParams,
  onUpdateRatesDate,
  onToggleShowRatesDate,
}) => {
  const [zerodhaDailyRate, setZerodhaDailyRate] = useState<number>(params.zerodhaDailyRate);
  const [growwDailyRate, setGrowwDailyRate] = useState<number>(params.growwDailyRate);
  const [localRatesDate, setLocalRatesDate] = useState<string>(ratesDate);
  const [localShowRatesDate, setLocalShowRatesDate] = useState<boolean>(showRatesDate);
  const [dateInputType, setDateInputType] = useState<'custom' | 'picker'>('custom');
  const [savedMessage, setSavedMessage] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateParams({
      zerodhaDailyRate,
      growwDailyRate,
    });
    onUpdateRatesDate(localRatesDate);
    onToggleShowRatesDate(localShowRatesDate);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleReset = () => {
    const defaults = {
      zerodhaDailyRate: 0.0493,
      growwDailyRate: 0.0410,
    };
    setZerodhaDailyRate(defaults.zerodhaDailyRate);
    setGrowwDailyRate(defaults.growwDailyRate);
    setLocalRatesDate('Aug 2025');
    setLocalShowRatesDate(true);
    onUpdateParams(defaults);
    onUpdateRatesDate('Aug 2025');
    onToggleShowRatesDate(true);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleSetToday = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setLocalRatesDate(formatted);
  };

  const handleSetCurrentMonth = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    setLocalRatesDate(formatted);
  };

  return (
    <div className="flex flex-col gap-gutter max-w-3xl">
      <div className="bento-card pt-16 shadow-sm">
        <span className="bento-label">MTF Settings &amp; Rate Configuration</span>

        {/* Mobile & Offline PWA Card */}
        <div className="mb-6">
          <DownloadAppButton variant="card" />
        </div>

        {savedMessage && (
          <div className="mb-4 bg-primary/10 dark:bg-[#d4cb00]/10 border border-primary/20 text-primary dark:text-[#d4cb00] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Header Date & Badge Configuration */}
          <div className="bg-[#f8f8f4] dark:bg-[#252525] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface dark:text-[#e0e0e0]">
                Header "Rates Last Updated" Badge
              </h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localShowRatesDate}
                  onChange={(e) => setLocalShowRatesDate(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded"
                />
                <span className="text-xs font-medium text-on-surface dark:text-[#e0e0e0]">Show in Header</span>
              </label>
            </div>

            {localShowRatesDate ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-1">
                  <button
                    type="button"
                    onClick={() => setDateInputType('custom')}
                    className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${dateInputType === 'custom' ? 'bg-primary text-on-primary dark:bg-[#d4cb00] dark:text-[#1a1a00]' : 'bg-surface-container-high text-[#5f6368] dark:text-[#9e9e9e]'}`}
                  >
                    Custom Text (e.g. Aug 2025)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateInputType('picker')}
                    className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${dateInputType === 'picker' ? 'bg-primary text-on-primary dark:bg-[#d4cb00] dark:text-[#1a1a00]' : 'bg-surface-container-high text-[#5f6368] dark:text-[#9e9e9e]'}`}
                  >
                    Date Picker (Day/Month/Year)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dateInputType === 'custom' ? (
                    <div>
                      <label className="label-dark">Custom Date Text</label>
                      <input
                        type="text"
                        className="input-dark text-sm font-bold"
                        value={localRatesDate}
                        onChange={(e) => setLocalRatesDate(e.target.value)}
                        placeholder="e.g. Aug 2025, 26 Aug 2026, Q3 2025"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="label-dark">Select Date (DD/MM/YYYY)</label>
                      <input
                        type="date"
                        className="input-dark text-sm font-bold"
                        onChange={(e) => {
                          if (e.target.value) {
                            const [year, month, day] = e.target.value.split('-');
                            const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            setLocalRatesDate(d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="flex flex-col justify-end gap-2">
                    <label className="label-dark">Quick Presets</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSetToday}
                        className="text-xs bg-surface-container-lowest dark:bg-[#333] border border-outline-variant dark:border-[#444] px-2.5 py-1.5 rounded hover:border-primary transition-colors text-on-surface dark:text-[#e0e0e0]"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={handleSetCurrentMonth}
                        className="text-xs bg-surface-container-lowest dark:bg-[#333] border border-outline-variant dark:border-[#444] px-2.5 py-1.5 rounded hover:border-primary transition-colors text-on-surface dark:text-[#e0e0e0]"
                      >
                        Current Month
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocalRatesDate('Aug 2025')}
                        className="text-xs bg-surface-container-lowest dark:bg-[#333] border border-outline-variant dark:border-[#444] px-2.5 py-1.5 rounded hover:border-primary transition-colors text-on-surface dark:text-[#e0e0e0]"
                      >
                        Default (Aug 2025)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-1 text-xs text-[#5f6368] dark:text-[#9e9e9e] flex items-center gap-1.5">
                  <span>Preview in header:</span>
                  <span className="font-bold text-on-surface dark:text-[#e0e0e0] bg-surface-container-lowest dark:bg-[#1a1a1a] px-2 py-0.5 rounded border border-outline-variant/40 dark:border-[#444]">
                    Rates last updated: {localRatesDate || '(empty)'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#5f6368] dark:text-[#9e9e9e]">
                The "Rates last updated" label is currently <span className="font-bold text-error">hidden</span> from the top header. Toggle "Show in Header" to enable it.
              </p>
            )}
          </div>

          {/* Zerodha Rate Config */}
          <div className="bg-[#f8f8f4] dark:bg-[#252525] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface dark:text-[#e0e0e0] mb-3">
              Zerodha MTF Interest Rate
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Daily Rate (% / day)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="input-dark text-base font-bold"
                  value={zerodhaDailyRate}
                  onChange={(e) => setZerodhaDailyRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="label-dark">Equivalent Annual Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-dark text-base font-bold text-[#5f6368] dark:text-[#9e9e9e]"
                  value={(zerodhaDailyRate * 365).toFixed(2)}
                  onChange={(e) => setZerodhaDailyRate((parseFloat(e.target.value) || 0) / 365)}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#777] mt-2">Zerodha official default: ~0.0493% per day (~18% p.a. + 18% GST on interest).</p>
          </div>

          {/* Groww Rate Config */}
          <div className="bg-[#f8f8f4] dark:bg-[#252525] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface dark:text-[#e0e0e0] mb-3">
              Groww MTF Interest Rate
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Daily Rate (% / day)</label>
                <input
                  type="number"
                  step="0.0001"
                  className="input-dark text-base font-bold"
                  value={growwDailyRate}
                  onChange={(e) => setGrowwDailyRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="label-dark">Equivalent Annual Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-dark text-base font-bold text-[#5f6368] dark:text-[#9e9e9e]"
                  value={(growwDailyRate * 365).toFixed(2)}
                  onChange={(e) => setGrowwDailyRate((parseFloat(e.target.value) || 0) / 365)}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#777] mt-2">Groww official default: ~0.0410% per day (~14.95% p.a. - 16% p.a.).</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="bg-transparent border border-outline-variant dark:border-[#444] text-on-surface dark:text-[#e0e0e0] text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
            <button
              type="submit"
              className="bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] text-xs font-bold py-2.5 px-6 rounded-lg hover:bg-primary transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
