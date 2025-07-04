import { parentPort } from 'worker_threads';
import rest from '../utils/rest.js';
import { operation } from '../config.js';
import sleep from '../utils/sleep.js';
import filelog from '../utils/filelog.js';

class OllamaAnalyzer {
  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
    this.isAnalyzing = false;
    this.analysisStatus = 'idle';
    this.statusMessage = 'Waiting for data...';
    this.startTime = null;
    this.lastAnalysisTime = null;
    this.analysisCount = 0;
    this.errorCount = 0;
  }

  updateStatus(status, message, progress = 0) {
    this.analysisStatus = status;
    this.statusMessage = message;

    const statusData = {
      status: this.analysisStatus,
      message: this.statusMessage,
      isAnalyzing: this.isAnalyzing,
      progress: progress,
      elapsedTime: this.startTime ? (Date.now() - this.startTime) / 1000 : 0,
      lastAnalysisTime: this.lastAnalysisTime,
      analysisCount: this.analysisCount,
      errorCount: this.errorCount,
      model: this.model,
      timestamp: new Date().toISOString(),
    };

    if (parentPort) {
      parentPort.postMessage({
        type: 'statusUpdate',
        payload: statusData,
      });
    }

    // console.log(
    //   `🔄 [${new Date().toLocaleTimeString()}] ${status}: ${message} ${
    //     progress > 0 ? `(${progress}%)` : ''
    //   }`,
    // );
  }

  // Helper method to clean and parse JSON responses
  parseJsonResponse(response) {
    try {
      let cleanResponse = response
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .replace(/.*?({.*}).*/s, '$1')
        .trim();

      if (!cleanResponse.startsWith('{')) {
        const jsonMatch = response.match(/{[^{}]*}/);
        cleanResponse = jsonMatch ? jsonMatch[0] : '{}';
      }

      return JSON.parse(cleanResponse);
    } catch (parseError) {
      console.log('⚠️ JSON parse failed, creating fallback');

      // Smart fallback based on response content
      const responseText = response.toLowerCase();
      let sentiment = 'NEUTRAL';
      let signal = 'HOLD';

      if (responseText.includes('bullish') || responseText.includes('positive')) {
        sentiment = 'BULLISH';
        signal = 'BUY';
      } else if (responseText.includes('bearish') || responseText.includes('negative')) {
        sentiment = 'BEARISH';
        signal = 'SELL';
      }

      return {
        marketSentiment: sentiment,
        confidence: 0.6,
        tradingSignal: signal,
        signalReason: 'Analysis based on sentiment detection',
        newsImpact: 'Sentiment analyzed from response',
        keyInsights: ['Sentiment detected', 'Fallback analysis applied'],
      };
    }
  }

  async callOllama(prompt, systemPrompt = null) {
    const timeoutMs = 25000;

    try {
      const payload = {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.05,
          top_p: 0.6,
          max_tokens: 200,
          num_predict: 200,
          repeat_penalty: 1.1,
          stop: ['\n\n', '---', 'END'],
        },
      };

      if (systemPrompt) {
        payload.system = systemPrompt;
      }

      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // const responseTime = (Date.now() - startTime) / 1000;
      // console.log(`⚡ Ollama response time: ${responseTime.toFixed(2)}s`);

      return data.response;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ Ollama request timed out after 25s');
      } else {
        console.error('❌ Ollama API call failed:', error.message);
      }

      this.errorCount++;
      filelog('OLLAMA_API_ERROR', { error: error.message, timestamp: new Date().toISOString() });
      return null;
    }
  }

  async generateSelectiveAnalysis(coinData, newsData) {
    if (this.isAnalyzing) {
      console.log('⏳ Analysis in progress, skipping selective analysis...');
      return null;
    }

    this.isAnalyzing = true;
    this.startTime = Date.now();
    this.updateStatus('starting', 'Starting selective analysis...', 5);

    try {
      const systemPrompt = `You are a crypto analyst. Analyze the specific coin and news provided. 
      Respond ONLY with JSON in this exact format:
      {
        "marketSentiment": "BULLISH|BEARISH|NEUTRAL",
        "confidence": 0.0-1.0,
        "tradingSignal": "BUY|SELL|HOLD",
        "signalReason": "brief reason max 50 chars",
        "newsImpact": "how news affects this coin max 100 chars",
        "keyInsights": ["insight1 max 80 chars", "insight2 max 80 chars"]
      }`;

      const prompt = `Coin: ${coinData.symbol} (${coinData.name})
Price: $${coinData.price} (${coinData.change24h >= 0 ? '+' : ''}${
        coinData.change24h?.toFixed(2) || 0
      }%)
Market Cap: $${(coinData.marketCap / 1e9)?.toFixed(2) || 0}B

News: "${newsData.title}"
${newsData.description ? `Description: "${newsData.description.substring(0, 200)}"` : ''}

Analyze impact of this specific news on this specific coin:`;

      // console.log(
      //   `🎯 SELECTIVE PROMPT (${prompt.length} chars):`,
      //   prompt.substring(0, 200) + '...',
      // );

      this.updateStatus('analyzing', 'Getting focused AI analysis...', 40);
      const response = await this.callOllama(prompt, systemPrompt);

      if (!response) {
        throw new Error('No response from Ollama');
      }

      // console.log('📥 SELECTIVE RESPONSE:', response);
      // this.updateStatus('analyzing', 'Parsing selective analysis...', 80);

      const parsedAnalysis = this.parseJsonResponse(response);
      // console.log('✅ SELECTIVE PARSED:', parsedAnalysis);

      // Validate and enhance the analysis
      const analysis = {
        marketSentiment: parsedAnalysis.marketSentiment || 'NEUTRAL',
        confidence: Math.min(1, Math.max(0, parsedAnalysis.confidence || 0.5)),
        tradingSignal: parsedAnalysis.tradingSignal || 'HOLD',
        signalReason: parsedAnalysis.signalReason || 'Analysis in progress',
        newsImpact: parsedAnalysis.newsImpact || 'News impact being processed',
        keyInsights: (parsedAnalysis.keyInsights || ['Analysis completed']).slice(0, 3),
        timestamp: new Date().toISOString(),
        model: this.model,
        responseTime: (Date.now() - this.startTime) / 1000,
        coinAnalyzed: `${coinData.symbol} (${coinData.name})`,
        newsAnalyzed: newsData.title,
      };

      const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
      this.updateStatus('completed', `Selective analysis done in ${totalTime}s`, 100);

      // console.log(`🎯 SELECTIVE ANALYSIS SUMMARY:`);
      // console.log(`   Coin: ${coinData.symbol}`);
      // console.log(`   Sentiment: ${analysis.marketSentiment}`);
      // console.log(`   Signal: ${analysis.tradingSignal}`);
      // console.log(`   Speed: ${totalTime}s`);

      return analysis;
    } catch (error) {
      console.error('❌ Selective analysis failed:', error.message);
      this.updateStatus('error', `Selective analysis failed: ${error.message}`, 0);
      this.errorCount++;
      return null;
    } finally {
      this.isAnalyzing = false;
    }
  }
}

