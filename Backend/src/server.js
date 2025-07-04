import express from 'express';
import cors from 'cors';
import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getCryptoPrices,
  getCryptoNews,
  getAllData,
  updateCryptoPrices,
  updateCryptoNews,
  updateOllamaAnalysis,
} from './data/dataStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store worker references
const workers = new Map();

// Enhanced worker launcher with message handling
function launchWorker(workerName) {
  const workerPath = path.join(__dirname, 'bots', `${workerName}.js`);

  try {
    const worker = new Worker(workerPath);
    workers.set(workerName, worker);

    // Enhanced Handle messages from workers
    worker.on('message', (message) => {
      console.log(`📨 Received message from ${workerName}:`, message.type);
      console.log(`🔍 DEBUG - Message payload:`, typeof message.payload);

      switch (message.type) {
        case 'cryptoPrices':
          console.log('💰 Updating crypto prices...');
          updateCryptoPrices(message.payload);
          console.log('✅ Crypto prices updated');

          // Forward to Ollama bot if it exists
          if (workers.has('ollama')) {
            console.log('📤 Forwarding crypto prices to Ollama bot...');
            workers.get('ollama').postMessage(message);
          } else {
            console.log('❌ Ollama worker not found for forwarding crypto prices');
          }
          break;

        case 'cryptoNews':
          console.log('📰 Updating crypto news...');
          updateCryptoNews(message.payload);
          console.log('✅ Crypto news updated, count:', message.payload?.length || 0);

          // Forward to Ollama bot if it exists
          if (workers.has('ollama')) {
            console.log('📤 Forwarding crypto news to Ollama bot...');
            workers.get('ollama').postMessage(message);
          } else {
            console.log('❌ Ollama worker not found for forwarding crypto news');
          }
          break;

        case 'ollamaAnalysis':
          console.log('🧠 Updating Ollama analysis...');
          console.log('🔍 DEBUG - Analysis keys:', Object.keys(message.payload || {}));
          updateOllamaAnalysis(message.payload);
          console.log('✅ Ollama analysis updated');

          // Log the analysis content for debugging
          if (message.payload) {
            console.log('📊 Analysis timestamp:', message.payload.timestamp);
            console.log('📊 Has market sentiment:', !!message.payload.marketSentiment);
            console.log('📊 Has trading signals:', !!message.payload.tradingSignals);
            console.log('📊 Has news summary:', !!message.payload.newsSummary);
          }
          break;

        default:
          console.log(`❓ Unknown message type: ${message.type}`);
      }
    });

    worker.on('error', (error) => {
      console.error(`❌ Worker ${workerName} error:`, error);
    });

    worker.on('exit', (code) => {
      console.log(`🔄 Worker ${workerName} exited with code ${code}`);
      workers.delete(workerName);

      // Restart worker after 5 seconds
      setTimeout(() => {
        console.log(`🔄 Restarting worker ${workerName}...`);
        launchWorker(workerName);
      }, 5000);
    });

    console.log(`✅ Launched ${workerName} worker`);
    return worker;
  } catch (error) {
    console.error(`❌ Failed to launch ${workerName} worker:`, error);
    return null;
  }
}

// Launch all workers
console.log('🚀 Starting crypto analysis system...');
launchWorker('crypto');
launchWorker('cryptoNews');
launchWorker('ollama');

// // Force initial analysis after 30 seconds
// setTimeout(() => {
//   console.log('🔄 Forcing initial analysis...');

//   const cryptoPrices = getCryptoPrices();
//   const cryptoNews = getCryptoNews();

//   console.log('🔍 Available data for forced analysis:');
//   console.log('- Crypto prices:', !!cryptoPrices);
//   console.log('- Crypto news:', !!cryptoNews, 'count:', cryptoNews?.length || 0);

//   if (workers.has('ollama')) {
//     if (cryptoPrices) {
//       console.log('📤 Sending crypto prices to Ollama...');
//       workers.get('ollama').postMessage({
//         type: 'cryptoPrices',
//         payload: cryptoPrices,
//       });
//     }

//     if (cryptoNews && cryptoNews.length > 0) {
//       console.log('📤 Sending crypto news to Ollama...');
//       workers.get('ollama').postMessage({
//         type: 'cryptoNews',
//         payload: cryptoNews,
//       });
//     }

//     console.log('✅ Forced data sent to Ollama bot');
//   } else {
//     console.log('❌ Ollama worker not available for forced analysis');
//   }
// }, 30000); // Wait 30 seconds for workers to initialize and gather data

// Original API endpoints
app.get('/crypto-prices', (req, res) => {
  const prices = getCryptoPrices();
  res.json(prices || {});
});

app.get('/crypto-news', (req, res) => {
  const news = getCryptoNews();
  res.json(news || []);
});

// All data endpoint (enhanced)
app.get('/all-data', (req, res) => {
  res.json(getAllData());
});

