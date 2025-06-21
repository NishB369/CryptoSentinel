import React from "react";

const CoinCard = ({ coin }) => {
  const formatNumber = (num) => {
    if (!num) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    if (price > 1000) return `$${price.toLocaleString()}`;
    if (price > 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatPercentage = (value) => {
    if (!value || isNaN(value)) return "0.00%";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const isPositive = (coin.data?.usd_24h_change || 0) >= 0;
  const changeValue = coin.data?.usd_24h_change || 0;

  return (
    <div className="group relative bg-gradient-to-br from-[#1E1E1E]/90 to-[#2A2A2A]/70 backdrop-blur-sm rounded-2xl p-6 border border-[#333]/30 hover:border-[#39FF14]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#39FF14]/10 hover:-translate-y-1">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#39FF14]/5 to-[#00D2FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          <span>{isPositive ? "↗" : "↘"}</span>
          <span>{Math.abs(changeValue).toFixed(1)}%</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <div
            className={`w-14 h-14 bg-gradient-to-r ${coin.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
          >
            {coin.icon}
          </div>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[#39FF14]/40 to-[#00D2FF]/40 opacity-0 group-hover:opacity-100 animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg group-hover:text-[#39FF14] transition-colors">
            {coin.name}
          </h3>
          <p className="text-gray-400 text-sm font-medium">{coin.symbol}</p>
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-white font-bold text-2xl">
            {formatPrice(coin.data?.usd)}
          </span>
          <span
            className={`text-sm font-semibold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {formatPercentage(changeValue)}
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          ₹{coin.data?.inr?.toLocaleString() || "N/A"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#2A2A2A]/40 rounded-lg p-3 border border-[#333]/20">
          <p className="text-gray-500 text-xs font-medium mb-1">Market Cap</p>
          <p className="text-gray-200 font-semibold text-sm">
            {formatNumber(coin.data?.usd_market_cap)}
          </p>
        </div>

        <div className="bg-[#2A2A2A]/40 rounded-lg p-3 border border-[#333]/20">
          <p className="text-gray-500 text-xs font-medium mb-1">Volume 24h</p>
          <p className="text-gray-200 font-semibold text-sm">
            {formatNumber(coin.data?.usd_24h_vol)}
          </p>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-4 pt-4 border-t border-[#333]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isPositive ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
            ></div>
            <span className="text-xs text-gray-400">
              {isPositive ? "Bullish" : "Bearish"} Trend
            </span>
          </div>

          <div className="text-xs text-gray-500">Live</div>
        </div>
      </div>

      {/* Hover overlay with additional info */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">All Time High:</span>
            <span className="text-white font-medium">
              {coin.data?.ath ? formatPrice(coin.data.ath) : "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">All Time Low:</span>
            <span className="text-white font-medium">
              {coin.data?.atl ? formatPrice(coin.data.atl) : "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Last Updated:</span>
            <span className="text-white font-medium">
              {coin.data?.last_updated
                ? new Date(coin.data.last_updated).toLocaleTimeString()
                : "Just now"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
