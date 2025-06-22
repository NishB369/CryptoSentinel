import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CoinCard from "../Components/CoinCard";
import InternalNavbar from "../Components/InternalNavbar";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [_, setSelectedCoins] = useState([]);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleManualRefresh = () => {
    fetchData(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
      <InternalNavbar
        userName={userName}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        onManualRefresh={handleManualRefresh}
        onLogout={handleLogout}
        isAI={false}
      />

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