// Main execution
const analyzer = new OllamaAnalyzer();
let latestCryptoPrices = null;
let latestCryptoNews = null;

// Listen for messages from parent
if (parentPort) {
  parentPort.on('message', async (message) => {
    // console.log('📨 Received:', message.type);

    if (message.type === 'cryptoPrices') {
      latestCryptoPrices = message.payload;
      // analyzer.updateStatus('ready', `Prices received for ${analyzer.topCoins.length} top coins`);
    } else if (message.type === 'cryptoNews') {
      latestCryptoNews = message.payload;
      analyzer.updateStatus(
        'ready',
        `News received: ${Math.min(3, (message.payload || []).length)} headlines`,
      );
    }
    // Handle selective analysis requests
    else if (message.type === 'selectiveAnalysis') {
      // console.log('🎯 Processing selective analysis request...');

      const { coin, news } = message.payload;
      const analysis = await analyzer.generateSelectiveAnalysis(coin, news);

      if (analysis) {
        // Send result back to server
        parentPort.postMessage({
          type: 'selectiveAnalysisResult',
          payload: analysis,
        });
        // console.log('✅ Selective analysis result sent');
      } else {
        // Send error response
        parentPort.postMessage({
          type: 'selectiveAnalysisResult',
          payload: {
            error: 'Analysis failed',
            timestamp: new Date().toISOString(),
          },
        });
        console.log('❌ Selective analysis failed');
      }
    }
  });
}

async function run() {
  const { wakeUpTimeMs, workTimeMs, workWaitMs } = operation;

  const restTime = rest(wakeUpTimeMs, workTimeMs);
  if (restTime > 0) {
    analyzer.updateStatus('sleeping', `Resting ${Math.round(restTime / 1000)}s`);
    filelog('BOT_OLLAMA_SLEEP');
    await sleep(restTime);
    filelog('BOT_OLLAMA_AWAKE');
  }

  analyzer.updateStatus('working', 'Work cycle started');
  await sleep(workWaitMs);

  try {
    // Since comprehensive analysis method is commented out,
    // we'll just log that we're waiting for data
    if (latestCryptoPrices || latestCryptoNews) {
      console.log('🚀 Data available but comprehensive analysis is disabled');
      analyzer.updateStatus('waiting', 'Comprehensive analysis disabled');
    } else {
      analyzer.updateStatus('waiting', 'Waiting for data...');
      console.log('⏳ No data available yet...');
    }
  } catch (error) {
    console.error('❌ Runtime error:', error);
    analyzer.updateStatus('error', `Runtime error: ${error.message}`);
  }

  // Faster cycle (90 seconds)
  await sleep(90000);
  run();
}

// Initialize
analyzer.updateStatus('starting', 'Enhanced Ollama bot with selective analysis starting...');
filelog('BOT_OLLAMA_ENHANCED_RUN');
console.log('🏃‍♂️ STARTING ENHANCED OLLAMA BOT (selective analysis only)');
run();
