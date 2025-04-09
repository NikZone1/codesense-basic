import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, UploadCloud, Play, Settings, Code2, Terminal, Shield, Zap, Sparkles, X, AlertTriangle, CheckCircle, XCircle, GitCompare, FileWarning, CheckCircle2, Info, ChevronRight, ChevronDown, ChevronUp, BarChart4 } from "lucide-react";
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
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState('original');
  const [expandedSections, setExpandedSections] = useState({
    structure: true,
    implementation: true,
    bestPractices: true,
    recommendations: true
  });

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
      
      // Validate the response data
      if (response.data && typeof response.data === 'object') {
        setReview(response.data);
        // Store the original code for comparison
        localStorage.setItem('originalCode', code);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error("Error during code review:", error);
      alert(`Error fetching review: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const MetricCard = ({ title, value, icon: Icon }) => (
    <div className={`${
      isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
    } backdrop-blur-lg rounded-xl p-4 border`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase tracking-wider text-gray-400">{title}</h3>
        <Icon className="h-4 w-4 text-red-500" />
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="ml-2 text-gray-400">/100</span>
      </div>
      <div className="mt-2 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            value >= 80 ? 'bg-green-500' : 
            value >= 60 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  const FindingCard = ({ finding, type }) => (
    <div className={`${
      isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'
    } border rounded-lg p-4 mb-3`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          type === 'error' ? 'bg-red-500/10' : 
          type === 'warning' ? 'bg-yellow-500/10' : 
          'bg-blue-500/10'
        }`}>
          {type === 'error' ? <AlertTriangle className="h-5 w-5 text-red-400" /> :
           type === 'warning' ? <Info className="h-5 w-5 text-yellow-400" /> :
           <CheckCircle2 className="h-5 w-5 text-blue-400" />}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-400 mb-1">{finding.aspect || finding.issue}</h4>
          <p className="text-gray-300 text-sm mb-2">{finding.explanation}</p>
          {finding.recommendation && (
            <div className="mt-2">
              <span className="text-purple-400 font-medium text-sm">Recommendation: </span>
              <span className="text-gray-300 text-sm">{finding.recommendation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CodeComparison = () => {
    if (!review?.corrections?.hasCorrections) {
      return (
        <div className="flex items-center justify-center p-8 border border-gray-700/30 rounded-lg">
          <FileCode className="h-6 w-6 text-gray-400 mr-2" />
          <span className="text-gray-400">No code corrections available</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('original')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'original' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Original Code
          </button>
          <button
            onClick={() => setActiveTab('corrected')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'corrected' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Corrected Code
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'changes' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Changes
          </button>
        </div>

        {activeTab === 'changes' ? (
          <div className="space-y-4">
            {review.corrections.changes.map((change, index) => (
              <div key={index} className="border border-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GitCompare className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">{change.type}</span>
                  <span className="text-gray-400 text-sm">({change.location})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <div className="text-red-400 font-medium mb-2">Original:</div>
                    <pre className="text-gray-300 overflow-x-auto">{change.original}</pre>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <div className="text-green-400 font-medium mb-2">Correction:</div>
                    <pre className="text-gray-300 overflow-x-auto">{change.correction}</pre>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-purple-400 font-medium">Explanation: </span>
                  <span className="text-gray-300">{change.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-gray-300 whitespace-pre-wrap">
              {activeTab === 'original' ? code : review.corrections.correctedCode}
            </pre>
          </div>
        )}
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
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center">
                <Code2 className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`} />
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent ml-2">
                  CodeSense
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <a href="#features" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>Features</a>
                <a href="#about" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>About</a>
                <a href="#contact" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 sm:p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                    : 'bg-gray-200/50 hover:bg-gray-300/50'
                } transition-colors duration-200`}
              >
                <Settings className={`h-4 w-4 sm:h-5 sm:w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero section with features */}
          <div className="text-center mb-8 sm:mb-16">
            <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
              isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-100 border-red-200'
            } border mb-4 sm:mb-6`}>
              <Sparkles className={`h-3 w-3 sm:h-4 sm:w-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mr-2`} />
              <span className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} text-xs sm:text-sm`}>AI-Powered Code Analysis</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r ${
              isDarkMode ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'
            } bg-clip-text text-transparent`}>
              Smart Code Review
            </h2>
            <p className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto mb-6 sm:mb-8`}>
              <Typewriter
                options={{
                  strings: ['Smart. Fast. Flawless.', 'AI powered code reviews at your fingertips.'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
              <div className={`${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
              } backdrop-blur-lg rounded-xl p-4 sm:p-6 border`}>
                <Terminal className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'} mb-2 sm:mb-4`} />
                <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Code Analysis</h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advanced AI-powered code review and optimization suggestions</p>
              </div>
              <div className={`${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
              } backdrop-blur-lg rounded-xl p-4 sm:p-6 border`}>
                <Shield className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'} mb-2 sm:mb-4`} />
                <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Security Check</h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Comprehensive security vulnerability detection</p>
              </div>
              <div className={`${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
              } backdrop-blur-lg rounded-xl p-4 sm:p-6 border`}>
                <Zap className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-red-500' : 'text-red-600'} mb-2 sm:mb-4`} />
                <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance</h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Optimization recommendations for better performance</p>
              </div>
            </div>
          </div>

          {/* Code editor section */}
          <div className={`${
            isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
          } backdrop-blur-lg rounded-xl shadow-2xl border overflow-hidden`}>
            <div className={`${
              isDarkMode ? 'bg-gray-900/50 border-gray-700/30' : 'bg-gray-200/50 border-gray-200/30'
            } px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between`}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex space-x-1.5 sm:space-x-2">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500" />
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500" />
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500" />
                </div>
                {fileName && (
                  <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-mono truncate max-w-[150px] sm:max-w-none`}>
                    {fileName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex">
              <LineNumbers />
              <textarea
                className={`w-full min-h-[15rem] sm:min-h-[24rem] px-4 sm:px-6 py-3 sm:py-4 ${
                  isDarkMode ? 'bg-gray-900/50 text-gray-100 border-gray-700/30' : 'bg-gray-200/50 text-gray-900 border-gray-200/30'
                } border-l focus:outline-none font-mono text-xs sm:text-sm leading-6 resize-none`}
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className={`${
              isDarkMode ? 'bg-gray-900/50 border-gray-700/30' : 'bg-gray-200/50 border-gray-200/30'
            } p-4 sm:p-6 border-t`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <label htmlFor="fileUpload" className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 ${
                    isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300'
                  } border rounded-lg cursor-pointer transition-colors duration-200 w-full sm:w-auto`}>
                    <UploadCloud className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-xs sm:text-sm font-medium">Choose File</span>
                  </label>
                  <input id="fileUpload" type="file" accept=".py,.js,.java,.c,.cpp,.txt" onChange={handleFileUpload} className="hidden" />
                </div>
                <button
                  onClick={handleReview}
                  className={`px-6 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium text-xs sm:text-sm
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-500 hover:to-red-600'}
                    transition-all duration-300 ease-in-out flex items-center gap-2 shadow-lg hover:shadow-red-500/30 w-full sm:w-auto`}
                  disabled={loading || !code.trim() || backendStatus.includes("❌")}
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 sm:h-5 sm:w-5" />
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

      {/* Review Results Section */}
      {review && (
        <div className="mt-8 space-y-6">
          {/* Metrics section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(review.metrics).map(([key, value]) => (
              <MetricCard key={key} title={key} value={value} icon={BarChart4} />
            ))}
          </div>

          {/* Code comparison section */}
          <div className={`${
            isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
          } backdrop-blur-lg rounded-xl shadow-2xl border overflow-hidden`}>
            <div className={`${
              isDarkMode ? 'bg-gray-900/50 border-gray-700/30' : 'bg-gray-200/50 border-gray-200/30'
            } px-4 sm:px-6 py-3 sm:py-4 border-b`}>
              <h3 className="text-lg font-semibold">Code Analysis</h3>
            </div>
            <div className="p-4 sm:p-6">
              <CodeComparison />
            </div>
          </div>

          {/* Review sections */}
          <div className="space-y-6">
            <div className={`${
              isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
            } backdrop-blur-lg rounded-xl shadow-xl p-4 border`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('structure')}
              >
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Structure Analysis</h3>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-sm ${getScoreBackground(review.structureAnalysis.score)} ${getSeverityColor(review.structureAnalysis.score)} font-medium`}>
                    {review.structureAnalysis.score}/100
                  </span>
                </div>
                {expandedSections.structure ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              {expandedSections.structure && (
                <div className="mt-4 space-y-3">
                  {review.structureAnalysis.findings.map((finding, index) => (
                    <FindingCard key={index} finding={finding} type={finding.severity || 'info'} />
                  ))}
                </div>
              )}
            </div>

            <div className={`${
              isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
            } backdrop-blur-lg rounded-xl shadow-xl p-4 border`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('implementation')}
              >
                <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Implementation Review</h3>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-sm ${getScoreBackground(review.implementationReview.score)} ${getSeverityColor(review.implementationReview.score)} font-medium`}>
                    {review.implementationReview.score}/100
                  </span>
                </div>
                {expandedSections.implementation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              {expandedSections.implementation && (
                <div className="mt-4 space-y-3">
                  {review.implementationReview.findings.map((finding, index) => (
                    <FindingCard key={index} finding={finding} type={finding.severity || 'info'} />
                  ))}
                </div>
              )}
            </div>

            <div className={`${
              isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
            } backdrop-blur-lg rounded-xl shadow-xl p-4 border`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('bestPractices')}
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Best Practices</h3>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-sm ${getScoreBackground(review.bestPractices.score)} ${getSeverityColor(review.bestPractices.score)} font-medium`}>
                    {review.bestPractices.score}/100
                  </span>
                </div>
                {expandedSections.bestPractices ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              {expandedSections.bestPractices && (
                <div className="mt-4 space-y-3">
                  {review.bestPractices.findings.map((finding, index) => (
                    <FindingCard key={index} finding={finding} type={finding.severity || 'info'} />
                  ))}
                </div>
              )}
            </div>

            <div className={`${
              isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-gray-100/50 border-gray-200/30'
            } backdrop-blur-lg rounded-xl shadow-xl p-4 border`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('recommendations')}
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Recommendations</h3>
                </div>
                {expandedSections.recommendations ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              {expandedSections.recommendations && (
                <div className="mt-4 space-y-3">
                  {review.recommendations.map((recommendation, index) => (
                    <div key={index} className="border border-gray-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-400 mb-1">{recommendation.title}</h4>
                      <p className="text-sm text-gray-300">{recommendation.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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