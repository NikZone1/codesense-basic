import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code,
  AlertCircle,
  Shield,
  Zap,
  FileCode,
  BarChart4,
  GitCompare,
  FileWarning,
  CheckCircle2,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Terminal,
  Code2
} from 'lucide-react';

const ReviewResult = () => {
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState('original');
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const storedReview = localStorage.getItem('codeReviewResult');
    if (storedReview) {
      setReview(JSON.parse(storedReview));
    } else {
      navigate('/');
    }
  }, [navigate]);

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

  const SectionCard = ({ title, icon: Icon, children, score }) => (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg sm:rounded-xl shadow-xl p-3 sm:p-6 border border-gray-700/30">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400" />
        <h3 className="text-base sm:text-xl font-semibold text-white">{title}</h3>
        {score !== undefined && (
          <span className={`ml-auto px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-base ${getScoreBackground(score)} ${getSeverityColor(score)} font-medium`}>
            {score}/100
          </span>
        )}
      </div>
      {children}
    </div>
  );

  const Finding = ({ finding }) => (
    <div className="border border-gray-700/30 rounded-lg p-2 sm:p-4 mb-2 sm:mb-4">
      <h4 className="text-sm sm:text-lg font-medium text-blue-400 mb-1 sm:mb-2">{finding.aspect || finding.issue}</h4>
      <p className="text-gray-300 text-xs sm:text-base mb-1 sm:mb-2">{finding.explanation}</p>
      {finding.recommendation && (
        <div className="mt-1 sm:mt-2">
          <span className="text-purple-400 font-medium text-xs sm:text-base">Recommendation: </span>
          <span className="text-gray-300 text-xs sm:text-base">{finding.recommendation}</span>
        </div>
      )}
    </div>
  );

  const CodeSection = ({ review }) => {
    if (!review?.corrections?.hasCorrections) {
      return (
        <div className="flex items-center justify-center p-8 border border-gray-700/30 rounded-lg">
          <FileWarning className="h-6 w-6 text-gray-400 mr-2" />
          <span className="text-gray-400">No code corrections available</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'original' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('original')}
          >
            Original Code
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'corrected' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('corrected')}
          >
            Corrected Code
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'changes' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('changes')}
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
              {activeTab === 'original' ? localStorage.getItem('originalCode') : review.corrections.correctedCode}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if (!review) return null;

  const { metrics, structureAnalysis, implementationReview, bestPractices, recommendations } = review;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Professional header with gradient */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Back</span>
              </button>
              <div className="flex items-center">
                <Code2 className="h-8 w-8 text-red-500" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent ml-2" style={{ fontFamily: "'Bebas Neue', cursive" }}>
                  CodeSense
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Metrics section with improved design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm uppercase tracking-wider">{key}</h3>
                  <BarChart4 className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">{value}</span>
                  <span className="ml-2 text-gray-400">/100</span>
                </div>
                <div className="mt-4 h-2 bg-gray-700/50 rounded-full overflow-hidden">
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
            ))}
          </div>

          {/* Code comparison section with improved design */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden mb-12">
            <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700/30">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("original")}
                  className={`px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "original" 
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <FileCode className="h-5 w-5" />
                  <span>Original</span>
                </button>
                <button
                  onClick={() => setActiveTab("corrected")}
                  className={`px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "corrected" 
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Corrected</span>
                </button>
                <button
                  onClick={() => setActiveTab("changes")}
                  className={`px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "changes" 
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <GitCompare className="h-5 w-5" />
                  <span>Changes</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {activeTab === "original" && localStorage.getItem('originalCode')}
                {activeTab === "corrected" && review.corrections.correctedCode}
                {activeTab === "changes" && review.corrections.changes.map(change => change.correction).join('\n')}
              </pre>
            </div>
          </div>

          {/* Review sections with improved design */}
          <div className="space-y-6">
            {Object.entries(review).map(([section, data]) => (
              <div key={section} className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/30 overflow-hidden">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-700/30 rounded-lg">
                      {section === 'structureAnalysis' && <Terminal className="h-5 w-5 text-red-500" />}
                      {section === 'implementationReview' && <Code className="h-5 w-5 text-red-500" />}
                      {section === 'bestPractices' && <Shield className="h-5 w-5 text-red-500" />}
                      {section === 'recommendations' && <Sparkles className="h-5 w-5 text-red-500" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{section}</h3>
                      {data.score && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-2 w-2 rounded-full ${
                            data.score >= 80 ? "bg-green-500" :
                            data.score >= 60 ? "bg-yellow-500" :
                            "bg-red-500"
                          }`} />
                          <span className="text-sm text-gray-400">Score: {data.score}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {expandedSections[section] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {expandedSections[section] && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 mb-6">{data.explanation}</p>
                    {data.findings && data.findings.length > 0 && (
                      <div className="space-y-4">
                        {data.findings.map((finding, index) => (
                          <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                            <div className="flex items-start gap-4">
                              <div className="p-2 rounded-lg bg-gray-800/50">
                                {finding.severity === "high" ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : finding.severity === "medium" ? (
                                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                                ) : (
                                  <Info className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium mb-2">{finding.title}</h4>
                                <p className="text-gray-400 mb-3">{finding.description}</p>
                                {finding.recommendation && (
                                  <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-sm">{finding.recommendation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewResult;