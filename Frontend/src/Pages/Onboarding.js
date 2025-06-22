import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [liveTokens, setLiveTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showHoldAnimation, setShowHoldAnimation] = useState(false);
  const [apiDataReady, setApiDataReady] = useState(false);
  const navigate = useNavigate();

  // Check authentication and onboarding status on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const onboardingComplete = localStorage.getItem("onboardingComplete");

    // If not authenticated, redirect to login
    if (isAuthenticated !== "true") {
      navigate("/login");
      return;
    }

    // If already onboarded, redirect to dashboard
    if (onboardingComplete === "true") {
      navigate("/dashboard");
      return;
    }

    // If authenticated but not onboarded, load saved name if exists
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setName(savedName);
    }
  }, [navigate]);

  // Logout function to clear localStorage and redirect
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("onboardingComplete");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Fetch live token data from your server
  const fetchLiveTokens = async () => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch("http://localhost:3001/crypto-prices");
      const data = await response.json();

      console.log("API Response:", data); // Debug log
      clearInterval(progressInterval);
      setLoadingProgress(100);

      // Transform the data to match our display format
      const transformedTokens = Object.entries(data).map(([key, token]) => {
        console.log("Processing token:", key, token); // Debug log

        // Handle different price formats
        let formattedPrice = "N/A";
        if (token.usd) {
          formattedPrice = `$${parseFloat(token.usd).toLocaleString()}`;
        } else if (token.price && !isNaN(parseFloat(token.price))) {
          formattedPrice = `$${parseFloat(token.price).toLocaleString()}`;
        }

        // Handle market cap
        let formattedMarketCap = "N/A";
        if (token.usd_market_cap) {
          formattedMarketCap = `$${(token.usd_market_cap / 1e9).toFixed(2)}B`;
        } else if (token.marketCap && !isNaN(parseFloat(token.marketCap))) {
          formattedMarketCap = `$${(parseFloat(token.marketCap) / 1e9).toFixed(
            2
          )}B`;
        }

        return {
          symbol: token.symbol || key.toUpperCase(),
          name: token.name || key,
          id: key,
          price: formattedPrice,
          change24h: token.usd_24h_change || token.change24h || 0,
          marketCap: formattedMarketCap,
        };
      });

      console.log("Transformed tokens:", transformedTokens); // Debug log
      setLiveTokens(transformedTokens);
      setApiDataReady(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching live tokens:", error);
      // Fallback to static data if API fails
      const fallbackTokens = [
        {
          symbol: "BTC",
          name: "Bitcoin",
          id: "bitcoin",
          price: "$42,350",
          change24h: 2.5,
          marketCap: "$830B",
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          id: "ethereum",
          price: "$2,580",
          change24h: -1.2,
          marketCap: "$310B",
        },
        {
          symbol: "SOL",
          name: "Solana",
          id: "solana",
          price: "$98",
          change24h: 3.8,
          marketCap: "$45B",
        },
        {
          symbol: "ADA",
          name: "Cardano",
          id: "cardano",
          price: "$0.48",
          change24h: -0.5,
          marketCap: "$17B",
        },
        {
          symbol: "DOT",
          name: "Polkadot",
          id: "polkadot",
          price: "$7.23",
          change24h: 1.9,
          marketCap: "$9B",
        },
        {
          symbol: "LINK",
          name: "Chainlink",
          id: "chainlink",
          price: "$14.50",
          change24h: 4.2,
          marketCap: "$8B",
        },
        {
          symbol: "AVAX",
          name: "Avalanche",
          id: "avalanche",
          price: "$36.20",
          change24h: 2.1,
          marketCap: "$14B",
        },
        {
          symbol: "DOGE",
          name: "Dogecoin",
          id: "dogecoin",
          price: "$0.073",
          change24h: -0.8,
          marketCap: "$10B",
        },
        {
          symbol: "BNB",
          name: "Binance Coin",
          id: "binancecoin",
          price: "$312",
          change24h: 1.5,
          marketCap: "$48B",
        },
      ];
      setLiveTokens(fallbackTokens);
      setLoadingProgress(100);
      setApiDataReady(true);
      setIsLoading(false);
    }
  };

  // Pre-fetch API data when name is entered (step 1)
  useEffect(() => {
    if (name.trim().length > 0 && !apiDataReady && !isLoading) {
      console.log("Pre-fetching API data...");
      fetchLiveTokens();
    }
  }, [name, apiDataReady, isLoading]);

  const handleNext = () => {
    if (step < 2) {
      // Show hold animation for 2.5 seconds when moving to step 2
      setShowHoldAnimation(true);

      setTimeout(() => {
        setShowHoldAnimation(false);
        setStep(step + 1);
      }, 2500);
    } else {
      // Save user preferences
      const userPrefs = {
        userName: name,
        onboardingComplete: true,
        setupDate: new Date().toISOString(),
      };

      localStorage.setItem("onboardingComplete", "true");
      localStorage.setItem("userName", name);

      // Navigate to dashboard
      navigate("/dashboard", { state: userPrefs });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return apiDataReady; // Can proceed once API data is ready
      default:
        return false;
    }
  };

  // Hold animation component
  const HoldAnimation = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-[#2A2A2A] rounded-full"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-[#00D2FF] border-t-transparent rounded-full animate-spin"></div>
          <div
            className="absolute top-2 left-2 w-20 h-20 border-4 border-[#39FF14] border-b-transparent rounded-full animate-spin animate-reverse"
            style={{ animationDuration: "1.5s" }}
          ></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">
          Fetching Available Coins 🪙
        </h2>
        <p className="text-gray-400 animate-pulse">
          Setting up your personalized crypto experience...
        </p>
        <div className="mt-6 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-[#00D2FF] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  // Show hold animation when transitioning
  if (showHoldAnimation) {
    return <HoldAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#333]/50 rounded-2xl p-8 px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold">Step {step} of 2</span>
              <span className="text-gray-400">
                {Math.round((step / 2) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-[#2A2A2A] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-1">
                Welcome to CryptoSentinel! 🚀
              </h2>
              <p className="text-gray-400 mb-8">
                Let's get you set up with your personalized crypto monitoring
              </p>

              <div className="max-w-md mx-auto">
                <label
                  htmlFor="name"
                  className="text-white text-left block mb-2 font-medium"
                >
                  What should we call you?
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#2A2A2A] border border-[#333] text-white text-center w-full py-3 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                  maxLength={50}
                />
                {name.trim().length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[#39FF14] text-sm">
                      Nice to meet you, {name}! 👋
                    </p>
                    {isLoading && (
                      <div className="flex items-center justify-center gap-2 text-[#00D2FF] text-xs">
                        <div className="w-3 h-3 border border-[#00D2FF] border-t-transparent rounded-full animate-spin"></div>
                        <span>Preparing your data...</span>
                      </div>
                    )}
                    {apiDataReady && !isLoading && (
                      <div className="flex items-center justify-center gap-2 text-white text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Ready to go!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-1 text-center">
                Live Crypto Data 📈
              </h2>
              <p className="text-gray-400 mb-4 text-center">
                Here are the cryptocurrencies we're currently monitoring for you
              </p>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {liveTokens.map((token, index) => (
                  <div
                    key={token.id}
                    className="p-3 rounded-xl border border-[#333] bg-[#1A1A1A]/50 hover:border-[#555] transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="text-center">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-left min-w-0 flex-1">
                          <div className="text-white font-bold text-base truncate">
                            {token.symbol}
                          </div>
                          <div className="text-gray-400 text-xs truncate">
                            {token.name}
                          </div>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className="text-[#39FF14] text-sm font-bold">
                            {token.price}
                          </div>
                          {token.change24h && (
                            <div
                              className={`text-xs font-medium ${
                                token.change24h >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {token.change24h >= 0 ? "+" : ""}
                              {token.change24h.toFixed(2)}%
                            </div>
                          )}
                        </div>
                      </div>
                      {token.marketCap && (
                        <div className="text-gray-500 text-xs mt-2 pt-2 border-t border-[#333]/50 truncate">
                          Cap: {token.marketCap}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`px-6 py-2 rounded-xl border transition-all duration-200 ${
                step === 1
                  ? "border-[#333] text-gray-600 cursor-not-allowed"
                  : "border-[#333] text-gray-400 hover:text-white hover:border-[#555] cursor-pointer"
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-2 rounded-xl font-semibold transition-all duration-200 ${
                canProceed()
                  ? "bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black hover:scale-105 cursor-pointer shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {step === 2 ? "Enter Dashboard 📊" : "Next"}
            </button>
          </div>

          {step === 2 && (
            <div className="mt-6 p-4 bg-[#2A2A2A]/50 rounded-xl border border-[#333]/50">
              <p className="text-gray-400 text-sm text-center">
                💡 Your dashboard will show detailed analytics and AI-powered
                insights for these cryptocurrencies
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