app.post('/analyze-selection', async (req, res) => {
  try {
    const { coin, news } = req.body;

    // Validate input
    if (!coin || !news) {
      return res.status(400).json({
        error: 'Both coin and news data are required',
      });
    }

    console.log('🎯 Selective analysis request:', {
      coin: coin.symbol,
      newsTitle: news.title.substring(0, 50) + '...',
    });

    // Create focused analysis request for Ollama
    const analysisRequest = {
      type: 'selectiveAnalysis',
      payload: {
        coin: {
          symbol: coin.symbol,
          name: coin.name,
          price: coin.price,
          change24h: coin.change24h,
          marketCap: coin.marketCap,
        },
        news: {
          title: news.title,
          description: news.description,
          published: news.published,
        },
        timestamp: new Date().toISOString(),
      },
    };

    // Send to Ollama worker for analysis
    if (workers.has('ollama')) {
      // Create a promise to wait for the analysis result
      const analysisPromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Analysis timeout after 30 seconds'));
        }, 30000);

        // Store the resolve function to call when we get the result
        const messageHandler = (message) => {
          if (message.type === 'selectiveAnalysisResult') {
            clearTimeout(timeoutId);
            workers.get('ollama').off('message', messageHandler);
            resolve(message.payload);
          }
        };

        workers.get('ollama').on('message', messageHandler);
        workers.get('ollama').postMessage(analysisRequest);
      });

      const result = await analysisPromise;

      console.log('✅ Selective analysis completed');
      res.json(result);
    } else {
      res.status(503).json({
        error: 'Analysis service not available',
        message: 'Ollama worker is not running',
      });
    }
  } catch (error) {
    console.error('❌ Selective analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');

  workers.forEach((worker, name) => {
    console.log(`🔄 Terminating ${name} worker...`);
    worker.terminate();
  });

  process.exit(0);
});

// app.listen(port, () => {
//   console.log(`🟢 Enhanced API server running at http://localhost:${port}`);
//   console.log(`📊 Dashboard: http://localhost:${port}/dashboard`);
//   console.log(`🤖 AI Analysis: http://localhost:${port}/ai-analysis`);
//   console.log(`💡 Trading Signals: http://localhost:${port}/trading-signals`);
//   console.log(`📰 News Summary: http://localhost:${port}/news-summary`);
//   console.log(`❤️  Health Check: http://localhost:${port}/health`);
//   console.log(`🧪 Test Ollama: http://localhost:${port}/test-ollama`);
//   console.log(`🔍 Debug DataStore: http://localhost:${port}/debug-datastore`);
// });

// // Manual trigger endpoints (for testing)
// app.post('/trigger-analysis', async (req, res) => {
//   if (workers.has('ollama')) {
//     const cryptoPrices = getCryptoPrices();
//     const cryptoNews = getCryptoNews();

//     // Send current data to Ollama bot for immediate analysis
//     if (cryptoPrices) {
//       workers.get('ollama').postMessage({
//         type: 'cryptoPrices',
//         payload: cryptoPrices,
//       });
//     }

//     if (cryptoNews) {
//       workers.get('ollama').postMessage({
//         type: 'cryptoNews',
//         payload: cryptoNews,
//       });
//     }

//     res.json({
//       message: 'Analysis triggered successfully',
//       timestamp: new Date().toISOString(),
//     });
//   } else {
//     res.status(503).json({
//       error: 'Ollama worker not available',
//     });
//   }
// });

// // Health check endpoint
// app.get('/health', (req, res) => {
//   const health = {
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     workers: {
//       crypto: workers.has('crypto'),
//       cryptoNews: workers.has('cryptoNews'),
//       ollama: workers.has('ollama'),
//     },
//     dataStatus: {
//       hasPrices: !!getCryptoPrices(),
//       hasNews: !!(getCryptoNews() && getCryptoNews().length > 0),
//       hasAnalysis: !!getOllamaAnalysis(),
//     },
//   };

//   res.json(health);
// });

// // TEST OLLAMA ENDPOINT - For debugging Ollama connection
// app.get('/test-ollama', async (req, res) => {
//   try {
//     const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
//     const model = process.env.OLLAMA_MODEL || 'llama3.2';

//     console.log('🧪 Testing Ollama connection...');
//     console.log('🔍 Ollama URL:', ollamaUrl);
//     console.log('🔍 Model:', model);

//     const response = await fetch(`${ollamaUrl}/api/generate`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: model,
//         prompt: 'Hello, this is a test. Please respond with "Ollama is working correctly"',
//         stream: false,
//         options: {
//           temperature: 0.1,
//           max_tokens: 50,
//         },
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Ollama API error: ${response.status}`);
//     }

//     const data = await response.json();

//     res.json({
//       success: true,
//       ollamaResponse: data.response,
//       ollamaUrl,
//       model,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error('❌ Ollama test failed:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
//       model: process.env.OLLAMA_MODEL || 'llama3.2',
//     });
//   }
// });

// // DEBUG DATASTORE ENDPOINT - For debugging data availability
// app.get('/debug-datastore', (req, res) => {
//   const analysis = getOllamaAnalysis();
//   res.json({
//     hasAnalysis: !!analysis,
//     analysisKeys: analysis ? Object.keys(analysis) : [],
//     analysisTimestamp: analysis?.timestamp,
//     dataQuality: analysis?.dataQuality,
//     cryptoPricesAvailable: !!getCryptoPrices(),
//     cryptoNewsAvailable: !!getCryptoNews(),
//     cryptoNewsCount: getCryptoNews()?.length || 0,
//     rawAnalysis: analysis, // Include full analysis for debugging
//   });
// });
