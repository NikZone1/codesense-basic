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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  if (!review) return null;

  const { metrics, structureAnalysis, implementationReview, bestPractices, recommendations } = review;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Professional header with gradient */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Back</span>
              </button>
              <div className="flex items-center">
                <Code2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent ml-2">
                  CodeSense
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Metrics section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-xs sm:text-sm uppercase tracking-wider text-gray-400">{key}</h3>
                  <BarChart4 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl sm:text-4xl font-bold text-white">{value}</span>
                  <span className="ml-2 text-gray-400">/100</span>
                </div>
                <div className="mt-2 sm:mt-4 h-1.5 sm:h-2 bg-gray-700/50 rounded-full overflow-hidden">
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

          {/* Code comparison section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden mb-8 sm:mb-12">
            <div className="bg-gray-900/50 border-b border-gray-700/30 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => setActiveTab("original")}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm ${
                    activeTab === "original" 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <FileCode className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Original</span>
                </button>
                <button
                  onClick={() => setActiveTab("corrected")}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm ${
                    activeTab === "corrected" 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Corrected</span>
                </button>
                <button
                  onClick={() => setActiveTab("changes")}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm ${
                    activeTab === "changes" 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <GitCompare className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Changes</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "changes" ? (
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
                    {activeTab === "original" ? localStorage.getItem('originalCode') : review.corrections.correctedCode}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Review sections */}
          <div className="space-y-6">
            <SectionCard title="Structure Analysis" icon={Terminal} score={structureAnalysis.score}>
              <div className="space-y-3">
                {structureAnalysis.findings.map((finding, index) => (
                  <Finding key={index} finding={finding} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Implementation Review" icon={Code} score={implementationReview.score}>
              <div className="space-y-3">
                {implementationReview.findings.map((finding, index) => (
                  <Finding key={index} finding={finding} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Best Practices" icon={Shield} score={bestPractices.score}>
              <div className="space-y-3">
                {bestPractices.findings.map((finding, index) => (
                  <Finding key={index} finding={finding} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Recommendations" icon={Zap}>
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="border border-gray-700/30 rounded-lg p-3 sm:p-4">
                    <h4 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-blue-400">{recommendation.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-300">{recommendation.description}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewResult;