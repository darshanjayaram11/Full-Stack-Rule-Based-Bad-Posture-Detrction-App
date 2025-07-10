import React, { useState } from 'react';
import { Camera, Upload, BarChart3, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import PostureDetector from './components/PostureDetector';
import AnalysisHistory from './components/AnalysisHistory';
import PostureGuide from './components/PostureGuide';
import { useRef, useEffect } from 'react';

// initial 
interface PostureAnalysis {
  isGoodPosture: boolean;
  issues: string[];
  confidence: number;
  timestamp: number;
}

type TabType = 'detector' | 'history' | 'guide';
type ModeType = 'webcam' | 'upload';

function App() {

const videoRef = useRef<HTMLVideoElement>(null);


// This will make the video play at normal speed and only once
useEffect(() => {
  const vid = videoRef.current;
  if (vid) {
    vid.playbackRate = 1.0; // normal speed
    vid.loop = false; // no auto-repeat
    const handleEnd = () => vid.pause();
    vid.addEventListener('ended', handleEnd);

    return () => {
      vid.removeEventListener('ended', handleEnd);
    };
  }
}, []);
  const [activeTab, setActiveTab] = useState<TabType>('detector');
  const [mode, setMode] = useState<ModeType>('webcam');
  const [analyses, setAnalyses] = useState<PostureAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<PostureAnalysis | null>(null);
  
  const handleAnalysisUpdate = (analysis: PostureAnalysis) => {
    setCurrentAnalysis(analysis);
    setAnalyses(prev => [...prev, analysis]);
  };

  const tabs = [
    { id: 'detector' as TabType, label: 'Posture Detector', icon: Camera },
    { id: 'history' as TabType, label: 'Analysis History', icon: BarChart3 },
    { id: 'guide' as TabType, label: 'Posture Guide', icon: BookOpen },
  ];

  const recentGoodPosture = analyses.slice(-5).filter(a => a.isGoodPosture).length;
  const successRate = analyses.length > 0 ? (analyses.filter(a => a.isGoodPosture).length / analyses.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PostureAI</h1>
                <p className="text-sm text-gray-500">Advanced Posture Detection</p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              {currentAnalysis && (
                <div className="flex items-center space-x-2">
                  {currentAnalysis.isGoodPosture ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Good Posture</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Poor Posture</span>
                    </div>
                  )}
                </div>
              )}
              
              {analyses.length > 0 && (
                <div className="text-sm text-gray-600">
                  Success Rate: <span className="font-medium">{successRate.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'detector' && (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detection Mode</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setMode('webcam')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    mode === 'webcam'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Camera size={18} />
                  <span>Live Webcam</span>
                </button>
                <button
                  onClick={() => setMode('upload')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    mode === 'upload'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Upload size={18} />
                  <span>Upload Video</span>
                </button>
              </div>
            </div>

            {/* Detector Component */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <PostureDetector mode={mode} onAnalysisUpdate={handleAnalysisUpdate} />
            </div>

            {/* Quick Stats */}
            {analyses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-whi0te p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analyses.length}</div>
                    <div className="text-sm text-gray-600">Total Analyses</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{recentGoodPosture}/5</div>
                    <div className="text-sm text-gray-600">Recent Good Posture</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{successRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <AnalysisHistory analyses={analyses} />
        )}

        {activeTab === 'guide' && (
          <PostureGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>PostureAI - Advanced posture detection using AI and computer vision</p>
            <p className="mt-2">Built with TensorFlow.js and React</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;