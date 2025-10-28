import { useState, useEffect, useRef } from 'react';
import { ErrorModal } from './ErrorModal';
import { PermissionModal } from './PermissionModal';
import { compressAudio, formatFileSize, getCompressionRatio } from '../utils';

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
        } catch (error) {
          console.error('Compression failed, using original audio:', error);
          // Fall back to original audio if compression fails
          if (onRecordingComplete) {
            onRecordingComplete(audioBlob);
          }
          setStatus('complete');
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
      
      // Handle specific error types
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorDetails({
          title: 'Microphone Access Denied',
          message: `We need microphone access to record your invoice details.\n\n${getMicrophoneInstructions()}`,
        });
        setShowErrorModal(true);
      } else if (err.name === 'NotFoundError') {
        setErrorDetails({
          title: 'No Microphone Found',
          message: 'We couldn\'t detect a microphone on your device. Please connect a microphone or use manual entry instead.',
        });
        setShowErrorModal(true);
      } else if (err.message === 'UNSUPPORTED_BROWSER') {
        setErrorDetails({
          title: 'Browser Not Supported',
          message: 'Your browser doesn\'t support voice recording. Please use a modern browser like Chrome, Firefox, Safari, or Edge, or switch to manual entry.',
        });
        setShowErrorModal(true);
      } else {
        setErrorDetails({
          title: 'Recording Error',
          message: 'An error occurred while trying to record. Please try again or use manual entry instead.',
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

  // Generate audio level bars (5 bars)
  const renderAudioLevelBars = () => {
    const bars = [];
    const barCount = 5;
    const barHeight = (audioLevel / 100) * barCount;

    for (let i = 0; i < barCount; i++) {
      const isActive = i < Math.ceil(barHeight);
      bars.push(
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-100 ${
            isActive ? 'bg-success-500 dark:bg-success-400' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          style={{ height: `${(i + 1) * 4}px` }}
        />
      );
    }

    return bars;
  };

  const isRecording = status === 'recording';
  const showCountdown = duration >= 90;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Recording Timer */}
      {isRecording && (
        <div className="text-2xl font-mono font-semibold text-gray-900 dark:text-gray-100">
          {formatDuration(duration)}
          {showCountdown && (
            <span className="ml-2 text-error-500 dark:text-error-400 text-sm">
              ({MAX_DURATION - duration}s left)
            </span>
          )}
        </div>
      )}

      {/* Audio Level Meter */}
      {isRecording && (
        <div className="flex items-end gap-1 h-6">
          {renderAudioLevelBars()}
        </div>
      )}

      {/* Microphone Button */}
      <button
        onClick={handleButtonClick}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        disabled={status !== 'idle' && status !== 'recording'}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-200 active:scale-95
          ${isRecording 
            ? 'bg-error-500 hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-700 animate-pulse' 
            : 'bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
          }
          ${(status !== 'idle' && status !== 'recording') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          shadow-lg hover:shadow-xl
        `}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        {/* Microphone Icon */}
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isRecording ? (
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
          ) : (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </>
          )}
        </svg>

        {/* Pulsing ring animation for recording */}
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-error-500 dark:bg-error-600 animate-ping opacity-75" />
        )}
      </button>

      {/* Compression Progress Bar */}
      {status === 'compressing' && (
        <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-500 dark:bg-primary-400 h-full transition-all duration-300"
            style={{ width: `${compressionProgress}%` }}
          />
        </div>
      )}

      {/* Status Text */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {status === 'idle' && 'Tap to record'}
        {status === 'recording' && 'Recording... Tap to stop'}
        {status === 'compressing' && (
          <div className="flex flex-col items-center gap-1">
            <span>Compressing audio... {compressionProgress}%</span>
            {originalSize > 0 && compressionProgress === 100 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(originalSize)} → {formatFileSize(compressedSize)} 
                ({getCompressionRatio(originalSize, compressedSize)}% smaller)
              </span>
            )}
          </div>
        )}
        {status === 'uploading' && 'Uploading audio...'}
        {status === 'transcribing' && 'Transcribing...'}
        {status === 'extracting' && 'Extracting invoice details...'}
        {status === 'complete' && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-success-600 dark:text-success-400 font-medium">Complete!</span>
            {originalSize > 0 && compressedSize > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Saved {getCompressionRatio(originalSize, compressedSize)}% bandwidth
              </span>
            )}
          </div>
        )}
        {status === 'error' && 'Error occurred'}
      </div>

      {/* Long Press Overlay */}
      {showLongPressOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowLongPressOverlay(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <div className="space-y-4">
              <button
                className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 rounded-xl text-left font-medium transition-colors"
                onClick={() => {
                  setShowLongPressOverlay(false);
                  // TODO: Show recent clients
                }}
              >
                Recent Clients
              </button>
              <button
                className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 rounded-xl text-left font-medium transition-colors"
                onClick={() => {
                  setShowLongPressOverlay(false);
                  if (onSwitchToManualEntry) {
                    onSwitchToManualEntry();
                  }
                }}
              >
                Type Instead
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
