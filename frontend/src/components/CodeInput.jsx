import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, UploadCloud, Code, Zap, Shield, FileText } from "lucide-react";
import Typewriter from "typewriter-effect";

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
        setBackendStatus("✅ Online");
      } catch (error) {
        setBackendStatus("❌ Offline");
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
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("codeReviewResult", JSON.stringify(response.data));
      localStorage.setItem("originalCode", code);

      navigate("/review");
    } catch (error) {
      console.error("Error during code review:", error);
      alert(`Error fetching review: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const LineNumbers = () => {
    const lines = code.split("\n").length;
    return (
      <div className="select-none text-right pl-4 pr-3 text-gray-500 font-mono text-sm">
        {Array.from({ length: Math.max(lines, 1) }, (_, i) => (
          <div key={i + 1} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight">
            <span className="text-blue-400">CodeSense</span> AI
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            <Typewriter
              options={{
                strings: [
                  "Elevate Your Code with AI Precision",
                  "Professional Code Analysis at Scale",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Next-Gen Code Review
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
              {/* Editor Header */}
              <div className="bg-gray-850 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Code Editor
                  </span>
                </div>
                {fileName && (
                  <span className="text-xs font-mono text-gray-400 truncate">
                    {fileName}
                  </span>
                )}
              </div>

              {/* Code Input */}
              <div className="flex">
                <LineNumbers />
                <textarea
                  className={`w-full min-h-[200px] sm:min-h-[450px] p-4 bg-gray-850 text-gray-200 font-mono text-sm leading-6 border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
                  placeholder="Paste or type your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                />
              </div>

              {/* Controls */}
              <div className="bg-gray-800 p-4 border-t border-gray-700 flex justify-between items-center">
                <label
                  htmlFor="fileUpload"
                  className="flex items-center px-4 py-2 bg-gray-700 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                >
                  <UploadCloud className="h-5 w-5 mr-2 text-blue-400" />
                  <span className="text-sm font-medium">Upload Code</span>
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  accept=".py,.js,.java,.c,.cpp,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={handleReview}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center gap-2
                    ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"}
                    transition-all duration-200 shadow-lg hover:shadow-blue-500/30`}
                  disabled={loading || !code.trim() || backendStatus.includes("❌")}
                >
                  {loading && <Loader className="h-5 w-5 animate-spin" />}
                  {loading ? "Analyzing..." : "Run Analysis"}
                </button>
              </div>
            </div>
            <div className="text-center mt-4 text-sm text-gray-400">
              {backendStatus}
            </div>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">Why CodeSense?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Zap className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-md font-medium text-gray-200">
                    Lightning Fast
                  </h4>
                  <p className="text-sm text-gray-400">
                    Instant code analysis powered by advanced AI.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="text-md font-medium text-gray-200">
                    Secure & Reliable
                  </h4>
                  <p className="text-sm text-gray-400">
                    Your code stays safe with enterprise-grade security.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="text-md font-medium text-gray-200">
                    Detailed Reports
                  </h4>
                  <p className="text-sm text-gray-400">
                    Comprehensive insights to optimize your code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          © 2025 CodeSense. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default CodeInput;