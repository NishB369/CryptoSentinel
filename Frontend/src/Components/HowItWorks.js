const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect",
      description: "Link your favorite coins and set preferences",
      icon: "🔗",
    },
    {
      number: "02",
      title: "Monitor",
      description: "Our bots track 24/7 across multiple sources",
      icon: "👁️",
    },
    {
      number: "03",
      title: "Act",
      description: "Get actionable insights and never miss opportunities",
      icon: "⚡",
    },
  ];

  return (
    <section className="py-10 px-6 bg-black">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            How It <span className="text-[#39FF14]">Works</span>
          </h2>
          <p className="text-xl text-gray-300">
            Simple setup, powerful results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 text-5xl hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                <div className="flex items-end gap-2 justify-center">
                  <div className="text-[#00D2FF] text-6xl font-bold mb-4 opacity-75">
                    {step.number}
                  </div>

                  <h3 className="text-white font-bold text-3xl mb-4">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-md max-w-sm mx-auto leading-tight w-2/3">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
