const CryptoCard = ({ name, symbol, price, change, isPositive, delay }) => {
  return (
    <div
      className="bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-6 hover:border-[#00D2FF]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00D2FF]/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          <p className="text-gray-400 text-sm text-left">{symbol}</p>
        </div>
        <div
          className={`w-8 h-8 rounded-full ${
            isPositive ? "bg-[#39FF14]/20" : "bg-[#FF6B35]/20"
          } flex items-center justify-center`}
        >
          {isPositive ? (
            <svg
              className="w-4 h-4 text-[#39FF14]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-[#FF6B35]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-white text-2xl font-bold mb-1">{price}</p>
        <p
          className={`text-sm font-medium ${
            isPositive ? "text-[#39FF14]" : "text-[#FF6B35]"
          }`}
        >
          {change}
        </p>
      </div>
    </div>
  );
};

export default CryptoCard;
