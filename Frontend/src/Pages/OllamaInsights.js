import React, { useState, useEffect } from "react";
import {
  Brain,
  Newspaper,
  DollarSign,
  Zap,
  AlertCircle,
  ChevronDown,
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
  const [step, setStep] = useState("idle"); // NEW: 'idle' | 'sending' | 'parsing' | 'understanding' | 'done'
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
    setStep("sending");
    setError("");
    setAnalysis(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));

      const coinData = cryptoPrices[selectedCoin];
      const newsData = cryptoNews[parseInt(selectedNews)];

      if (!coinData || !newsData) {
        throw new Error("Selected data not found");
      }

      const response = await fetch("http://localhost:3001/analyze-selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      setStep("parsing");
      await new Promise((r) => setTimeout(r, 1000));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Analysis failed: ${response.status}`
        );
      }

      const result = await response.json();
      setStep("understanding");
      await new Promise((r) => setTimeout(r, 1000));

      setAnalysis(result);
      setStep("done");
    } catch (err) {
      setError("Analysis failed: " + err.message);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ current }) => {
    const steps = [
      { key: "sending", label: "Sending to AI..." },
      { key: "parsing", label: "Parsing response..." },
      { key: "understanding", label: "Understanding..." },
      { key: "done", label: "Complete" },
    ];

    return (
      <div className="flex justify-center items-center gap-4 mt-4 text-white">
        {steps.map((stepItem, idx) => {
          const isActive = steps.findIndex((s) => s.key === current) >= idx;
          return (
            <div key={stepItem.key} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  isActive ? "bg-[#00D2FF]" : "bg-gray-500"
                }`}
              ></div>
              <span
                className={`text-sm ${
                  current === stepItem.key ? "text-white" : "text-gray-400"
                }`}
              >
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/dashboard");
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Dots */}
      <div className="absolute inset-0 hidden md:block z-0 overflow-hidden">
        <div className="absolute top-30 left-20 w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-[#39FF14] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-28 w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse delay-700"></div>
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

            {/* Stepwise Indicator */}
            {loading && <StepIndicator current={step} />}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg flex items-center gap-2 mx-6">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {analysis && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 space-y-6 text-white">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Analysis Results
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Market Sentiment</h3>
                <div className="text-2xl font-bold">
                  {analysis.marketSentiment || "N/A"}
                </div>
                <p className="text-sm text-gray-300">
                  Confidence:{" "}
                  {analysis.confidence
                    ? `${Math.round(analysis.confidence * 100)}%`
                    : "N/A"}
                </p>
              </div>

              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Trading Signal</h3>
                <div className="text-2xl font-bold">
                  {analysis.tradingSignal || "N/A"}
                </div>
                <p className="text-sm text-gray-300">
                  {analysis.signalReason || "Processing..."}
                </p>
              </div>
            </div>

            {analysis.newsImpact && (
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">News Impact</h3>
                <p>{analysis.newsImpact}</p>
              </div>
            )}

            {analysis.keyInsights?.length > 0 && (
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.keyInsights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-sm text-gray-400 text-center">
              <div className="flex justify-center gap-4">
                <span>
                  Analysis Time:{" "}
                  {analysis.timestamp
                    ? new Date(analysis.timestamp).toLocaleTimeString()
                    : "N/A"}
                </span>
                <span>•</span>
                <span>Model: {analysis.model || "AI Assistant"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OllamaInsights;
