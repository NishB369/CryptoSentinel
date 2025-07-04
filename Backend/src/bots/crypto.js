import { parentPort } from 'worker_threads';
import rest from '../utils/rest.js';
import { operation } from '../config.js';
import sleep from '../utils/sleep.js';
import filelog from '../utils/filelog.js';
import { fetchCryptoPrices } from '../apis/cryptoPrices.js';

// Helper function to format percentage with color indicators
function formatPercentage(value) {
  if (!value || isNaN(value)) return 'N/A';
  const formatted = value.toFixed(2);
  const indicator = value >= 0 ? '📈' : '📉';
  const sign = value >= 0 ? '+' : '';
  return `${indicator} ${sign}${formatted}%`;
}

// Helper function to format large numbers
function formatLargeNumber(value) {
  if (!value || isNaN(value)) return 'N/A';

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

// Helper function to format price display
function formatPrice(usd, inr) {
  if (!usd || !inr) return 'N/A';

  if (usd > 1000) {
    return `₹${inr.toLocaleString()} / $${usd.toLocaleString()}`;
  } else if (usd > 1) {
    return `₹${inr.toFixed(2)} / $${usd.toFixed(2)}`;
  } else {
    return `₹${inr.toFixed(4)} / $${usd.toFixed(6)}`;
  }
}

async function run() {
  const { wakeUpTimeMs, workTimeMs, workWaitMs } = operation;

  const restTime = rest(wakeUpTimeMs, workTimeMs);
  if (restTime > 0) {
    filelog('BOT_CRYPTO_SLEEP');
    await sleep(restTime);
    filelog('BOT_CRYPTO_AWAKE');
  }

  filelog('BOT_CRYPTO_RESTING');
  await sleep(workWaitMs);
  filelog('BOT_CRYPTO_WORKING');

  const prices = await fetchCryptoPrices();
  if (prices) {
    parentPort.postMessage({
      type: 'cryptoPrices',
      payload: prices,
    });

    // Cmd Logs to Track
    // console.log('🚀 Crypto Market Update:');
    // console.log('═'.repeat(80));

    // const coins = [
    //   { symbol: 'BTC', name: 'bitcoin', data: prices.bitcoin, fullName: 'Bitcoin' },
    //   { symbol: 'ETH', name: 'ethereum', data: prices.ethereum, fullName: 'Ethereum' },
    //   { symbol: 'SOL', name: 'solana', data: prices.solana, fullName: 'Solana' },
    //   { symbol: 'ADA', name: 'cardano', data: prices.cardano, fullName: 'Cardano' },
    //   { symbol: 'DOT', name: 'polkadot', data: prices.polkadot, fullName: 'Polkadot' },
    //   { symbol: 'LINK', name: 'chainlink', data: prices.chainlink, fullName: 'Chainlink' },
    //   { symbol: 'AVAX', name: 'avalanche', data: prices.avalanche, fullName: 'Avalanche' },
    // ];

    // coins.forEach((coin, index) => {
    //   if (coin.data && coin.data.usd && coin.data.inr) {
    //     const { usd, inr, usd_24h_change, usd_market_cap, usd_24h_vol } = coin.data;

    //     console.log(`\n${index + 1}. ${coin.fullName} (${coin.symbol})`);
    //     console.log(`   💰 Price: ${formatPrice(usd, inr)}`);
    //     console.log(`   📊 24h Change: ${formatPercentage(usd_24h_change)}`);
    //     console.log(`   🏪 Market Cap: ${formatLargeNumber(usd_market_cap)}`);
    //     console.log(`   📈 24h Volume: ${formatLargeNumber(usd_24h_vol)}`);

    //     const changeIndicator = usd_24h_change >= 0 ? '🟢' : '🔴';
    //     console.log(`   ${changeIndicator} Status: ${usd_24h_change >= 0 ? 'Bullish' : 'Bearish'}`);
    //   } else {
    //     console.log(`\n${index + 1}. ${coin.fullName} (${coin.symbol})`);
    //     console.log(`   ❌ Data not available`);
    //   }
    // });

    // // Market summary
    // console.log('\n' + '═'.repeat(80));
    // console.log('📊 MARKET SUMMARY');
    // console.log('─'.repeat(40));

    // let totalMarketCap = 0;
    // let totalVolume = 0;
    // let gainers = 0;
    // let losers = 0;

    // coins.forEach((coin) => {
    //   if (
    //     coin.data &&
    //     coin.data.usd_market_cap &&
    //     coin.data.usd_24h_vol &&
    //     coin.data.usd_24h_change !== null
    //   ) {
    //     totalMarketCap += coin.data.usd_market_cap;
    //     totalVolume += coin.data.usd_24h_vol;

    //     if (coin.data.usd_24h_change > 0) {
    //       gainers++;
    //     } else if (coin.data.usd_24h_change < 0) {
    //       losers++;
    //     }
    //   }
    // });

    // console.log(`🏪 Total Market Cap: ${formatLargeNumber(totalMarketCap)}`);
    // console.log(`📈 Total 24h Volume: ${formatLargeNumber(totalVolume)}`);
    // console.log(
    //   `🟢 Gainers: ${gainers} | 🔴 Losers: ${losers} | ⚪ Neutral: ${7 - gainers - losers}`,
    // );

    // // Market sentiment
    // const bullishRatio = gainers / 7;
    // let sentiment = '';
    // if (bullishRatio >= 0.7) {
    //   sentiment = '🚀 Very Bullish';
    // } else if (bullishRatio >= 0.5) {
    //   sentiment = '📈 Bullish';
    // } else if (bullishRatio >= 0.3) {
    //   sentiment = '⚖️ Mixed';
    // } else {
    //   sentiment = '📉 Bearish';
    // }

    // console.log(`🎯 Market Sentiment: ${sentiment}`);
    // console.log(
    //   `⏰ Updated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
    // );
    // console.log('═'.repeat(80));
  } else {
    console.log('❌ Failed to fetch crypto prices');
    filelog('CRYPTO_FETCH_ERROR', { timestamp: new Date().toISOString() });
  }

  await sleep(60000);
  run();
}

filelog('BOT_CRYPTO_RUN');
run();
