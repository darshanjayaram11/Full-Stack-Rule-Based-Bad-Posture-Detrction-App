import React from 'react';
import { Info, User, Monitor, Activity } from 'lucide-react';

const PostureGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Posture Guidelines</h2>
        <p className="text-gray-600">Learn about proper posture and what our AI looks for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Desk Posture */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Monitor className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Desk Posture</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Good Posture:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Head aligned over shoulders</li>
                <li>• Shoulders relaxed and even</li>
                <li>• Back straight against chair</li>
                <li>• Feet flat on floor</li>
                <li>• Arms at 90-degree angle</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Common Issues We Detect:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Head forward posture</li>
                <li>• Slouching or hunched back</li>
                <li>• Uneven shoulders</li>
                <li>• Poor neck alignment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Squat Posture */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Squat Form</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Proper Form:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Knees track over toes</li>
                <li>• Hip-width stance</li>
                <li>• Chest up, back straight</li>
                <li>• Weight on heels</li>
                <li>• Controlled movement</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Common Issues We Detect:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Knees going over toes</li>
                <li>• Poor hip-knee alignment</li>
                <li>• Forward lean</li>
                <li>• Uneven weight distribution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Rules */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">How Detection Works</h3>
        </div>
        
        <div className="space-y-3 text-sm text-blue-800">
          <p>Our AI uses advanced pose detection to analyze your body position in real-time:</p>
          
          <ul className="space-y-1 ml-4">
            <li>• <strong>Keypoint Detection:</strong> Identifies 17 key body joints</li>
            <li>• <strong>Angle Analysis:</strong> Measures angles between body segments</li>
            <li>• <strong>Rule-Based Logic:</strong> Applies ergonomic principles to flag issues</li>
            <li>• <strong>Real-Time Feedback:</strong> Instant analysis and recommendations</li>
          </ul>
          
          <p className="mt-4">
            <strong>Note:</strong> For best results, ensure good lighting and position yourself fully in frame.
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tips for Better Results</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Camera Setup:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Position camera at chest level</li>
              <li>• Ensure your full torso is visible</li>
              <li>• Use good lighting</li>
              <li>• Avoid busy backgrounds</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Analysis:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Stay still for accurate readings</li>
              <li>• Wear contrasting clothing</li>
              <li>• Check multiple angles</li>
              <li>• Practice recommended corrections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureGuide;