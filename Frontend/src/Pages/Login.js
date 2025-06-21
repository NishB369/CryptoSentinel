import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-[#1A1A1A]/60 backdrop-blur-sm border border-[#333]/50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to your CryptoSentinel account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-start w-full">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-[#2A2A2A] border-[#333] text-white w-full py-3 rounded-xl pl-4 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-[#2A2A2A] border-[#333] text-white w-full py-3 rounded-xl pl-4 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00D2FF] to-[#39FF14] text-black font-semibold py-3 rounded-xl cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?
              <span className="text-[#00D2FF] ml-1 cursor-pointer hover:underline">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
