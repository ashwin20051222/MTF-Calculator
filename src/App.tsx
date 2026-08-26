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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const handleSaveToHistory = (stockSymbol = 'TRADE') => {
    if (!hasInput) {
      setSaveAlert("Please enter Quantity, Buy Price & Sell Price to save!");
      setTimeout(() => setSaveAlert(null), 3000);
      return;
    }
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
    // Only reset parameters - never auto-save to history
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
      <nav className="lg:hidden fixed top-0 w-full z-50 flex justify-between items-center px-3 py-2.5 max-w-container-max mx-auto bg-[#f4f4ef] dark:bg-[#1a1a1a] border-b border-outline-variant dark:border-[#3a3a3a] shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 rounded-lg text-on-surface dark:text-[#e0e0e0] hover:bg-surface-variant dark:hover:bg-[#2a2a2a] cursor-pointer flex items-center justify-center"
            title="Open Menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <div 
            onClick={() => { setActiveTab('Calculator'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Logo className="w-7 h-7 rounded-md shadow-xs shrink-0" size={28} />
            <span className="text-base font-bold text-on-surface dark:text-[#e0e0e0] tracking-wide">MTF Pro</span>
          </div>
        </div>

        <div className="flex gap-1.5 items-center">
          <button
            onClick={handleNewCalculation}
            className="flex items-center gap-1 bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] px-2.5 py-1 rounded-full text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
            title="Start New Calculation"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New</span>
          </button>
          
          <button 
            onClick={() => handleSaveToHistory()}
            className="p-1.5 rounded-full flex items-center justify-center text-[#6b6d13] dark:text-[#d4cb00] bg-[#6b6d13]/10 dark:bg-[#d4cb00]/15 active:scale-95 cursor-pointer border border-[#6b6d13]/20"
            title="Save Calculation to History"
          >
            <span className="material-symbols-outlined text-sm">{savedToast ? 'bookmark_added' : 'bookmark'}</span>
          </button>

          <DownloadAppButton variant="nav" />
        </div>
      </nav>

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-[#fcfcf9] dark:bg-[#1e1e1e] h-full shadow-2xl z-10 flex flex-col p-5 animate-in slide-in-from-left duration-200 border-r border-outline-variant dark:border-[#3a3a3a]">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant dark:border-[#3a3a3a] mb-4">
              <div className="flex items-center gap-3">
                <Logo className="w-8 h-8 rounded-lg shadow-xs shrink-0" size={32} />
                <div>
                  <h2 className="text-base font-bold text-primary dark:text-[#d4cb00] leading-none">MTF Pro</h2>
                  <span className="text-[11px] text-[#5f6368] dark:text-[#9e9e9e]">Trade Calculator</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#5f6368] hover:text-on-surface dark:text-[#9e9e9e] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* New Calculation Action */}
            <button 
              onClick={() => {
                handleNewCalculation();
                setMobileMenuOpen(false);
              }}
              className="bg-[#6b6d13] dark:bg-[#d4cb00] text-on-primary dark:text-[#1a1a00] text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-primary transition-all shadow-sm w-full flex justify-center items-center gap-2 cursor-pointer mb-4 active:scale-98"
            >
              <span className="material-symbols-outlined text-sm">add</span> New Calculation
            </button>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
              {[
                { tab: 'Calculator' as Tab, label: 'Calculator', icon: 'calculate' },
                { tab: 'Comparison' as Tab, label: 'Broker Comparison', icon: 'compare_arrows' },
                { tab: 'Break-Even' as Tab, label: 'Break-Even & Targets', icon: 'trending_up' },
                { tab: 'Simulator' as Tab, label: 'Scenario Simulator', icon: 'query_stats' },
                { tab: 'History' as Tab, label: `History (${history.length})`, icon: 'history' },
                { tab: 'Settings' as Tab, label: 'Settings & Rates', icon: 'settings' },
              ].map(({ tab, label, icon }) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#fdfd00]/20 text-[#6b6d13] dark:text-[#d4cb00] border border-[#6b6d13]/20 dark:border-[#d4cb00]/20'
                        : 'text-on-surface-variant dark:text-[#bbb] hover:bg-surface-variant dark:hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-outline-variant dark:border-[#3a3a3a] flex flex-col gap-2 mt-auto">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-3 text-xs font-semibold text-[#5f6368] dark:text-[#9e9e9e] hover:bg-surface-variant dark:hover:bg-[#2a2a2a] rounded-lg px-3 py-2 cursor-pointer w-full text-left"
              >
                <span className="material-symbols-outlined text-base">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>

              <button 
                onClick={() => {
                  setSupportOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-xs font-semibold text-[#5f6368] dark:text-[#9e9e9e] hover:bg-surface-variant dark:hover:bg-[#2a2a2a] rounded-lg px-3 py-2 cursor-pointer w-full text-left"
              >
                <span className="material-symbols-outlined text-base">help</span>
                <span>Support & Info</span>
              </button>

              <div className="text-[10px] text-[#777] px-3 pt-1">
                Rates: {ratesDate} • Built for Swing Traders
              </div>
            </div>
          </div>
        </div>
      )}

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
      <main className="flex-1 lg:ml-64 h-screen overflow-y-auto px-4 pt-16 pb-28 lg:pt-6 lg:px-gutter lg:pb-6">
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
            <div className="flex items-center gap-2.5">
              <DownloadAppButton variant="nav" />
              <button
                type="button"
                onClick={() => handleSaveToHistory()}
                className="flex items-center gap-1.5 bg-[#6b6d13]/10 dark:bg-[#d4cb00]/15 text-[#6b6d13] dark:text-[#d4cb00] px-3 py-1 rounded-full text-xs font-bold hover:bg-[#6b6d13]/20 transition-all border border-[#6b6d13]/30 dark:border-[#d4cb00]/30 shadow-xs cursor-pointer active:scale-95"
                title="Save Calculation to History"
              >
                <span className="material-symbols-outlined text-sm">{savedToast ? 'bookmark_added' : 'bookmark'}</span>
                <span>{savedToast ? 'Saved!' : 'Save Calculation'}</span>
              </button>
              {showRatesDate && (
                <div 
                  onClick={() => setActiveTab('Settings')}
                  title="Click to change or hide in Settings"
                  className="text-[12px] font-medium text-[#5f6368] dark:text-[#9e9e9e] flex items-center gap-1 cursor-pointer hover:text-primary dark:hover:text-[#d4cb00] transition-colors ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">history</span> Rates last updated: {ratesDate}
                </div>
              )}
            </div>
          </header>

          {/* Active Tab Views */}
          {activeTab === 'Calculator' && (
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-gutter flex-1 auto-rows-min">
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

      {/* Save Alert Toast */}
      {saveAlert && (
        <div className="fixed bottom-20 lg:bottom-8 right-6 z-50 bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">warning</span>
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Bottom Nav (Mobile only, hidden on lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex justify-between items-center h-16 bg-[#f4f4ef] dark:bg-[#1a1a1a] border-t border-outline-variant dark:border-[#3a3a3a] shadow-lg pb-safe px-1">
        {renderMobileNavButton('Calculator', 'Calc', 'calculate')}
        {renderMobileNavButton('Comparison', 'Compare', 'compare_arrows')}
        {renderMobileNavButton('Break-Even', 'Targets', 'trending_up')}
        {renderMobileNavButton('Simulator', 'Sim', 'query_stats')}
        {renderMobileNavButton('History', 'History', 'history')}
        {renderMobileNavButton('Settings', 'Settings', 'settings')}
      </nav>
    </div>
  );
}

export default App;
