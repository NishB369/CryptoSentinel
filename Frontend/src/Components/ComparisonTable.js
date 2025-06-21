import { useNavigate } from "react-router";

const ComparisonTable = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/login");
  };
  
  const comparisons = [
    {
      problem: "Constantly checking multiple exchanges manually",
      solution: "24/7 Automated Monitoring",
    },
    {
      problem: "Missing price alerts while you sleep at night",
      solution: "Smart Pattern Recognition",
    },
    {
      problem: "No historical pattern analysis available",
      solution: "Multi-Exchange Intelligence",
    },
    {
      problem: "Overwhelming data without clear insights",
      solution: "Instant Alert System",
    },
  ];

  return (
    <section className="py-20 px-6 bg-black">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Stop Missing <span className="text-[#FF6B35]">Opportunities</span>,
            <br />
            Start Using{" "}
            <span className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
            See how CryptoSentinel transforms your crypto trading experience
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {comparisons.map((item, index) => (
              <div
                key={index}
                className="bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl overflow-hidden flex flex-col h-full"
              >
                {/* Problem */}
                <div className="p-3 border-b border-[#333]/30 flex-1">
                  <div className="flex items-start space-x-2 mb-2">
                    <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 text-red-500 flex items-center justify-center">
                        <span className="bi bi-x"></span>
                      </div>
                    </div>
                    <span className="text-red-400 text-xs font-medium">
                      Without
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs leading-tight">
                    {item.problem}
                  </p>
                </div>
                {/* Solution */}
                <div className="p-3 bg-[#39FF14]/5 flex-1">
                  <div className="flex items-start space-x-2 mb-2">
                    <div className="w-5 h-5 bg-[#39FF14]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 text-[#39FF14] flex items-center justify-center">
                        <span className="bi bi-x"></span>
                      </div>
                    </div>
                    <span className="text-[#39FF14] text-xs font-medium">
                      With
                    </span>
                  </div>
                  <p className="text-white font-semibold text-xs leading-tight">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-2 bg-[#2A2A2A]/50">
              <div className="p-6 border-r border-[#333]/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 text-red-500 flex items-center justify-center">
                      <span className="bi bi-x text-2xl"></span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Without CryptoSentinel
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#39FF14]/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 text-[#39FF14] flex items-center justify-center">
                      <span className="bi bi-x text-2xl"></span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    With CryptoSentinel
                  </h3>
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {comparisons.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 border-t border-[#333]/30"
              >
                <div className="p-6 border-r border-[#333]/30">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 text-red-500 flex items-center justify-center">
                        <span className="bi bi-x"></span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg">{item.problem}</p>
                  </div>
                </div>
                <div className="p-6 bg-[#39FF14]/5">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#39FF14]/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 text-[#39FF14] flex items-center justify-center">
                        <span className="bi bi-x"></span>
                      </div>
                    </div>
                    <p className="text-white font-semibold text-lg">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-6">
              Ready to upgrade your crypto experience?
            </p>
            <button
              className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black font-bold px-8 py-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#00D2FF]/25  rounded-full cursor-pointer"
              onClick={handleStartFree}
            >
              Get Your Dashboard →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
