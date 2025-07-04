export const dataStore = {
  cryptoPrices: null,
  cryptoNews: [],
  ollamaAnalysis: null,
  systemStatus: {
    cryptoBot: { lastUpdate: null, status: 'inactive' },
    newsBot: { lastUpdate: null, status: 'inactive' },
    ollamaBot: { lastUpdate: null, status: 'inactive' },
  },
};

// Update functions for each data type
export function updateCryptoPrices(data) {
  dataStore.cryptoPrices = data;
  dataStore.systemStatus.cryptoBot.lastUpdate = new Date().toISOString();
  dataStore.systemStatus.cryptoBot.status = 'active';
  addToHistory('cryptoPrices', data);
}

export function updateCryptoNews(data) {
  dataStore.cryptoNews = data;
  dataStore.systemStatus.newsBot.lastUpdate = new Date().toISOString();
  dataStore.systemStatus.newsBot.status = 'active';
  addToHistory('cryptoNews', data);
}

export function updateOllamaAnalysis(data) {
  dataStore.ollamaAnalysis = data;
  dataStore.systemStatus.ollamaBot.lastUpdate = new Date().toISOString();
  dataStore.systemStatus.ollamaBot.status = 'active';
  addToHistory('ollamaAnalysis', data);
}

// Getter functions for API endpoints
export function getCryptoPrices() {
  return dataStore.cryptoPrices;
}

export function getCryptoNews() {
  return dataStore.cryptoNews;
}

export function getAllData() {
  return {
    cryptoPrices: dataStore.cryptoPrices,
    cryptoNews: dataStore.cryptoNews,
    ollamaAnalysis: dataStore.ollamaAnalysis,
    systemStatus: dataStore.systemStatus,
    lastUpdated: new Date().toISOString(),
  };
}
