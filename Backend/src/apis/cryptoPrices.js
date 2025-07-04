const API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,polkadot,chainlink,avalanche-2,dogecoin,binancecoin&vs_currencies=usd,inr&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true';

export async function fetchCryptoPrices() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('🔍 API Response received for coins:', Object.keys(data));

    const getCoinData = (coinData) => {
      if (coinData && typeof coinData === 'object') {
        return {
          usd: coinData.usd || 0,
          inr: coinData.inr || 0,

          usd_market_cap: coinData.usd_market_cap || 0,
          inr_market_cap: coinData.inr_market_cap || 0,

          usd_24h_vol: coinData.usd_24h_vol || 0,
          inr_24h_vol: coinData.inr_24h_vol || 0,

          usd_24h_change: coinData.usd_24h_change || 0,
          inr_24h_change: coinData.inr_24h_change || 0,

          last_updated_at: coinData.last_updated_at || Date.now() / 1000,
        };
      }
      return null;
    };

    return {
      bitcoin: getCoinData(data.bitcoin),
      ethereum: getCoinData(data.ethereum),
      solana: getCoinData(data.solana),
      cardano: getCoinData(data.cardano),
      polkadot: getCoinData(data.polkadot),
      chainlink: getCoinData(data.chainlink),
      avalanche: getCoinData(data['avalanche-2']), // API uses 'avalanche-2'
      dogecoin: getCoinData(data.dogecoin),
      binancecoin: getCoinData(data.binancecoin),
    };
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return null;
  }
}
