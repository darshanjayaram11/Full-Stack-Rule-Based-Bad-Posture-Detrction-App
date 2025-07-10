# PostureAI - Advanced Posture Detection App

A comprehensive web application that uses AI-powered pose detection to analyze and improve posture in real-time. Built with React, TypeScript, and TensorFlow.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🚀 Features

### Core Functionality
- **Real-time Posture Analysis**: Live webcam feed with instant posture feedback
- **Video Upload Support**: Upload and analyze recorded videos
- **Rule-based Detection**: Advanced algorithms for detecting common posture issues
- **Visual Feedback**: Interactive pose visualization with keypoint tracking
- **Analysis History**: Track your posture improvement over time
- **Comprehensive Guide**: Learn about proper posture and best practices

### Detection Capabilities
- **Desk Posture**: Detects slouching, forward head posture, and shoulder misalignment
- **Squat Form**: Analyzes knee tracking, hip alignment, and overall form
- **Real-time Scoring**: Confidence-based scoring system
- **Common Issues**: Identifies and flags specific posture problems

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI/ML**: TensorFlow.js, MoveNet pose detection model
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Project Structure

```
posture-ai/
├── public/
├── src/
│   ├── components/
│   │   ├── PostureDetector.tsx
│   │   ├── AnalysisHistory.tsx
│   │   └── PostureGuide.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 How It Works

### Pose Detection Pipeline
1. **Video Input**: Capture from webcam or uploaded video
2. **Pose Estimation**: TensorFlow.js MoveNet model detects 17 key body points
3. **Rule-based Analysis**: Custom algorithms analyze angles and positions
4. **Feedback Generation**: Real-time scoring and issue identification
5. **Visualization**: Interactive pose overlay with color-coded feedback

### Detection Rules

#### Desk Posture
- **Head Position**: Flags forward head posture (>50px deviation)
- **Shoulder Alignment**: Detects uneven shoulders (>30px difference)
- **Back Posture**: Identifies slouching based on spine curvature
- **Overall Alignment**: Checks head-shoulder-hip alignment

#### Squat Form
- **Knee Tracking**: Ensures knees don't extend beyond toes
- **Hip Alignment**: Monitors hip-knee alignment during movement
- **Back Angle**: Maintains proper spinal alignment
- **Weight Distribution**: Checks for balanced stance

## 🔧 Configuration

### Camera Permissions
The app requires camera access for live posture detection. Make sure to:
- Allow camera permissions when prompted
- Use HTTPS for production deployments
- Test camera functionality across different browsers

### Model Loading
The TensorFlow.js models are loaded automatically on first use. For optimal performance:
- Ensure stable internet connection for initial model download
- Models are cached locally after first load
- WebGL backend is used for better performance

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: WebGL support required for optimal performance.

## 🔒 Privacy & Security

- **Local Processing**: All pose detection happens in the browser
- **No Data Storage**: No video or pose data is sent to external servers
- **Camera Access**: Only used for real-time analysis, not recording
- **Privacy-First**: Designed with user privacy as a priority

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- TensorFlow.js team for the pose detection models
- MoveNet model contributors
- React and TypeScript communities
- Tailwind CSS for the beautiful styling system

Built with ❤️ using modern web technologies and AI.