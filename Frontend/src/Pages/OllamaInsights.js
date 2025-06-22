import React, { useState, useEffect } from "react";
import {
  Brain,
  Newspaper,
  DollarSign,
  Zap,
  AlertCircle,
  ChevronDown,
  Bot,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Target,
  BarChart3,
  Lightbulb,
  Activity,
} from "lucide-react";
import InternalNavbar from "../Components/InternalNavbar";

const OllamaInsights = () => {
  const [userName, setUserName] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [cryptoNews, setCryptoNews] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [selectedNews, setSelectedNews] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  const availableCoins = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
    { id: "ethereum", symbol: "ETH", name: "Ethereum" },
    { id: "solana", symbol: "SOL", name: "Solana" },
    { id: "cardano", symbol: "ADA", name: "Cardano" },
    { id: "polkadot", symbol: "DOT", name: "Polkadot" },
    { id: "chainlink", symbol: "LINK", name: "Chainlink" },
    { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  ];

  const analysisSteps = [
    { label: "Sending to AI...", shortLabel: "Sending" },
    { label: "Parsing response...", shortLabel: "Parsing" },
    { label: "Understanding...", shortLabel: "Analysis" },
    { label: "Complete", shortLabel: "Done" },
  ];

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "User");
    setLastUpdated(new Date().toLocaleTimeString());

    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [pricesResponse, newsResponse] = await Promise.all([
          fetch("http://localhost:3001/crypto-prices"),
          fetch("http://localhost:3001/crypto-news"),
        ]);

        if (pricesResponse.ok) {
          const prices = await pricesResponse.json();
          setCryptoPrices(prices);
        }

        if (newsResponse.ok) {
          const news = await newsResponse.json();
          setCryptoNews(news.slice(0, 10));
        }
      } catch (err) {
        setError("Failed to load data: " + err.message);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getAnalysis = async () => {
    if (!selectedCoin || selectedNews === "") {
      setError("Please select both a coin and a news item");
      return;
    }

    setLoading(true);
    setCurrentStep(0);
    setError("");
    setAnalysis(null);

    try {
      const coinData = cryptoPrices[selectedCoin];
      const newsData = cryptoNews[parseInt(selectedNews)];

      if (!coinData || !newsData) {
        throw new Error("Selected data not found");
      }

      // Step 1: Sending
      await new Promise((r) => setTimeout(r, 1000));
      setCurrentStep(1);

      const response = await fetch("http://localhost:3001/analyze-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coin: {
            id: selectedCoin,
            symbol: availableCoins.find((c) => c.id === selectedCoin)?.symbol,
            name: availableCoins.find((c) => c.id === selectedCoin)?.name,
            price: coinData.usd,
            priceInr: coinData.inr,
            change24h: coinData.usd_24h_change,
            marketCap: coinData.usd_market_cap,
            volume24h: coinData.usd_24h_vol,
          },
          news: {
            title: newsData.title,
            description: newsData.description || "",
            published: newsData.published,
            link: newsData.link,
          },
        }),
      });

      // Step 2: Parsing
      await new Promise((r) => setTimeout(r, 1000));
      setCurrentStep(2);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Analysis failed: ${response.status}`
        );
      }

      const result = await response.json();

      // Step 3: Understanding
      await new Promise((r) => setTimeout(r, 1000));
      setCurrentStep(3);

      setAnalysis(result);
    } catch (err) {
      setError("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  };

  const StepIndicator = () => (
    <div className="mt-6 px-4">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(currentStep / analysisSteps.length) * 100}%`,
              }}
            />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[#00D2FF] rounded-full animate-pulse" />
              <span className="text-white font-medium">
                {analysisSteps[currentStep]?.shortLabel || "Processing"}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Step {currentStep + 1} of {analysisSteps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex justify-center items-center gap-4 text-white">
        {analysisSteps.map((step, idx) => {
          const isActive = currentStep >= idx;
          const isCurrent = currentStep === idx;

          return (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? isCurrent
                      ? "bg-[#00D2FF] animate-pulse scale-110"
                      : "bg-[#39FF14]"
                    : "bg-gray-500"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  isCurrent
                    ? "text-white font-medium"
                    : isActive
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {idx < analysisSteps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                    currentStep > idx ? "bg-[#39FF14]" : "bg-gray-600"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const getSentimentIcon = (sentiment) => {
    if (!sentiment) return <Minus className="w-6 h-6" />;
    const lower = sentiment.toLowerCase();
    if (lower.includes("bullish") || lower.includes("positive")) {
      return <TrendingUp className="w-6 h-6 text-green-400" />;
    } else if (lower.includes("bearish") || lower.includes("negative")) {
      return <TrendingDown className="w-6 h-6 text-red-400" />;
    }
    return <Minus className="w-6 h-6 text-yellow-400" />;
  };

  const getSignalColor = (signal) => {
    if (!signal) return "text-gray-400";
    const lower = signal.toLowerCase();
    if (lower.includes("buy") || lower.includes("long"))
      return "text-green-400";
    if (lower.includes("sell") || lower.includes("short"))
      return "text-red-400";
    return "text-yellow-400";
  };

  const getConfidenceColor = (confidence) => {
    if (!confidence) return "text-gray-400";
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/dashboard");
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
          <p className="text-xl">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden pb-10">
      {/* Background Dots */}
      <div className="absolute inset-0 hidden md:block z-0 overflow-hidden">
        <div className="absolute top-30 left-20 w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-[#39FF14] rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-28 w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse delay-700" />
      </div>

      <InternalNavbar
        userName={userName}
        isAI={true}
        onLogout={handleLogout}
        lastUpdated={lastUpdated}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10 mt-10">
        <div className="text-center px-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white flex items-center justify-center gap-3 mb-2">
            <span>
              <span className="text-white">AI-Powered</span>{" "}
              <span className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] bg-clip-text text-transparent">
                Crypto Insights
              </span>
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-tight">
            Analyze the impact of news on your favorite coins in real-time.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-4 mx-6">
          <h2 className="text-2xl text-white font-semibold flex items-center gap-2">
            <Zap className="w-6 h-6" /> Make Your Selection
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                <DollarSign className="inline w-5 h-5 mr-2" />
                Select Cryptocurrency
              </label>
              <div className="relative w-full">
                <select
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white appearance-none"
                >
                  <option value="">Choose a coin...</option>
                  {availableCoins.map((coin) => {
                    const coinData = cryptoPrices[coin.id];
                    return (
                      <option key={coin.id} value={coin.id}>
                        {coin.symbol} - {coin.name}
                        {coinData && ` ($${coinData.usd?.toFixed(2) || "N/A"})`}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none z-10" />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Newspaper className="inline w-5 h-5 mr-2" />
                Select News Article
              </label>
              <div className="relative w-full">
                <select
                  value={selectedNews}
                  onChange={(e) => setSelectedNews(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white appearance-none"
                >
                  <option value="">Choose a news article...</option>
                  {cryptoNews.map((news, index) => (
                    <option key={index} value={index}>
                      {news.title.substring(0, 60)}...
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none z-10" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={getAnalysis}
              disabled={loading || !selectedCoin || selectedNews === ""}
              className="px-8 py-4 bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black rounded-full font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 mt-2 cursor-pointer disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center gap-2 justify-center">
                <Brain className="w-5 h-5" />
                {loading ? "Processing..." : "Get AI Analysis"}
              </div>
            </button>

            {loading && <StepIndicator />}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg flex items-center gap-2 mx-6">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {analysis && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 space-y-8 text-white mx-6">
            {/* Header */}
            <div className="text-center border-b border-white/20 pb-6">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
                <Bot className="w-8 h-8 text-[#00D2FF] hidden md:block" />
                AI Analysis Results
              </h2>
              <p className="text-gray-300">
                Comprehensive analysis of{" "}
                {availableCoins.find((c) => c.id === selectedCoin)?.symbol}{" "}
                market sentiment and trading signals
              </p>
            </div>

            {/* Main Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Market Sentiment */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">
                    Market Sentiment
                  </h3>
                  {getSentimentIcon(analysis.marketSentiment)}
                </div>
                <div className="text-3xl font-bold mb-2">
                  {analysis.marketSentiment || "Analyzing..."}
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span
                    className={`text-sm font-medium ${getConfidenceColor(
                      analysis.confidence
                    )}`}
                  >
                    {analysis.confidence
                      ? `${Math.round(analysis.confidence * 100)}% Confidence`
                      : "Processing..."}
                  </span>
                </div>
              </div>

              {/* Trading Signal */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">
                    Trading Signal
                  </h3>
                  <Target className="w-6 h-6 text-[#39FF14]" />
                </div>
                <div
                  className={`text-3xl font-bold mb-2 ${getSignalColor(
                    analysis.tradingSignal
                  )}`}
                >
                  {analysis.tradingSignal || "Calculating..."}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {analysis.signalReason || "Analyzing market conditions..."}
                </p>
              </div>

              {/* Analysis Metadata */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">
                    Analysis Info
                  </h3>
                  <BarChart3 className="w-6 h-6 text-[#FF6B35]" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {analysis.timestamp
                        ? new Date(analysis.timestamp).toLocaleTimeString()
                        : "Processing..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {analysis.model || "AI Assistant"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {availableCoins.find((c) => c.id === selectedCoin)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* News Impact Analysis */}
            {analysis.newsImpact && (
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Newspaper className="w-6 h-6 text-[#00D2FF]" />
                  <h3 className="text-xl font-semibold">
                    News Impact Analysis
                  </h3>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border-l-4 border-[#00D2FF]">
                  <p className="text-gray-100 leading-relaxed">
                    {analysis.newsImpact}
                  </p>
                </div>
              </div>
            )}

            {/* Key Insights */}
            {analysis.keyInsights?.length > 0 && (
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-6 h-6 text-[#39FF14]" />
                  <h3 className="text-xl font-semibold">Key Insights</h3>
                </div>
                <div className="grid gap-4">
                  {analysis.keyInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white/5 rounded-lg p-4 border border-white/20"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-[#00D2FF] to-[#39FF14] rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-gray-100 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Footer */}
            <div className="text-center pt-6 border-t border-white/20">
              <p className="text-sm text-gray-400">
                This analysis is generated by AI and should not be considered as
                financial advice. Always do your own research before making
                investment decisions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OllamaInsights;
