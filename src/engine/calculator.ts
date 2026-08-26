export type Broker = 'zerodha' | 'groww';

export interface TradeParams {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  ownCapital: number;
  zerodhaFunded: number;
  growwFunded: number;
  holdingDays: number;
  zerodhaDailyRate: number; // e.g. 0.0493 (18% p.a / 365)
  growwDailyRate: number; // e.g. 0.041 (14.95% p.a / 365)
}

export interface ChargeBreakdown {
  buyBrokerage: number;
  buySTT: number;
  buyExchangeTxn: number;
  buySEBI: number;
  buyStampDuty: number;
  buyGST: number;

  sellBrokerage: number;
  sellSTT: number;
  sellExchangeTxn: number;
  sellSEBI: number;
  sellGST: number;

  dpCharges: number;
  pledgeCharges: number;
  mtfInterest: number;

  totalBuyCharges: number;
  totalSellCharges: number;
  totalCharges: number;

  grossPnL: number;
  netPnL: number;
  netROI: number; // percentage
  breakEvenSellPrice: number;
}

const EXCHANGE_TXN_RATE = 0.0000297; // NSE rate 0.00297%
const SEBI_RATE = 0.000001; // Rs 10 per crore
const GST_RATE = 0.18;
const STT_RATE = 0.001; // 0.1% on delivery
const STAMP_DUTY_RATE = 0.00015; // 0.015% on buy side only

export function calculateCharges(broker: Broker, params: TradeParams): ChargeBreakdown {
  const buyValue = params.buyPrice * params.quantity;
  const sellValue = params.sellPrice * params.quantity;
  const grossPnL = sellValue - buyValue;

  let buyBrokerage = 0;
  let sellBrokerage = 0;

  if (broker === 'groww') {
    buyBrokerage = Math.min(20, buyValue * 0.0005);
    sellBrokerage = Math.min(20, sellValue * 0.0005);
  } else {
    buyBrokerage = Math.min(20, buyValue * 0.001);
    sellBrokerage = Math.min(20, sellValue * 0.001);
  }

  const buySTT = Math.round(buyValue * STT_RATE);
  const sellSTT = Math.round(sellValue * STT_RATE);

  const buyExchangeTxn = buyValue * EXCHANGE_TXN_RATE;
  const sellExchangeTxn = sellValue * EXCHANGE_TXN_RATE;

  const buySEBI = buyValue * SEBI_RATE;
  const sellSEBI = sellValue * SEBI_RATE;

  const buyStampDuty = Math.round(buyValue * STAMP_DUTY_RATE);

  const buyGST = (buyBrokerage + buyExchangeTxn + buySEBI) * GST_RATE;
  const sellGST = (sellBrokerage + sellExchangeTxn + sellSEBI) * GST_RATE;

  const dpBase = 13.5;
  const dpCharges = dpBase + (dpBase * GST_RATE);

  let pledgeBase = 0;
  if (broker === 'zerodha') {
    pledgeBase = 30; // 15 pledge + 15 unpledge
  } else if (broker === 'groww') {
    pledgeBase = 20; // 20 per request
  }
  const pledgeCharges = pledgeBase + (pledgeBase * GST_RATE);

  const fundedAmount = broker === 'zerodha' ? params.zerodhaFunded : params.growwFunded;
  const dailyRate = broker === 'zerodha' ? params.zerodhaDailyRate : params.growwDailyRate;
  const mtfInterest = fundedAmount * (dailyRate / 100) * params.holdingDays;

  const totalBuyCharges = buyBrokerage + buySTT + buyExchangeTxn + buySEBI + buyStampDuty + buyGST;
  const totalSellCharges = sellBrokerage + sellSTT + sellExchangeTxn + sellSEBI + sellGST + dpCharges + pledgeCharges + mtfInterest;
  
  const totalCharges = totalBuyCharges + totalSellCharges;
  const netPnL = grossPnL - totalCharges;
  const netROI = params.ownCapital > 0 ? (netPnL / params.ownCapital) * 100 : 0;

  const fixedAndBuyCharges = buyValue + totalBuyCharges + dpCharges + pledgeCharges + mtfInterest;
  
  let breakEvenSellPrice = params.buyPrice;
  let testSellValue = breakEvenSellPrice * params.quantity;
  for (let i = 0; i < 5; i++) {
    let sB = 0;
    if (broker === 'groww') {
      sB = Math.min(20, testSellValue * 0.0005);
    } else {
      sB = Math.min(20, testSellValue * 0.001);
    }
    const sSTT = Math.round(testSellValue * STT_RATE);
    const sTxn = testSellValue * EXCHANGE_TXN_RATE;
    const sSEBI = testSellValue * SEBI_RATE;
    const sGST = (sB + sTxn + sSEBI) * GST_RATE;
    const sCharges = sB + sSTT + sTxn + sSEBI + sGST;
    
    const requiredSellValue = fixedAndBuyCharges + sCharges;
    breakEvenSellPrice = requiredSellValue / params.quantity;
    testSellValue = breakEvenSellPrice * params.quantity;
  }

  return {
    buyBrokerage,
    buySTT,
    buyExchangeTxn,
    buySEBI,
    buyStampDuty,
    buyGST,

    sellBrokerage,
    sellSTT,
    sellExchangeTxn,
    sellSEBI,
    sellGST,

    dpCharges,
    pledgeCharges,
    mtfInterest,

    totalBuyCharges,
    totalSellCharges,
    totalCharges,

    grossPnL,
    netPnL,
    netROI,
    breakEvenSellPrice
  };
}
