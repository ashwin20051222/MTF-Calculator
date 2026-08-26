import { useState, useMemo, useEffect } from 'react';
import { calculateCharges, type TradeParams } from './engine/calculator';
import { TradeInputForm } from './components/TradeInputForm';
import { BrokerSummaryCard } from './components/BrokerSummaryCard';
import { ChargeBreakdownList } from './components/ChargeBreakdownList';
import { ComparisonPage } from './components/ComparisonPage';
import { BreakEvenPage } from './components/BreakEvenPage';
import { SimulatorPage } from './components/SimulatorPage';
import { HistoryPage, type HistoryEntry } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { Logo } from './components/Logo';
import { DownloadAppButton } from './components/DownloadAppButton';

type Tab = 'Calculator' | 'Comparison' | 'Break-Even' | 'Simulator' | 'History' | 'Settings';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Calculator');
  
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('mtf_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ratesDate, setRatesDate] = useState<string>(() => {
    try {
      return localStorage.getItem('mtf_rates_date') || 'Aug 2025';
    } catch {
      return 'Aug 2025';
    }
  });

  const [showRatesDate, setShowRatesDate] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('mtf_show_rates_date');
      return val !== null ? JSON.parse(val) : true;
    } catch {
      return true;
    }
  });

  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('mtf_calc_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('mtf_rates_date', ratesDate);
    } catch (e) {
      console.error('Failed to save rates date to localStorage', e);
    }
  }, [ratesDate]);

  useEffect(() => {
    try {
      localStorage.setItem('mtf_show_rates_date', JSON.stringify(showRatesDate));
    } catch (e) {
      console.error('Failed to save show rates date to localStorage', e);
    }
  }, [showRatesDate]);

  const [params, setParams] = useState<TradeParams>({
    buyPrice: 0,
    sellPrice: 0,
    quantity: 0,
    ownCapital: 0,
    zerodhaFunded: 0,
    growwFunded: 0,
    holdingDays: 1,
    zerodhaDailyRate: 0.0493, // ~18% p.a.
    growwDailyRate: 0.0410, // ~14.95% p.a.
  });

  const hasInput = params.buyPrice > 0 && params.sellPrice > 0 && params.quantity > 0;

  const zerodhaCharges = useMemo(() => calculateCharges('zerodha', params), [params]);
  const growwCharges = useMemo(() => calculateCharges('groww', params), [params]);

  const zerodhaWinner = hasInput && zerodhaCharges.netPnL > growwCharges.netPnL;
  const growwWinner = hasInput && growwCharges.netPnL > zerodhaCharges.netPnL;

  const [savedToast, setSavedToast] = useState(false);

  const handleSaveToHistory = (stockSymbol = 'TRADE') => {
    if (!hasInput) return;
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      params: { ...params },
      stockSymbol: stockSymbol || 'TRADE',
    };
    setHistory(prev => [newEntry, ...prev]);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleNewCalculation = () => {
    if (hasInput) {
      handleSaveToHistory();
    }
    setParams({
      buyPrice: 0,
      sellPrice: 0,
      quantity: 0,
      ownCapital: 0,
      zerodhaFunded: 0,
      growwFunded: 0,
      holdingDays: 1,
      zerodhaDailyRate: params.zerodhaDailyRate || 0.0493,
      growwDailyRate: params.growwDailyRate || 0.0410,
    });
    setActiveTab('Calculator');
  };

  const handleLoadHistory = (loadedParams: TradeParams) => {
    setParams(loadedParams);
    setActiveTab('Calculator');
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleUpdateSettings = (newParams: Partial<TradeParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const renderNavButton = (tab: Tab, icon: string) => {
    const isActive = activeTab === tab;
    const baseClasses = "flex items-center gap-3 rounded-lg px-4 py-3 mx-2 transition-all cursor-pointer select-none";
    
    if (isActive) {
      return (
        <div 
          onClick={() => setActiveTab(tab)}
          className={`${baseClasses} bg-[#fdfd00] dark:bg-[#d4cb00]/20 text-on-primary-container dark:text-[#d4cb00] scale-[0.98]`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? '"FILL" 1' : '' }}>{icon}</span>
          <span className="text-sm font-bold tracking-wide">{tab}</span>
        </div>
      );
    }
    
    return (
      <div 
        onClick={() => setActiveTab(tab)}
        className={`${baseClasses} text-[#5f6368] dark:text-[#9e9e9e] font-medium hover:bg-surface-variant dark:hover:bg-[#2a2a2a]`}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-sm">{tab}</span>
      </div>
    );
  };

  const renderMobileNavButton = (tab: Tab, label: string, icon: string) => {
    const isActive = activeTab === tab;
    return (
      <div 
        onClick={() => setActiveTab(tab)}
        className={`flex flex-col items-center justify-center transition-all cursor-pointer w-full h-full ${isActive ? 'text-primary dark:text-[#d4cb00] font-bold scale-95 tracking-wide' : 'text-[#5f6368] dark:text-[#9e9e9e] font-medium hover:bg-surface-container-highest dark:hover:bg-[#2a2a2a]'}`}
      >
        <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: isActive ? '"FILL" 1' : '' }}>{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex overflow-hidden min-h-screen">
      {/* Top Navigation (Mobile only, hidden on lg) */}
      <nav className="lg:hidden fixed top-0 w-full z-50 flex justify-between items-center px-margin py-3 max-w-container-max mx-auto bg-[#f4f4ef] dark:bg-[#1a1a1a] border-b border-outline-variant dark:border-[#3a3a3a]">
        <div className="flex items-center gap-2.5">
          <Logo className="w-7 h-7 rounded-md shadow-sm shrink-0" size={28} />
          <span className="text-lg font-bold text-on-surface dark:text-[#e0e0e0] tracking-wide">MTF Pro</span>
        </div>
        <div className="flex gap-2 items-center">
          {activeTab === 'Calculator' && (
            <button 
              onClick={() => handleSaveToHistory()}
              disabled={!hasInput}
              className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                hasInput 
                  ? 'text-primary dark:text-[#d4cb00] bg-primary/10 dark:bg-[#d4cb00]/15 cursor-pointer' 
                  : 'text-[#888] opacity-40 cursor-not-allowed'
              }`}
              title={hasInput ? "Save Calculation to History" : "Enter trade values to save"}
            >
              <span className="material-symbols-outlined text-base">{savedToast ? 'bookmark_added' : 'bookmark'}</span>
            </button>
          )}
          <DownloadAppButton variant="nav" />
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="material-symbols-outlined text-primary dark:text-[#d4cb00] cursor-pointer transition-colors duration-200 text-base p-1"
          >
            {darkMode ? 'light_mode' : 'dark_mode'}
          </button>
          <span 
            onClick={() => setSupportOpen(true)}
            className="material-symbols-outlined text-primary dark:text-[#d4cb00] cursor-pointer text-base p-1"
          >
            account_circle
          </span>
        </div>
      </nav>

      {/* Side Navigation (Desktop only) */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 py-panel-padding bg-[#f4f4ef] dark:bg-[#1a1a1a] border-r border-outline-variant dark:border-[#3a3a3a] w-64 z-40 transition-colors duration-300">
        <div className="px-6 mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 rounded-lg shadow-sm shrink-0" size={32} />
            <h2 className="text-[18px] font-bold text-primary dark:text-[#d4cb00] leading-none tracking-wide">MTF Pro</h2>
          </div>
          <button 
            onClick={handleNewCalculation}
            className="mt-4 bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary dark:hover:bg-[#f1e800] transition-colors shadow-sm w-full flex justify-center items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span> New Calculation
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {renderNavButton('Calculator', 'calculate')}
          {renderNavButton('Comparison', 'compare_arrows')}
          {renderNavButton('Break-Even', 'trending_up')}
          {renderNavButton('Simulator', 'query_stats')}
          {renderNavButton('History', 'history')}
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant dark:border-[#3a3a3a] mx-4">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-3 text-[#5f6368] dark:text-[#9e9e9e] font-medium hover:bg-surface-variant dark:hover:bg-[#2a2a2a] rounded-lg px-2 py-2 hover:text-primary dark:hover:text-[#d4cb00] transition-colors w-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            <span className="text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('Settings')}
            className={`flex items-center gap-3 rounded-lg px-2 py-2 transition-colors w-full text-left cursor-pointer ${activeTab === 'Settings' ? 'text-primary dark:text-[#d4cb00] font-bold' : 'text-[#5f6368] dark:text-[#9e9e9e] hover:bg-surface-variant dark:hover:bg-[#2a2a2a] hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="text-sm">Settings</span>
          </button>

          <DownloadAppButton variant="sidebar" />
          
          <button 
            onClick={() => setSupportOpen(true)}
            className="flex items-center gap-3 text-[#5f6368] dark:text-[#9e9e9e] font-medium hover:bg-surface-variant dark:hover:bg-[#2a2a2a] rounded-lg px-2 py-2 hover:text-primary dark:hover:text-[#d4cb00] transition-colors w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="text-sm">Support</span>
          </button>
          
          <div className="mt-4 px-2 text-xs font-medium text-[#5f6368] dark:text-[#777]">
            Made by Ashwin S ❤️
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 h-screen overflow-y-auto pt-20 lg:pt-0 p-4 lg:p-gutter">
        <div className="max-w-container-max mx-auto h-full flex flex-col gap-gutter">

          {/* Header */}
          <header className="justify-between items-end pb-4 border-b border-outline-variant dark:border-[#3a3a3a] hidden lg:flex">
            <div>
              <h1 className="text-headline-lg font-bold text-on-surface dark:text-[#e0e0e0] tracking-wide">
                {activeTab === 'Calculator' && 'Dashboard'}
                {activeTab === 'Comparison' && 'Broker Comparison'}
                {activeTab === 'Break-Even' && 'Break-Even & Targets'}
                {activeTab === 'Simulator' && 'Scenario Simulator'}
                {activeTab === 'History' && 'Calculation History'}
                {activeTab === 'Settings' && 'Configuration & Rates'}
              </h1>
              <p className="text-[#5f6368] dark:text-[#9e9e9e] text-sm mt-1">
                {activeTab === 'Calculator' && 'Detailed comparison for MTF trades.'}
                {activeTab === 'Comparison' && 'Side-by-side cost and feature analysis between Zerodha & Groww.'}
                {activeTab === 'Break-Even' && 'Target profit price calculation and break-even spread.'}
                {activeTab === 'Simulator' && 'Simulate multi-day price movements and holding costs.'}
                {activeTab === 'History' && 'Past saved calculations stored locally in your browser.'}
                {activeTab === 'Settings' && 'Adjust default broker interest rates, effective dates, and display options.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'Calculator' && (
                <button
                  onClick={() => handleSaveToHistory()}
                  disabled={!hasInput}
                  title={hasInput ? "Save Calculation to History" : "Enter Buy Price, Sell Price & Quantity to save"}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                    hasInput
                      ? 'bg-primary/10 dark:bg-[#d4cb00]/15 text-primary dark:text-[#d4cb00] hover:bg-primary/20 cursor-pointer shadow-xs active:scale-95'
                      : 'bg-surface-container-highest/70 dark:bg-[#2a2a2a] text-[#888] dark:text-[#666] opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{savedToast ? 'bookmark_added' : 'bookmark'}</span>
                  <span>{savedToast ? 'Saved to History!' : 'Save Calculation'}</span>
                </button>
              )}
              {showRatesDate && (
                <div 
                  onClick={() => setActiveTab('Settings')}
                  title="Click to change or hide in Settings"
                  className="text-[12px] font-medium text-[#5f6368] dark:text-[#9e9e9e] flex items-center gap-1 cursor-pointer hover:text-primary dark:hover:text-[#d4cb00] transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">history</span> Rates last updated: {ratesDate}
                </div>
              )}
            </div>
          </header>

          {/* Active Tab Views */}
          {activeTab === 'Calculator' && (
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-gutter flex-1 auto-rows-min pb-24 lg:pb-4">
              {/* Left Column: Trade Parameters (Spans 4 cols on lg) */}
              <TradeInputForm params={params} onChange={setParams} onSave={handleSaveToHistory} savedToast={savedToast} />

              {/* Center & Right: Dashboard Main Area (Spans 8 cols on lg) */}
              <div className="col-span-4 md:col-span-8 lg:col-span-8 flex flex-col gap-gutter">
                {/* Quick Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <BrokerSummaryCard
                    brokerName="Zerodha"
                    isWinner={zerodhaWinner}
                    charges={zerodhaCharges}
                    hasInput={hasInput}
                  />
                  <BrokerSummaryCard
                    brokerName="Groww"
                    isWinner={growwWinner}
                    charges={growwCharges}
                    hasInput={hasInput}
                  />
                </div>

                {/* Break-Even & Targets */}
                <div className="bento-card pt-16 shadow-sm">
                  <span className="bento-label">Break-Even &amp; Targets</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="bg-[#f8f8f4] dark:bg-[#2a2a2a] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
                      <div className="text-xs font-medium text-[#5f6368] dark:text-[#9e9e9e] mb-1">Zerodha Break-Even</div>
                      <div className="text-xl font-bold text-on-surface dark:text-[#e0e0e0]">
                        {hasInput ? `₹${zerodhaCharges.breakEvenSellPrice.toFixed(2)}` : '--'}
                      </div>
                    </div>
                    <div className="bg-[#f0f1e5] dark:bg-[#252520] p-4 rounded-lg border border-outline-variant dark:border-[#3a3a3a]">
                      <div className="text-xs font-medium text-[#5f6368] dark:text-[#9e9e9e] mb-1">Groww Break-Even</div>
                      <div className="text-xl font-bold text-primary dark:text-[#d4cb00]">
                        {hasInput ? `₹${growwCharges.breakEvenSellPrice.toFixed(2)}` : '--'}
                      </div>
                    </div>
                    <div>
                      <label className="label-dark">Detailed Break-Even</label>
                      <button 
                        onClick={() => setActiveTab('Break-Even')}
                        className="w-full bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] text-xs font-bold py-2.5 px-3 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Target Calculator <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Charge Breakdown */}
                <ChargeBreakdownList
                  zerodhaCharges={zerodhaCharges}
                  growwCharges={growwCharges}
                  holdingDays={params.holdingDays}
                  zerodhaDailyRate={params.zerodhaDailyRate}
                  growwDailyRate={params.growwDailyRate}
                  hasInput={hasInput}
                />
              </div>
            </div>
          )}

          {activeTab === 'Comparison' && (
            <ComparisonPage
              params={params}
              zerodhaCharges={zerodhaCharges}
              growwCharges={growwCharges}
              hasInput={hasInput}
              onNavigateToCalc={() => setActiveTab('Calculator')}
            />
          )}

          {activeTab === 'Break-Even' && (
            <BreakEvenPage
              params={params}
              zerodhaCharges={zerodhaCharges}
              growwCharges={growwCharges}
              hasInput={hasInput}
              onNavigateToCalc={() => setActiveTab('Calculator')}
            />
          )}

          {activeTab === 'Simulator' && (
            <SimulatorPage
              params={params}
              hasInput={hasInput}
              onNavigateToCalc={() => setActiveTab('Calculator')}
            />
          )}

          {activeTab === 'History' && (
            <HistoryPage
              history={history}
              onLoad={handleLoadHistory}
              onDelete={handleDeleteHistory}
              onClear={handleClearHistory}
            />
          )}

          {activeTab === 'Settings' && (
            <SettingsPage
              params={params}
              ratesDate={ratesDate}
              showRatesDate={showRatesDate}
              onUpdateParams={handleUpdateSettings}
              onUpdateRatesDate={setRatesDate}
              onToggleShowRatesDate={setShowRatesDate}
            />
          )}
        </div>
      </main>

      {/* Support / Info Modal */}
      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#fcfcf9] dark:bg-[#1e1e1e] border border-outline-variant dark:border-[#3a3a3a] rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-on-surface dark:text-[#e0e0e0] flex items-center gap-2.5">
                <Logo className="w-6 h-6 rounded-md shrink-0" size={24} /> MTF Pro Support
              </h3>
              <button 
                onClick={() => setSupportOpen(false)}
                className="text-[#5f6368] hover:text-on-surface dark:text-[#9e9e9e] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="text-sm text-[#5f6368] dark:text-[#9e9e9e] flex flex-col gap-3">
              <p>
                <strong>MTF Trade Calculator</strong> gives swing traders accurate net profit/loss calculations by factoring in all statutory costs and MTF daily funding interest.
              </p>
              <div className="bg-surface-container-high/40 dark:bg-[#2a2a2a] p-3 rounded-lg text-xs flex flex-col gap-1 text-on-surface dark:text-[#e0e0e0]">
                <div><strong>Zerodha MTF:</strong> ~18% p.a. (~0.0493% daily) + 18% GST</div>
                <div><strong>Groww MTF:</strong> ~14.95% - 16% p.a. (~0.0410% daily)</div>
                <div><strong>DP Charges:</strong> Zerodha (₹15.93) vs Groww (₹23.60)</div>
                <div><strong>Pledge Charges:</strong> Zerodha (₹35.40) vs Groww (₹23.60)</div>
              </div>
              <p className="text-xs">
                Need help or have feature suggestions? Built with ❤️ for swing traders.
              </p>
            </div>
            <button
              onClick={() => setSupportOpen(false)}
              className="mt-6 w-full bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] font-bold py-2 rounded-lg text-sm cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Save Notification Toast */}
      {savedToast && (
        <div className="fixed bottom-20 lg:bottom-8 right-6 z-50 bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">bookmark_added</span>
          <span>Calculation saved to History!</span>
        </div>
      )}

      {/* Bottom Nav (Mobile only, hidden on lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-[#f4f4ef] dark:bg-[#1a1a1a] border-t border-outline-variant dark:border-[#3a3a3a] rounded-t-xl shadow-lg pb-safe">
        {renderMobileNavButton('Calculator', 'Calc', 'analytics')}
        {renderMobileNavButton('Comparison', 'Compare', 'compare')}
        {renderMobileNavButton('Simulator', 'Sim', 'insights')}
        {renderMobileNavButton('History', 'History', 'history')}
        <div 
          onClick={() => setDarkMode(!darkMode)}
          className="flex flex-col items-center justify-center text-[#5f6368] dark:text-[#9e9e9e] font-medium hover:bg-surface-container-highest dark:hover:bg-[#2a2a2a] transition-colors w-full h-full cursor-pointer"
        >
          <span className="material-symbols-outlined mb-1">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          <span className="text-xs">Theme</span>
        </div>
      </nav>
    </div>
  );
}

export default App;
