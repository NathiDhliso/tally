import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorModal } from './ErrorModal';
import { PermissionModal } from './PermissionModal';
import { WaveformVisualizer } from './WaveformVisualizer';
import { AloeGrowthPulse } from './AloeGrowthPulse';
import { AloeBloom } from './AloeBloom';
import { AloeSpinner } from './AloeSpinner';
import { compressAudio, formatFileSize, getCompressionRatio } from '../utils';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { springConfig, softSpring } from '../utils/animations';

type RecordingStatus = 'idle' | 'recording' | 'compressing' | 'uploading' | 'transcribing' | 'extracting' | 'complete' | 'error';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onError?: (error: Error) => void;
  onSwitchToManualEntry?: () => void;
}

export const VoiceRecorder = ({ onRecordingComplete, onError, onSwitchToManualEntry }: VoiceRecorderProps) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showLongPressOverlay, setShowLongPressOverlay] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '' });
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [showSuccessBloom, setShowSuccessBloom] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const MAX_DURATION = 120; // 2 minutes in seconds

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up resources
  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // Monitor audio levels
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume (0-100)
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = Math.min(100, (average / 255) * 100);
    setAudioLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
  };

  // Get platform-specific instructions for enabling microphone
  const getMicrophoneInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome')) {
      return 'Chrome: Click the camera icon in the address bar, then select "Always allow" for microphone access.';
    } else if (userAgent.includes('firefox')) {
      return 'Firefox: Click the microphone icon in the address bar, then select "Allow" and check "Remember this decision".';
    } else if (userAgent.includes('safari')) {
      return 'Safari: Go to Safari > Settings > Websites > Microphone, then allow access for this site.';
    } else if (userAgent.includes('edge')) {
      return 'Edge: Click the lock icon in the address bar, then allow microphone access.';
    }
    
    return 'Please enable microphone access in your browser settings and refresh the page.';
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('UNSUPPORTED_BROWSER');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for level monitoring
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      // Start monitoring audio levels
      monitorAudioLevel();

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        cleanup();
        
        // Compress audio before completing
        setStatus('compressing');
        setOriginalSize(audioBlob.size);
        
        try {
          const compressedBlob = await compressAudio(audioBlob, (progress) => {
            setCompressionProgress(progress);
          });
          
          setCompressedSize(compressedBlob.size);
          
          if (onRecordingComplete) {
            onRecordingComplete(compressedBlob);
          }
          
          setStatus('complete');
          setShowSuccessBloom(true);
        } catch (error) {
          console.error('Compression failed, using original audio:', error);
          // Fall back to original audio if compression fails
          if (onRecordingComplete) {
            onRecordingComplete(audioBlob);
          }
          setStatus('complete');
          setShowSuccessBloom(true);
        }
      };

      mediaRecorder.start();
      setStatus('recording');
      setDuration(0);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= MAX_DURATION) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      const err = error as Error;
      setStatus('error');
      
      // Handle specific error types with South African warmth
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorDetails({
          title: 'Eish, I Need Permission!',
          message: `I can't hear you without microphone access. Let's fix that!\n\n${getMicrophoneInstructions()}`,
        });
        setShowErrorModal(true);
      } else if (err.name === 'NotFoundError') {
        setErrorDetails({
          title: 'Where\'s Your Mic?',
          message: 'I couldn\'t find a microphone on your device. No stress though - you can connect one or just type your invoice details instead!',
        });
        setShowErrorModal(true);
      } else if (err.message === 'UNSUPPORTED_BROWSER') {
        setErrorDetails({
          title: 'Oops, Browser Issue',
          message: 'Your browser doesn\'t support voice recording yet. Try Chrome, Firefox, Safari, or Edge - or just type your details instead. Easy!',
        });
        setShowErrorModal(true);
      } else {
        setErrorDetails({
          title: 'Ag Shame, Something Went Wrong',
          message: 'Don\'t worry, these things happen! Let\'s try again, or you can type your invoice details if you prefer.',
        });
        setShowErrorModal(true);
      }
      
      if (onError) {
        onError(err);
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setStatus('uploading');
    }
  };

  // Handle button click
  const handleButtonClick = () => {
    if (status === 'idle') {
      // Show permission modal first
      setShowPermissionModal(true);
    } else if (status === 'recording') {
      stopRecording();
    }
  };

  // Handle permission granted
  const handlePermissionGranted = () => {
    setShowPermissionModal(false);
    startRecording();
  };

  // Handle permission denied
  const handlePermissionDenied = () => {
    setShowPermissionModal(false);
  };

  // Handle long press start
  const handleLongPressStart = () => {
    if (status === 'idle') {
      longPressTimerRef.current = setTimeout(() => {
        setShowLongPressOverlay(true);
      }, 500);
    }
  };

  // Handle long press end
  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const isRecording = status === 'recording';
  const showCountdown = duration >= 90;

  // Status messages with South African warmth and companion personality
  const getStatusMessage = (): string => {
    switch (status) {
      case 'idle':
        return "Ready to listen...";
      case 'recording':
        // Dynamic messages based on recording duration for encouragement
        if (duration < 5) {
          return "I'm all ears... Tell me about your invoice.";
        } else if (duration < 15) {
          return "Keep going, you're doing great!";
        } else if (duration < 30) {
          return "I'm getting all the details...";
        } else if (duration < 60) {
          return "Almost there, take your time!";
        } else if (duration < 90) {
          return "Still listening... You've got this!";
        } else {
          return "Wrapping up soon... Just the essentials now!";
        }
      case 'compressing':
        return "Just a moment, I'm making this nice and compact for you...";
      case 'uploading':
        return "Sending your details through... Almost there!";
      case 'transcribing':
        return "Let me understand what you've said...";
      case 'extracting':
        return "Pulling out the important bits... This won't take long!";
      case 'complete':
        return "Got it!";
      case 'error':
        return "Eish, something went wrong. Let's try that again?";
      default:
        return '';
    }
  };

  // Use typing effect for status messages
  const shouldUseTypingEffect = !prefersReducedMotion && (
    status === 'recording' || 
    status === 'compressing' || 
    status === 'uploading' || 
    status === 'transcribing' || 
    status === 'extracting' || 
    status === 'complete'
  );
  const { displayedText: typedStatusMessage } = useTypingEffect({
    text: shouldUseTypingEffect ? getStatusMessage() : '',
    speed: 30,
  });
  const statusMessage = shouldUseTypingEffect ? typedStatusMessage : getStatusMessage();

  // Get glow color based on audio level
  const getGlowColor = () => {
    if (audioLevel < 30) {
      return ['0 0 40px rgba(107, 142, 35, 0.4)', '0 0 60px rgba(107, 142, 35, 0.6)', '0 0 40px rgba(107, 142, 35, 0.4)'];
    } else if (audioLevel < 70) {
      return ['0 0 40px rgba(218, 165, 32, 0.4)', '0 0 60px rgba(218, 165, 32, 0.6)', '0 0 40px rgba(218, 165, 32, 0.4)'];
    } else {
      return ['0 0 40px rgba(210, 105, 30, 0.4)', '0 0 60px rgba(210, 105, 30, 0.6)', '0 0 40px rgba(210, 105, 30, 0.4)'];
    }
  };

  // Orb animation variants with spring physics for smooth state transitions
  const orbVariants: any = {
    idle: {
      scale: 1,
      boxShadow: '0 0 40px rgba(107, 142, 35, 0.4)',
      transition: softSpring,
    },
    recording: {
      scale: [1, 1.05, 1],
      boxShadow: getGlowColor(),
      transition: {
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        default: softSpring,
      },
    },
    processing: {
      boxShadow: [
        '0 0 40px rgba(107, 142, 35, 0.4)',
        '0 0 60px rgba(218, 165, 32, 0.6)',
        '0 0 40px rgba(107, 142, 35, 0.4)',
      ],
      transition: {
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        default: softSpring,
      },
    },
  };

  // Get current orb state
  const getOrbState = () => {
    if (status === 'recording') return 'recording';
    if (status === 'compressing' || status === 'uploading' || status === 'transcribing' || status === 'extracting') {
      return 'processing';
    }
    return 'idle';
  };

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {/* Recording Timer */}
      {isRecording && (
        <motion.div
          className="text-2xl font-mono font-semibold text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springConfig}
        >
          {formatDuration(duration)}
          {showCountdown && (
            <span className="ml-2 text-terracotta-500 dark:text-terracotta-400 text-sm">
              ({MAX_DURATION - duration}s left)
            </span>
          )}
        </motion.div>
      )}

      {/* Waveform Visualizer (Recording State) */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springConfig}
        >
          <WaveformVisualizer
            audioLevel={audioLevel}
            analyser={analyserRef.current}
            className="mb-2"
          />
        </motion.div>
      )}

      {/* Main Orb Container with Aloe Design */}
      <div className="relative flex items-center justify-center">
        {/* Geometric Aloe Leaf Shapes (Idle State) */}
        {status === 'idle' && !prefersReducedMotion && (
          <svg
            className="absolute w-48 h-48 pointer-events-none"
            viewBox="0 0 200 200"
            style={{ opacity: 0.3 }}
          >
            {/* Subtle geometric aloe leaves around the orb */}
            {[0, 60, 120, 180, 240, 300].map((angle, index) => {
              const x = 100 + Math.cos((angle * Math.PI) / 180) * 70;
              const y = 100 + Math.sin((angle * Math.PI) / 180) * 70;
              return (
                <motion.path
                  key={index}
                  d={`M${x},${y} L${x + 3},${y + 12} L${x},${y + 20} L${x - 3},${y + 12} Z`}
                  fill="#6b8e23"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                  }}
                />
              );
            })}
          </svg>
        )}

        {/* AloeGrowthPulse for Processing State */}
        {(status === 'compressing' || status === 'uploading' || status === 'transcribing' || status === 'extracting') && (
          <>
            <AloeGrowthPulse size={180} />
            {/* Geometric Aloe Spinner */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AloeSpinner size={64} />
            </div>
          </>
        )}

        {/* Circular Progress Ring (Recording State) */}
        {isRecording && (
          <svg className="absolute w-36 h-36 -rotate-90 pointer-events-none">
            <circle
              cx="72"
              cy="72"
              r="68"
              fill="none"
              stroke="rgba(107, 142, 35, 0.2)"
              strokeWidth="3"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="68"
              fill="none"
              stroke="#6b8e23"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: duration / MAX_DURATION }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: '427',
                strokeDashoffset: 427 * (1 - duration / MAX_DURATION),
              }}
            />
          </svg>
        )}

        {/* Geometric Ripple Waves (Recording State) */}
        {isRecording && !prefersReducedMotion && (
          <svg
            className="absolute w-48 h-48 pointer-events-none"
            viewBox="0 0 200 200"
          >
            {[1, 2, 3].map((index) => (
              <motion.path
                key={index}
                d="M100,40 L130,60 L130,100 L100,120 L70,100 L70,60 Z"
                fill="none"
                stroke="#6b8e23"
                strokeWidth="2"
                opacity="0.4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: [0.5, 1.5, 2],
                  opacity: [0.4, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: index * 0.4,
                }}
                style={{ transformOrigin: '100px 80px' }}
              />
            ))}
          </svg>
        )}

        {/* Main Orb Button */}
        <motion.button
          onClick={handleButtonClick}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          disabled={status !== 'idle' && status !== 'recording'}
          className="relative rounded-full flex items-center justify-center cursor-pointer z-10"
          style={{
            width: '120px',
            height: '120px',
            background: isRecording
              ? audioLevel < 30
                ? 'linear-gradient(135deg, #6b8e23, #8ba888)' // Sage (quiet)
                : audioLevel < 70
                ? 'linear-gradient(135deg, #daa520, #f4d03f)' // Gold (medium)
                : 'linear-gradient(135deg, #d2691e, #e8a87c)' // Terracotta (loud)
              : 'linear-gradient(135deg, #6b8e23, #daa520)',
            minWidth: '44px',
            minHeight: '44px',
            transition: 'background 0.3s ease-out',
          }}
          variants={prefersReducedMotion ? undefined : orbVariants}
          animate={prefersReducedMotion ? undefined : getOrbState()}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
        >
          {/* Microphone Icon with Breathing Animation */}
          <motion.svg
            className="w-12 h-12 text-white relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={
              status === 'idle' && !prefersReducedMotion
                ? {
                    scale: [1, 1.1, 1],
                  }
                : undefined
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {isRecording ? (
              <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            )}
          </motion.svg>
        </motion.button>
      </div>

      {/* Compression Progress Bar */}
      {status === 'compressing' && (
        <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-500 dark:bg-primary-400 h-full transition-all duration-300"
            style={{ width: `${compressionProgress}%` }}
          />
        </div>
      )}

      {/* Status Text with Typing Effect */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={softSpring}
      >
        <div className="text-base text-gray-600 dark:text-gray-300 min-h-[24px]">
          {status === 'complete' ? (
            <span className="text-terracotta-600 dark:text-terracotta-400 font-medium text-lg">
              {statusMessage}
            </span>
          ) : (
            <span>{statusMessage}</span>
          )}
        </div>
        {/* Helpful hint for idle state */}
        {status === 'idle' && (
          <motion.p
            className="text-xs text-gray-500 dark:text-gray-400 mt-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...softSpring, delay: 0.5 }}
          >
            Tap to start • Hold for quick options
          </motion.p>
        )}
      </motion.div>

      {/* Compression Progress */}
      {status === 'compressing' && (
        <motion.div
          className="w-64 space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springConfig}
        >
          {/* Progress Bar with Shimmer */}
          <div className="relative bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6b8e23, #daa520)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${compressionProgress}%` }}
              transition={softSpring}
            />
            {/* Shimmer effect */}
            {compressionProgress < 100 && !prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </div>
          {originalSize > 0 && compressionProgress === 100 && (
            <motion.span
              className="text-xs text-gray-500 dark:text-gray-400 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {formatFileSize(originalSize)} → {formatFileSize(compressedSize)} 
              ({getCompressionRatio(originalSize, compressedSize)}% smaller)
            </motion.span>
          )}
        </motion.div>
      )}

      {/* Success Bloom Animation */}
      <AnimatePresence>
        {showSuccessBloom && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={softSpring}
          >
            <AloeBloom
              size={200}
              onComplete={() => {
                setShowSuccessBloom(false);
                // Quick transition to next step: reset to idle after a brief delay
                setTimeout(() => {
                  setStatus('idle');
                  setDuration(0);
                  setAudioLevel(0);
                  setCompressionProgress(0);
                  setOriginalSize(0);
                  setCompressedSize(0);
                }, 800);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Long Press Overlay */}
      {showLongPressOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowLongPressOverlay(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 w-full rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Quick Options
            </h3>
            <div className="space-y-3">
              <button
                className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-left font-medium transition-colors text-gray-900 dark:text-gray-100"
                onClick={() => {
                  setShowLongPressOverlay(false);
                  // TODO: Show recent clients
                }}
              >
                📋 Recent Clients
              </button>
              <button
                className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-left font-medium transition-colors text-gray-900 dark:text-gray-100"
                onClick={() => {
                  setShowLongPressOverlay(false);
                  if (onSwitchToManualEntry) {
                    onSwitchToManualEntry();
                  }
                }}
              >
                ⌨️ Type Instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      <PermissionModal
        isOpen={showPermissionModal}
        onAllow={handlePermissionGranted}
        onDeny={handlePermissionDenied}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setStatus('idle');
        }}
        title={errorDetails.title}
        message={errorDetails.message}
        alternativeLabel={onSwitchToManualEntry ? "Type Instead" : undefined}
        onAlternative={onSwitchToManualEntry}
      />
    </div>
  );
};
