# 📈 MTF Pro — Margin Trading Facility (MTF) Trade Calculator

A modern, high-precision financial analytics tool built for Indian stock market swing traders. Accurately calculate, compare, and simulate net profit/loss, statutory taxes, and daily interest costs for **Margin Trading Facility (MTF)** trades across **Zerodha** and **Groww**.

---

## 🚀 Live Demo

🔗 **[Launch MTF Calculator Web App](https://yourusername.github.io/your-repo-name/)**

---

## ✨ Features

- **⚡ Real-Time Net P&L Engine**: Computes exact net profits, ROI on own capital, and statutory charges before taking leverage.
- **⚖️ Zerodha vs Groww Comparison**: Side-by-side breakdown of MTF daily interest rates, DP charges, and pledge/unpledge costs.
- **🎯 Break-Even & Target Price Calculator**: Pinpoint the exact target price needed to cover all taxes, brokerages, and daily interest to lock in target gains.
- **📊 Multi-Day Holding Cost Simulator**: Interactive simulation of how holding duration (1 to 90+ days) impacts profitability and capital returns.
- **📜 Trade History & Offline Storage**: Save, reload, and organize past trade scenarios locally in your browser.
- **⚙️ Custom Rates & Settings**: Easily customize annual/daily interest rates and effective rate update stamps.
- **🌓 Dark & Light Mode**: Responsive, clean interface optimized for both desktop and mobile trading workflows.

---

## 🧮 Cost Breakdown Included

| Charge Category | Zerodha MTF | Groww MTF |
| :--- | :--- | :--- |
| **MTF Daily Interest Rate** | ~18.00% p.a. (~0.0493%/day) + 18% GST | ~14.95%–16.00% p.a. (~0.0410%/day) |
| **Brokerage** | ₹20 or 0.03% (whichever is lower) | ₹20 or 0.05% (whichever is lower) |
| **STT / CTT** | 0.1% (Buy & Sell) | 0.1% (Buy & Sell) |
| **Exchange Transaction Fee** | NSE (0.00297%) / BSE | NSE (0.00297%) / BSE |
| **SEBI Turnover Fee** | ₹10 / Crore (0.0001%) + 18% GST | ₹10 / Crore (0.0001%) + 18% GST |
| **Stamp Duty** | 0.015% on Buy Turnover | 0.015% on Buy Turnover |
| **DP (Depository) Charges** | ₹13.50 + GST = **₹15.93** | ₹20.00 + GST = **₹23.60** |
| **Pledge / Unpledge Fee** | ₹30.00 + GST = **₹35.40** | ₹20.00 + GST = **₹23.60** |

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Material Symbols & Custom SVG Vector Assets

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/mtf-calculator.git
cd mtf-calculator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 4. Build for Production / GitHub Pages
```bash
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
