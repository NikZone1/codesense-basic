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
  FileWarning
} from 'lucide-react';

const ReviewResult = () => {
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState('original');

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
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-700/30">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {score !== undefined && (
          <span className={`ml-auto px-3 py-1 rounded-full ${getScoreBackground(score)} ${getSeverityColor(score)} font-medium`}>
            {score}/100
          </span>
        )}
      </div>
      {children}
    </div>
  );

  const Finding = ({ finding }) => (
    <div className="border border-gray-700/30 rounded-lg p-4 mb-4">
      <h4 className="text-lg font-medium text-blue-400 mb-2">{finding.aspect || finding.issue}</h4>
      <p className="text-gray-300 mb-2">{finding.explanation}</p>
      {finding.recommendation && (
        <div className="mt-2">
          <span className="text-purple-400 font-medium">Recommendation: </span>
          <span className="text-gray-300">{finding.recommendation}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        `}
      </style>

      <div className="max-w-6xl mx-auto" style={{ fontFamily: "'Prompt', sans-serif" }}>
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Code Input
        </button>

        <div className="text-center mb-12">
          <h1 
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500" 
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            &lt;CodeSense?&gt;
          </h1>
          <p className="mt-4 text-2xl text-gray-300">Comprehensive Review and Recommendations</p>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Overall', score: metrics.overallScore, icon: BarChart4 },
            { label: 'Quality', score: metrics.qualityScore, icon: CheckCircle },
            { label: 'Security', score: metrics.securityScore, icon: Shield },
            { label: 'Performance', score: metrics.performanceScore, icon: Zap },
            { label: 'Maintainability', score: metrics.maintainabilityScore, icon: FileCode },
          ].map((metric) => (
            <div key={metric.label} className={`${getScoreBackground(metric.score)} rounded-xl p-4 backdrop-blur-lg border border-gray-700/30`}>
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`h-5 w-5 ${getSeverityColor(metric.score)}`} />
                <span className="text-gray-300">{metric.label}</span>
              </div>
              <div className={`text-2xl font-bold ${getSeverityColor(metric.score)}`}>
                {metric.score}/100
              </div>
            </div>
          ))}
        </div>

        {/* Code Corrections Section */}
        <div className="mb-8">
          <SectionCard title="Code Analysis" icon={Code}>
            <CodeSection review={review} />
          </SectionCard>
        </div>

        {/* Main Analysis Sections */}
        <div className="space-y-8">
          <SectionCard 
            title="Architecture & Code Quality" 
            icon={Code}
            score={structureAnalysis.architecture.score}
          >
            {structureAnalysis.architecture.findings.map((finding, index) => (
              <Finding key={index} finding={finding} />
            ))}
          </SectionCard>

          <SectionCard 
            title="Implementation & Performance" 
            icon={Zap}
            score={implementationReview.errorHandling.score}
          >
            {implementationReview.errorHandling.issues.map((issue, index) => (
              <Finding key={index} finding={issue} />
            ))}
          </SectionCard>

          <SectionCard 
            title="Best Practices & Security" 
            icon={Shield}
            score={bestPractices.security.score}
          >
            {bestPractices.security.vulnerabilities.map((vuln, index) => (
              <Finding key={index} finding={vuln} />
            ))}
          </SectionCard>

          <SectionCard title="Key Recommendations" icon={AlertCircle}>
            <div className="space-y-4">
              {recommendations.items.map((item, index) => (
                <div key={index} className="border border-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      item.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      item.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {item.severity.toUpperCase()}
                    </span>
                    <span className="text-blue-400 font-medium">{item.category}</span>
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">{item.title}</h4>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default ReviewResult;