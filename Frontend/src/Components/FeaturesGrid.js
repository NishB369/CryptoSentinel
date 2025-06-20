const FeaturesGrid = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI Price Prediction",
      description:
        "Machine learning algorithms analyze patterns to predict next moves",
      accent: "#00D2FF",
    },
    {
      icon: "📊",
      title: "Multi-Timeframe Analysis",
      description: "1min to 1year charts with technical indicators",
      accent: "#39FF14",
    },
    {
      icon: "🔔",
      title: "Smart Alert Engine",
      description: "Custom triggers: price, volume, market cap changes",
      accent: "#FF6B35",
    },
    {
      icon: "💼",
      title: "Portfolio Intelligence",
      description: "Track P&L, rebalancing suggestions, risk analysis",
      accent: "#00D2FF",
    },
  ];

  return (
    <section className="p-10 bg-black">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Professional-Grade <span className="text-[#00D2FF]">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to stay ahead in the crypto market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-8 hover:border-[#00D2FF]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00D2FF]/10 text-center group"
            >
              <div
                className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ filter: `drop-shadow(0 0 10px ${feature.accent}40)` }}
              >
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
