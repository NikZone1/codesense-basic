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
  BarChart4
} from 'lucide-react';

const ReviewResult = () => {
  const navigate = useNavigate();
  const [review, setReview] = useState(null);

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

  if (!review) return null;

  const { metrics, structureAnalysis, implementationReview, bestPractices, recommendations } = review;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* Import font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        `}
      </style>

      {/* Apply font globally to body */}
      <div className="max-w-6xl mx-auto" style={{ fontFamily: "'Prompt', sans-serif" }}>
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Code Input
        </button>

        <div className="text-center mb-12">
        {/* Import font */}
<style>
  {`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  `}
</style>

{/* Apply font to h1 only */}
<h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500" style={{ fontFamily: "'Press Start 2P', cursive" }}>
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

        {/* Main Analysis Sections */}
        <div className="space-y-8">
          {/* Structure Analysis */}
          <SectionCard 
            title="Architecture & Code Quality" 
            icon={Code}
            score={structureAnalysis.architecture.score}
          >
            {structureAnalysis.architecture.findings.map((finding, index) => (
              <Finding key={index} finding={finding} />
            ))}
          </SectionCard>

          {/* Implementation Review */}
          <SectionCard 
            title="Implementation & Performance" 
            icon={Zap}
            score={implementationReview.errorHandling.score}
          >
            {implementationReview.errorHandling.issues.map((issue, index) => (
              <Finding key={index} finding={issue} />
            ))}
          </SectionCard>

          {/* Best Practices */}
          <SectionCard 
            title="Best Practices & Security" 
            icon={Shield}
            score={bestPractices.security.score}
          >
            {bestPractices.security.vulnerabilities.map((vuln, index) => (
              <Finding key={index} finding={vuln} />
            ))}
          </SectionCard>

          {/* Recommendations */}
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
