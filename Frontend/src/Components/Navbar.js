import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  const scrollToSection = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00D2FF] to-[#39FF14] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">
                <div className="bi bi-robot text-black text-xl mt-[2px]"></div>
              </span>
            </div>
            <span className="text-white font-bold text-xl">CryptoSentinel</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Testimonials
            </button>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black font-semibold hover:scale-105 transition-all duration-300 p-2 md:px-4 h-8 rounded-md cursor-pointer ease-in-out flex items-center justify-between"
          >
            <div className="w-4 h-4 md:mr-2 bi bi-grid-1x2-fill -mt-2"></div>
            <div className="hidden md:block">Dashboard</div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
