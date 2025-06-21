import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CoinCard from "../Components/CoinCard"; 

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async (isAutoRefresh = false) => {
    if (isAutoRefresh) {
      setIsRefreshing(true);
    }

    try {
      const res = await fetch("http://localhost:3001/all-data");
      if (!res.ok) throw new Error("Server not ready");
      const json = await res.json();
      console.log("📊 Data fetched:", json);
      setData(json);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error("Fetch failed:", err);
      setIsRefreshing(false);
      if (!isAutoRefresh) {
        setTimeout(() => fetchData(), 2000);
      }
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const onboardingComplete = localStorage.getItem("onboardingComplete");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!onboardingComplete) {
      navigate("/onboarding");
      return;
    }

    setUserName(localStorage.getItem("userName") || "User");
    setSelectedCoins(JSON.parse(localStorage.getItem("selectedCoins") || "[]"));
    fetchData();

    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Helper functions
  const formatNumber = (num) => {
    if (!num) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-[#39FF14] rounded-full mb-4"></div>
        <p className="text-lg">Loading your personalized dashboard...</p>
        <p className="text-sm text-gray-400 mt-1">Fetching live crypto data</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load dashboard data.
      </div>
    );
  }

  const { cryptoPrices, cryptoNews } = data;

  // Enhanced coins data with additional metrics
  const coins = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      data: cryptoPrices?.bitcoin,
      icon: "₿",
      color: "from-orange-500 to-yellow-500",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      data: cryptoPrices?.ethereum,
      icon: "Ξ",
      color: "from-blue-500 to-purple-500",
    },
    {
      symbol: "SOL",
      name: "Solana",
      data: cryptoPrices?.solana,
      icon: "◎",
      color: "from-purple-500 to-pink-500",
    },
    {
      symbol: "ADA",
      name: "Cardano",
      data: cryptoPrices?.cardano,
      icon: "₳",
      color: "from-blue-600 to-cyan-500",
    },
    {
      symbol: "DOT",
      name: "Polkadot",
      data: cryptoPrices?.polkadot,
      icon: "●",
      color: "from-pink-500 to-red-500",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      data: cryptoPrices?.chainlink,
      icon: "⬢",
      color: "from-blue-400 to-indigo-500",
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      data: cryptoPrices?.avalanche,
      icon: "▲",
      color: "from-red-500 to-pink-500",
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      data: cryptoPrices?.dogecoin,
      icon: "Ð",
      color: "from-yellow-400 to-orange-400",
    },
    {
      symbol: "BNB",
      name: "Binance Coin",
      data: cryptoPrices?.binancecoin,
      icon: "🅱",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  // Calculate market stats
  const marketStats = coins.reduce(
    (acc, coin) => {
      if (coin.data) {
        acc.totalMarketCap += coin.data.usd_market_cap || 0;
        acc.totalVolume += coin.data.usd_24h_vol || 0;
        if (coin.data.usd_24h_change > 0) acc.gainers++;
        else if (coin.data.usd_24h_change < 0) acc.losers++;
      }
      return acc;
    },
    { totalMarketCap: 0, totalVolume: 0, gainers: 0, losers: 0 }
  );

  const marketSentiment =
    marketStats.gainers > marketStats.losers
      ? "Bullish"
      : marketStats.gainers < marketStats.losers
      ? "Bearish"
      : "Neutral";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleManualRefresh = () => {
    fetchData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-[#333]/50 bg-[#1A1A1A]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left Section - Logo and Welcome */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00D2FF] to-[#39FF14] bg-clip-text text-transparent truncate">
                CryptoSentinel
              </h1>
              <div className="hidden lg:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm truncate">
                  Welcome back, {userName}!
                </span>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* AI Button */}
              <button
                onClick={() => navigate("/insights")}
                className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black font-semibold hover:scale-105 transition-all duration-300 p-2 sm:px-3 lg:px-4 h-9 sm:h-10 rounded-md cursor-pointer ease-in-out flex items-center justify-center min-w-[36px] sm:min-w-[44px]"
                title="AI Insights"
              >
                <div className="w-4 h-4 sm:mr-0 lg:mr-2 -mt-2"><span className="bi bi-lightning-charge-fill"></span></div>
                <div className="hidden lg:block">AI</div>
              </button>

              {/* Status Indicator */}
              <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-400 bg-[#2A2A2A]/50 px-2 sm:px-3 py-2 rounded-lg">
                <div
                  className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${
                    isRefreshing
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-green-500"
                  }`}
                ></div>
                <span className="hidden md:inline">
                  {isRefreshing
                    ? "Updating..."
                    : lastUpdated
                    ? `Updated ${lastUpdated}`
                    : "Live"}
                </span>
                <span className="md:hidden">
                  {isRefreshing ? "..." : "Live"}
                </span>
                <button
                  onClick={handleManualRefresh}
                  className="ml-1 sm:ml-2 text-[#39FF14] hover:text-[#39FF14]/80 font-bold text-sm sm:text-lg"
                  disabled={isRefreshing}
                  title="Refresh Data"
                >
                  ↻
                </button>
              </div>

              {/* Mobile Status Button */}
              <button
                onClick={handleManualRefresh}
                className="sm:hidden bg-[#2A2A2A]/50 p-2 rounded-lg border border-[#333]/50 hover:border-[#39FF14]/30 transition-all"
                disabled={isRefreshing}
                title="Refresh Data"
              >
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isRefreshing
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-[#39FF14] text-sm">↻</span>
                </div>
              </button>

              {/* Notifications */}
              <div className="relative">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full absolute -top-1 -right-1 animate-pulse"></div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#2A2A2A] to-[#3A3A3A] rounded-full flex items-center justify-center text-white border border-[#333] hover:border-[#39FF14]/30 transition-all cursor-pointer">
                  <span className="text-xs sm:text-sm">🔔</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-2 sm:px-3 lg:px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all text-xs sm:text-sm font-medium"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>

          {/* Mobile Welcome Message */}
          <div className="lg:hidden mt-3 pt-3 border-t border-[#333]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-sm">
                  Welcome back, {userName}!
                </span>
              </div>
              <div className="sm:hidden flex items-center space-x-2 text-xs text-gray-400">
                <span>
                  {isRefreshing
                    ? "Updating..."
                    : lastUpdated
                    ? `${lastUpdated}`
                    : "Live"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1A1A1A]/80 to-[#2A2A2A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-6 hover:border-[#39FF14]/30 transition-all">
            <p className="text-gray-400 text-sm">Total Market Cap</p>
            <p className="text-2xl font-bold text-[#39FF14]">
              {formatNumber(marketStats.totalMarketCap)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Tracked coins</p>
          </div>
          <div className="bg-gradient-to-br from-[#1A1A1A]/80 to-[#2A2A2A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-6 hover:border-[#00D2FF]/30 transition-all">
            <p className="text-gray-400 text-sm">24h Volume</p>
            <p className="text-2xl font-bold text-[#00D2FF]">
              {formatNumber(marketStats.totalVolume)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Trading activity</p>
          </div>
          <div className="bg-gradient-to-br from-[#1A1A1A]/80 to-[#2A2A2A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-6 hover:border-yellow-500/30 transition-all">
            <p className="text-gray-400 text-sm">Market Sentiment</p>
            <p
              className={`text-2xl font-bold ${
                marketSentiment === "Bullish"
                  ? "text-green-500"
                  : marketSentiment === "Bearish"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {marketSentiment}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {marketStats.gainers}↗ {marketStats.losers}↘
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#1A1A1A]/80 to-[#2A2A2A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-6 hover:border-purple-500/30 transition-all">
            <p className="text-gray-400 text-sm">Active Alerts</p>
            <p className="text-2xl font-bold text-purple-400">12</p>
            <p className="text-xs text-gray-500 mt-1">Today</p>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Live Price Feed with New CoinCard Component */}
          <div className="xl:col-span-2 bg-gradient-to-br from-[#1A1A1A]/80 to-[#2A2A2A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <span className="text-2xl mr-3">📊</span>
                Live Market Feed
              </h3>
              {isRefreshing && (
                <div className="w-6 h-6 border-2 border-[#39FF14]/30 border-t-[#39FF14] rounded-full animate-spin"></div>
              )}
            </div>

            {/* Responsive Grid for Coin Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {coins.map((coin) => (
                <CoinCard key={coin.symbol} coin={coin} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Enhanced News Updates */}
            <div className="bg-gradient-to-br from-[#1A1A1A]/80 to-[#2A2A2A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="text-xl mr-2">📰</span>
                Crypto News
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {cryptoNews && cryptoNews.length > 0 ? (
                  cryptoNews.slice(0, 8).map((news, idx) => (
                    <a
                      key={idx}
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-[#2A2A2A]/50 p-4 rounded-lg border border-[#333]/20 hover:border-[#00D2FF]/30 hover:bg-[#333]/40 transition-all group"
                    >
                      <h4 className="text-white font-medium text-sm leading-tight mb-2 group-hover:text-[#00D2FF] transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-xs">
                          {news.published}
                        </p>
                        <span className="text-[#00D2FF] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          Read more →
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-[#39FF14]/30 border-t-[#39FF14] rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading latest news...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a2a2a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #39ff14;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00d2ff;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
