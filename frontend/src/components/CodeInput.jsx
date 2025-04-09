import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, UploadCloud, Circle } from "lucide-react";
import Typewriter from 'typewriter-effect';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CodeInput = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await axios.get(`${API_URL}/ping`);
        setBackendStatus("✅ Backend is running");
      } catch (error) {
        setBackendStatus("❌ Backend is down");
        console.error("Error checking backend status:", error);
      }
    };

    checkBackendStatus();
    const intervalId = setInterval(checkBackendStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleReview = async () => {
    if (!code.trim()) {
      alert("Please enter or upload code for review.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/review`, { code }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Store both the review result AND the original code
      localStorage.setItem('codeReviewResult', JSON.stringify(response.data));
      localStorage.setItem('originalCode', code); // Store the original code
      
      navigate('/review');
    } catch (error) {
      console.error("Error during code review:", error);
      alert(`Error fetching review: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const LineNumbers = () => {
    const lines = code.split('\n').length;
    return (
      <div className="select-none text-right pl-3 pr-3 text-gray-500 font-mono text-sm">
        {Array.from({ length: Math.max(lines, 1) }, (_, i) => (
          <div key={i + 1} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-4 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-4 sm:mt-20">
        <div className="text-center mb-6 sm:mb-12">
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
              @media (max-width: 640px) {
                .pixel-font {
                  font-size: 1.5rem;
                  line-height: 1.75rem;
                }
              }
            `}
          </style>
          <h1 className="text-2xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 pixel-font" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            &lt;CodeSense?&gt;
          </h1>
          <p className="mt-2 sm:mt-4 text-base sm:text-2xl text-gray-300">
            <Typewriter
              options={{
                strings: ['Smart. Fast. Flawless.', 'AI powered code reviews at your fingertips.'],
                autoStart: true,
                loop: true,
              }}
            />
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden">
          {/* Mac-style window controls */}
          <div className="bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-3 border-b border-gray-700/30 flex items-center">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="h-[6px] w-[6px] sm:h-[8px] sm:w-[8px] rounded-full bg-red-500" />
              <div className="h-[6px] w-[6px] sm:h-[8px] sm:w-[8px] rounded-full bg-yellow-500" />
              <div className="h-[6px] w-[6px] sm:h-[8px] sm:w-[8px] rounded-full bg-green-500" />
            </div>
            {fileName && (
              <span className="ml-2 sm:ml-4 text-[10px] sm:text-sm text-gray-400 font-mono truncate">
                {fileName}
              </span>
            )}
          </div>

          {/* Code editor with line numbers */}
          <div className="flex">
            <LineNumbers />
            <textarea
              className="w-full min-h-[20rem] sm:min-h-[24rem] px-2 sm:px-4 py-2 sm:py-3 bg-gray-900/50 text-gray-100 border-l border-gray-700/50 focus:outline-none font-mono text-[11px] sm:text-sm leading-5 sm:leading-6 resize-none"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          {/* File upload and controls */}
          <div className="bg-gray-800/50 p-2 sm:p-4 border-t border-gray-700/30">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <label htmlFor="fileUpload" className="flex items-center justify-center px-2 sm:px-6 py-1.5 sm:py-2 bg-gray-700/20 text-gray-100 border border-gray-700/50 rounded-md sm:rounded-lg cursor-pointer hover:bg-gray-700/30 transition-colors duration-200">
                <UploadCloud className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-[10px] sm:text-sm">Choose File</span>
              </label>
              <input id="fileUpload" type="file" accept=".py,.js,.java,.c,.cpp,.txt" onChange={handleFileUpload} className="hidden" />
            </div>
          </div>
        </div>

        <div className="text-center mt-2 sm:mt-4 text-[10px] sm:text-sm font-medium text-gray-300">
          {backendStatus}
        </div>

        <div className="flex justify-end mt-3 sm:mt-6">
          <button
            onClick={handleReview}
            className={`px-3 sm:px-8 py-1.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md sm:rounded-xl font-medium text-xs sm:text-base
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'}
              transition-all duration-300 ease-in-out flex items-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-blue-500/30`}
            disabled={loading || !code.trim() || backendStatus.includes("❌")}
          >
            {loading && <Loader className="h-3 w-3 sm:h-5 sm:w-5 animate-spin" />}
            {loading ? "Analyzing..." : "Analyze Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeInput;