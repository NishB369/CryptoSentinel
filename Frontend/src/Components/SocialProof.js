const SocialProof = () => {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "DeFi Investor",
      content:
        "CryptoSentinel saved me from missing the last SOL pump. The AI predictions are surprisingly accurate!",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Crypto Trader",
      content:
        "Finally, a platform that actually helps me make better decisions instead of just showing more charts.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Portfolio Manager",
      content:
        "The multi-exchange monitoring is game-changing. I catch arbitrage opportunities I would have missed.",
      rating: 5,
    },
  ];

  return (
    <section className="py-10 px-6 bg-black">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#39FF14]/30 rounded-full px-6 py-3 mb-8">
            <span className="text-[#39FF14] font-semibold">
              Featured in TechCrunch
            </span>
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join{" "}
            <span className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] bg-clip-text text-transparent">
              10,000+
            </span>{" "}
            Smart Investors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#333]/50 rounded-xl p-8 hover:border-[#00D2FF]/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#39FF14]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
