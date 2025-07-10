import React from 'react';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface PostureAnalysis {
  isGoodPosture: boolean;
  issues: string[];
  confidence: number;
  timestamp: number;
}

interface AnalysisHistoryProps {
  analyses: PostureAnalysis[];
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ analyses }) => {
  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No analysis history yet. Start detecting posture to see results here.</p>
      </div>
    );
  }

  const recentAnalyses = analyses.slice(-10).reverse();
  const goodPostureCount = analyses.filter(a => a.isGoodPosture).length;
  const successRate = (goodPostureCount / analyses.length) * 100;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getMostCommonIssues = () => {
    const issueCount: { [key: string]: number } = {};
    
    analyses.forEach(analysis => {
      analysis.issues.forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });

    return Object.entries(issueCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const commonIssues = getMostCommonIssues();

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-gray-900">{analyses.length}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{successRate.toFixed(1)}%</p>
            </div>
            {successRate >= 70 ? (
              <TrendingUp className="h-8 w-8 text-green-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-600" />
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Good Posture</p>
              <p className="text-2xl font-bold text-gray-900">{goodPostureCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Common Issues */}
      {commonIssues.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Issues</h3>
          <div className="space-y-2">
            {commonIssues.map(([issue, count], index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{issue}</span>
                <span className="text-sm font-medium text-gray-900">{count} times</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Analyses */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
        <div className="space-y-3">
          {recentAnalyses.map((analysis, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {analysis.isGoodPosture ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-medium ${
                    analysis.isGoodPosture ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {analysis.isGoodPosture ? 'Good Posture' : 'Poor Posture'}
                  </p>
                  <span className="text-xs text-gray-500">{formatTime(analysis.timestamp)}</span>
                </div>
                {analysis.issues.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {analysis.issues.join(', ')}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Confidence: {(analysis.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;