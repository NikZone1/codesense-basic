import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, UploadCloud, Play, Settings, Code2, Terminal, Shield, Zap, Sparkles, X } from "lucide-react";
import Typewriter from 'typewriter-effect';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CodeInput = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [fileName, setFileName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });
  const [autoSave, setAutoSave] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

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
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-900'
    }`}>
      {/* Professional header with gradient */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-black/90 to-transparent' 
          : 'bg-gradient-to-b from-white/90 to-transparent'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Code2 className={`h-8 w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`} />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent ml-2">
                  CodeSense
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <a href="#features" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>Features</a>
                <a href="#about" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>About</a>
                <a href="#contact" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                    : 'bg-gray-200/50 hover:bg-gray-300/50'
                } transition-colors duration-200`}
              >
                <Settings className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero section with features */}
          <div className="text-center mb-16">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-100 border-red-200'
            } border mb-6`}>
              <Sparkles className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mr-2`} />
              <span className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} text-sm`}>AI-Powered Code Analysis</span>
            </div>
            <h2 className={`text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r ${
              isDarkMode ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'
            } bg-clip-text text-transparent`}>
              Smart Code Review
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto mb-8`}>
              <Typewriter
                options={{
                  strings: ['Smart. Fast. Flawless.', 'AI powered code reviews at your fingertips.'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className={`${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
              } backdrop-blur-lg rounded-xl p-6 border`}>
                <Terminal className={`h-8 w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'} mb-4`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Code Analysis</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advanced AI-powered code review and optimization suggestions</p>
              </div>
              <div className={`${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
              } backdrop-blur-lg rounded-xl p-6 border`}>
                <Shield className={`h-8 w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'} mb-4`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Check</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Comprehensive security vulnerability detection</p>
              </div>
              <div className={`${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
              } backdrop-blur-lg rounded-xl p-6 border`}>
                <Zap className={`h-8 w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'} mb-4`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Optimization recommendations for better performance</p>
              </div>
            </div>
          </div>

          {/* Code editor section */}
          <div className={`${
            isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
          } backdrop-blur-lg rounded-xl shadow-2xl border overflow-hidden`}>
            <div className={`${
              isDarkMode ? 'bg-gray-900/50 border-gray-700/30' : 'bg-gray-200/50 border-gray-200/30'
            } px-6 py-4 border-b flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                {fileName && (
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-mono truncate`}>
                    {fileName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex">
              <LineNumbers />
              <textarea
                className={`w-full min-h-[20rem] sm:min-h-[24rem] px-6 py-4 ${
                  isDarkMode ? 'bg-gray-900/50 text-gray-100 border-gray-700/30' : 'bg-gray-200/50 text-gray-900 border-gray-200/30'
                } border-l focus:outline-none font-mono text-sm leading-6 resize-none`}
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className={`${
              isDarkMode ? 'bg-gray-900/50 border-gray-700/30' : 'bg-gray-200/50 border-gray-200/30'
            } p-6 border-t`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label htmlFor="fileUpload" className={`flex items-center justify-center px-6 py-2.5 ${
                    isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300'
                  } border rounded-lg cursor-pointer transition-colors duration-200`}>
                    <UploadCloud className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Choose File</span>
                  </label>
                  <input id="fileUpload" type="file" accept=".py,.js,.java,.c,.cpp,.txt" onChange={handleFileUpload} className="hidden" />
                </div>
                <button
                  onClick={handleReview}
                  className={`px-8 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium text-sm
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-500 hover:to-red-600'}
                    transition-all duration-300 ease-in-out flex items-center gap-2 shadow-lg hover:shadow-red-500/30`}
                  disabled={loading || !code.trim() || backendStatus.includes("❌")}
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      <span>Analyze Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="text-center mt-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-200/50 border-gray-200/30'
            } border`}>
              <div className={`h-2 w-2 rounded-full mr-2 ${backendStatus.includes("✅") ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{backendStatus}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${
            isDarkMode ? 'bg-gray-900 border-gray-700/30' : 'bg-white border-gray-200/30'
          } rounded-xl p-8 max-w-md w-full mx-4 border`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors duration-200`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>Dark Mode</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Toggle between light and dark themes</p>
                </div>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-14 h-7 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                  } rounded-full relative transition-colors duration-200`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${isDarkMode ? 'left-7' : 'left-0.5'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>Auto-save</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Automatically save your code</p>
                </div>
                <button 
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-14 h-7 ${
                    autoSave ? 'bg-red-600' : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                  } rounded-full relative transition-colors duration-200`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${autoSave ? 'left-7' : 'left-0.5'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeInput;