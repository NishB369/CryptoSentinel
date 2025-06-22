import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";

const InternalNavbar = ({
  userName,
  isRefreshing,
  lastUpdated,
  onManualRefresh,
  onLogout,
  isAI,
}) => {
  const navigate = useNavigate();

  return (
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
            {!isAI && (
              <button
                onClick={() => navigate("/insights")}
                className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black font-semibold hover:scale-105 transition-all duration-300 p-2 sm:px-3 lg:px-4 h-9 sm:h-10 rounded-md cursor-pointer ease-in-out flex items-center justify-center min-w-[36px] sm:min-w-[44px]"
                title="AI Insights"
              >
                <div className="w-4 h-4 sm:mr-0 lg:mr-2 -mt-2">
                  <span className="bi bi-lightning-charge-fill"></span>
                </div>
                <div className="hidden lg:block">AI</div>
              </button>
            )}

            {/* Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-400 bg-[#2A2A2A]/50 px-2 sm:px-3 py-2 rounded-lg">
              <div
                className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${
                  isRefreshing ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                }`}
              ></div>
              <span className="hidden md:inline">
                {isRefreshing
                  ? "Updating..."
                  : lastUpdated
                  ? `Updated ${lastUpdated}`
                  : "Live"}
              </span>
              <span className="md:hidden">{isRefreshing ? "..." : "Live"}</span>
              <button
                onClick={onManualRefresh}
                className="ml-1 sm:ml-2 text-[#39FF14] hover:text-[#39FF14]/80 font-bold text-sm sm:text-lg"
                disabled={isRefreshing}
                title="Refresh Data"
              >
                ↻
              </button>
            </div>

            {/* Mobile Status Button */}
            <button
              onClick={onManualRefresh}
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
            {!isAI && (
              <button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-2 sm:px-3 lg:px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all text-xs sm:text-sm font-medium cursor-pointer"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            )}

            {/* Dashboard Button */}
            {isAI && (
              <button
                onClick={onLogout}
                className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black px-2 sm:px-3 lg:px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300s text-xs sm:text-sm font-medium cursor-pointer flex items-center justify-between"
              >
                <LayoutDashboard className="w-4 h-4  md:hidden" />
                <span className="hidden md:block">Dashboard</span>
                <ChevronLeft className="w-4 h-4 hidden md:block" />
              </button>
            )}
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
  );
};

export default InternalNavbar;
