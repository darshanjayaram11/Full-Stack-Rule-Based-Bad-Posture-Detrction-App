import React, { useRef, useEffect, useState } from 'react';
import { Camera, Upload, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

interface PostureAnalysis {
  isGoodPosture: boolean;
  issues: string[];
  confidence: number;
  timestamp: number;
}

interface PostureDetectorProps {
  mode: 'webcam' | 'upload';
  onAnalysisUpdate: (analysis: PostureAnalysis) => void;
}

const PostureDetector: React.FC<PostureDetectorProps> = ({ mode, onAnalysisUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PostureAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  useEffect(() => {
    initializePoseDetector();
  }, []);

  const initializePoseDetector = async () => {
    setIsLoading(true);
    try {
      await tf.ready();
      
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        enableSmoothing: true,
      };
      
      const poseDetector = await poseDetection.createDetector(model, detectorConfig);
      setDetector(poseDetector);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize pose detector:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePosture = (poses: poseDetection.Pose[]) => {
    if (!poses || poses.length === 0) {
      return {
        isGoodPosture: false,
        issues: ['No person detected'],
        confidence: 0,
        timestamp: Date.now()
      };
    }

    const pose = poses[0];
    const keypoints = pose.keypoints;
    const issues: string[] = [];
    let totalConfidence = 0;

    // Get key body parts
    const nose = keypoints.find(kp => kp.name === 'nose');
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    const leftKnee = keypoints.find(kp => kp.name === 'left_knee');
    const rightKnee = keypoints.find(kp => kp.name === 'right_knee');
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');

    // Check if key points are visible
    const minConfidence = 0.3;
    const visibleKeypoints = [nose, leftShoulder, rightShoulder, leftHip, rightHip].filter(
      kp => kp && kp.score > minConfidence
    );

    if (visibleKeypoints.length < 4) {
      return {
        isGoodPosture: false,
        issues: ['Insufficient pose visibility'],
        confidence: 0,
        timestamp: Date.now()
      };
    }

    // Calculate average confidence
    totalConfidence = visibleKeypoints.reduce((sum, kp) => sum + kp.score, 0) / visibleKeypoints.length;

    // Rule 1: Head forward posture (neck angle)
    if (nose && leftShoulder && rightShoulder) {
      const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
      const neckAngle = Math.abs(nose.x - shoulderCenterX);
      
      if (neckAngle > 50) {
        issues.push('Head forward posture detected');
      }
    }

    // Rule 2: Shoulder alignment
    if (leftShoulder && rightShoulder) {
      const shoulderSlope = Math.abs(leftShoulder.y - rightShoulder.y);
      
      if (shoulderSlope > 30) {
        issues.push('Uneven shoulders detected');
      }
    }

    // Rule 3: Back posture (sitting)
    if (nose && leftHip && rightHip) {
      const hipCenterY = (leftHip.y + rightHip.y) / 2;
      const backAngle = Math.abs(nose.y - hipCenterY);
      
      if (backAngle < 200) {
        issues.push('Slouching detected - sit up straight');
      }
    }

    // Rule 4: Knee alignment for squats
    if (leftKnee && rightKnee && leftAnkle && rightAnkle) {
      const leftKneeAnkleDistance = Math.abs(leftKnee.x - leftAnkle.x);
      const rightKneeAnkleDistance = Math.abs(rightKnee.x - rightAnkle.x);
      
      if (leftKneeAnkleDistance > 80 || rightKneeAnkleDistance > 80) {
        issues.push('Knee going over toe - adjust squat form');
      }
    }

    // Rule 5: Hip-knee alignment
    if (leftHip && rightHip && leftKnee && rightKnee) {
      const leftAlignment = Math.abs(leftHip.x - leftKnee.x);
      const rightAlignment = Math.abs(rightHip.x - rightKnee.x);
      
      if (leftAlignment > 60 || rightAlignment > 60) {
        issues.push('Poor hip-knee alignment');
      }
    }

    const analysis = {
      isGoodPosture: issues.length === 0,
      issues,
      confidence: totalConfidence,
      timestamp: Date.now()
    };

    setCurrentAnalysis(analysis);
    onAnalysisUpdate(analysis);
    
    return analysis;
  };

  const detectPoses = async () => {
    if (!detector || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const poses = await detector.estimatePoses(video);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw video frame
      ctx.drawImage(video, 0, 0);
      
      // Analyze posture
      const analysis = analyzePosture(poses);
      
      // Draw pose keypoints and connections
      if (poses.length > 0) {
        drawPose(ctx, poses[0], analysis);
      }
      
    } catch (error) {
      console.error('Error detecting poses:', error);
    }
  };

  const drawPose = (ctx: CanvasRenderingContext2D, pose: poseDetection.Pose, analysis: PostureAnalysis) => {
    const keypoints = pose.keypoints;
    const minConfidence = 0.3;
    
    // Draw keypoints
    keypoints.forEach((keypoint) => {
      if (keypoint.score > minConfidence) {
        const { x, y } = keypoint;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = analysis.isGoodPosture ? '#10B981' : '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw connections
    const connections = [
      ['nose', 'left_shoulder'],
      ['nose', 'right_shoulder'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'],
      ['right_knee', 'right_ankle']
    ];

    connections.forEach(([from, to]) => {
      const fromPoint = keypoints.find(kp => kp.name === from);
      const toPoint = keypoints.find(kp => kp.name === to);
      
      if (fromPoint && toPoint && fromPoint.score > minConfidence && toPoint.score > minConfidence) {
        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        ctx.strokeStyle = analysis.isGoodPosture ? '#10B981' : '#EF4444';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
  };

  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsPlaying(true);
        
        const interval = setInterval(() => {
          if (isPlaying) {
            detectPoses();
          }
        }, 100);
        
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      
      let errorMessage = 'Unable to access webcam';
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera access denied. Please allow camera permissions and refresh the page.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found. Please connect a camera and try again.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is already in use by another application.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Camera does not support the required settings.';
            break;
          case 'SecurityError':
            errorMessage = 'Camera access blocked due to security restrictions.';
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      setWebcamError(errorMessage);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && videoRef.current) {
      const url = URL.createObjectURL(file);
      videoRef.current.src = url;
      videoRef.current.load();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetAnalysis = () => {
    setCurrentAnalysis(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    if (mode === 'webcam' && isInitialized) {
      startWebcam();
    }
  }, [mode, isInitialized]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && detector) {
      interval = setInterval(detectPoses, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, detector]);

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg">Loading pose detection model...</span>
        </div>
      )}

      {/* Webcam Error Display */}
      {webcamError && mode === 'webcam' && (
        <div className="p-4 rounded-lg border-2 bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-red-800">
              Webcam Access Error
            </h3>
          </div>
          <p className="text-red-700 mb-3">{webcamError}</p>
          <button
            onClick={startWebcam}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Video Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-auto max-h-96 object-cover"
          playsInline
          muted
          onLoadedMetadata={() => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }}
        />
        
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Overlay Controls */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {mode === 'upload' && (
            <>
              <button
                onClick={togglePlayPause}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={resetAnalysis}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* File Upload for Video Mode */}
      {mode === 'upload' && (
        <div className="flex items-center justify-center">
          <label className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
            <Upload size={20} />
            <span>Upload Video</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Real-time Analysis Display */}
      {currentAnalysis && (
        <div className={`p-4 rounded-lg border-2 ${
          currentAnalysis.isGoodPosture 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {currentAnalysis.isGoodPosture ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <AlertTriangle className="text-red-600" size={24} />
            )}
            <h3 className={`text-lg font-semibold ${
              currentAnalysis.isGoodPosture ? 'text-green-800' : 'text-red-800'
            }`}>
              {currentAnalysis.isGoodPosture ? 'Good Posture!' : 'Poor Posture Detected'}
            </h3>
          </div>
          
          {currentAnalysis.issues.length > 0 && (
            <div className="space-y-1">
              {currentAnalysis.issues.map((issue, index) => (
                <p key={index} className="text-red-700 flex items-center space-x-1">
                  <span>•</span>
                  <span>{issue}</span>
                </p>
              ))}
            </div>
          )}
          
          <div className="mt-2 text-sm text-gray-600">
            Confidence: {(currentAnalysis.confidence * 100).toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default PostureDetector;