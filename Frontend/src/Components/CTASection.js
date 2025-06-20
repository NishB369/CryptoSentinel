import { useNavigate } from "react-router";

const CTASection = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/login");
  };

  return (
    <section className="py-8 px-4 bg-black">
      <div className="container mx-auto text-center">
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] rounded-2xl md:rounded-3xl p-6 md:p-16 border border-[#333]/50 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D2FF]/5 to-[#39FF14]/5"></div>
          <div className="absolute top-4 md:top-10 left-6 md:left-20 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#00D2FF] rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 md:bottom-10 right-6 md:right-20 w-1 md:w-1.5 h-1 md:h-1.5 bg-[#39FF14] rounded-full animate-pulse delay-500"></div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Ready to Level Up Your
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] bg-clip-text text-transparent">
                Crypto Game?
              </span>
            </h2>

            <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto px-2">
              Join thousands of smart investors who never miss an opportunity.
              Start your free monitoring today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center max-w-lg sm:max-w-none mx-auto">
              <button
                onClick={handleStartFree}
                className="w-full sm:w-auto bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black font-bold px-8 md:px-12 py-3 md:py-3 text-base md:text-xl hover:scale-105 transition-transform duration-200 shadow-lg shadow-[#00D2FF]/25 cursor-pointer rounded-full ease-in-out min-w-0"
              >
                Start Free Monitoring
              </button>
              <button className="w-full sm:w-auto border-2 border-[#00D2FF] text-[#00D2FF] hover:bg-[#00D2FF] hover:text-black px-8 md:px-12 py-3 md:py-3 text-base md:text-xl transition-all duration-200 cursor-pointer rounded-full ease-in-out min-w-0">
                View Live Demo
              </button>
            </div>

            <p className="text-gray-400 text-xs md:text-sm mt-6 md:mt-8 px-4">
              No credit card required • Free forever plan available • Cancel
              anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
