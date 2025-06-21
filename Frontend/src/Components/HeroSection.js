import { useNavigate } from "react-router";
import CryptoCard from "./CryptoCard";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-12 px-6">
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-[#39FF14] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-28 w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-[#00D2FF] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 mt-10 md:mt-0">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-white">Never Miss Another</span>
          <br />
          <span className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] bg-clip-text text-transparent">
            Crypto Move
          </span>
        </h1>

        <p className="text-xl md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
          Real-time crypto intelligence: automated monitoring, instant alerts,
          and AI-driven insights.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mb-10">
          <button
            onClick={handleStartFree}
            className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black font-semibold px-12 py-4 text-lg hover:scale-105 transition-transform duration-200 rounded-full cursor-pointer"
          >
            Get Started
          </button>
          <button className="border-white text-[#00D2FF] hover:bg-[#00D2FF] hover:text-black px-8 py-4 text-lg transition-all duration-200 rounded-full border cursor-pointer">
            View Live Demo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <CryptoCard
            name="Bitcoin"
            symbol="BTC"
            price="$42,350.00"
            change="+2.45%"
            isPositive={true}
            delay="0"
          />
          <CryptoCard
            name="Solana"
            symbol="SOL"
            price="$98.24"
            change="-0.95%"
            isPositive={false}
            delay="400"
          />
          <CryptoCard
            name="Ethereum"
            symbol="ETH"
            price="$2,580.50"
            change="+1.78%"
            isPositive={true}
            delay="200"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
