import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoiceRecorder } from '../VoiceRecorder';

// Mock MediaRecorder
class MockMediaRecorder {
  state = 'inactive';
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;

  start() {
    this.state = 'recording';
  }

  stop() {
    this.state = 'inactive';
    if (this.onstop) {
      this.onstop();
    }
  }
}

// Mock AudioContext
class MockAudioContext {
  createMediaStreamSource() {
    return {
      connect: vi.fn(),
    };
  }

  createAnalyser() {
    return {
      fftSize: 0,
      frequencyBinCount: 256,
      getByteFrequencyData: vi.fn(),
    };
  }

  close() {
    return Promise.resolve();
  }
}

describe('VoiceRecorder - MediaRecorder Integration', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock global objects
    global.MediaRecorder = MockMediaRecorder as any;
    global.AudioContext = MockAudioContext as any;
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    } as any;
  });

  it('should request microphone permissions when button is clicked', async () => {
    render(<VoiceRecorder />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should show permission modal
    await waitFor(() => {
      expect(screen.getByText("Let's Get Started!")).toBeInTheDocument();
    });
  });

  it('should start recording after permission is granted', async () => {
    const getUserMediaMock = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    global.navigator.mediaDevices.getUserMedia = getUserMediaMock;

    render(<VoiceRecorder />);

    // Click button to show permission modal
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Grant permission
    await waitFor(() => {
      const allowButton = screen.getByText("Sure, Let's Go!");
      fireEvent.click(allowButton);
    });

    // Verify getUserMedia was called
    await waitFor(() => {
      expect(getUserMediaMock).toHaveBeenCalledWith({ audio: true });
    });
  });

  it('should stop recording when button is clicked again', async () => {
    const onRecordingComplete = vi.fn();
    render(<VoiceRecorder onRecordingComplete={onRecordingComplete} />);

    // Start recording
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const allowButton = screen.getByText("Sure, Let's Go!");
      fireEvent.click(allowButton);
    });

    // Wait for recording to start
    await waitFor(() => {
      expect(screen.getByText(/I'm all ears/)).toBeInTheDocument();
    });

    // Stop recording
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Sending your details/)).toBeInTheDocument();
    });
  });

  it('should display countdown when duration exceeds 90 seconds', async () => {
    vi.useFakeTimers();

    render(<VoiceRecorder />);

    // Start recording
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const allowButton = screen.getByText("Sure, Let's Go!");
      fireEvent.click(allowButton);
    });

    // Fast forward to 91 seconds
    vi.advanceTimersByTime(91000);

    await waitFor(() => {
      expect(screen.getByText(/left/)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('should automatically stop at 2 minutes', async () => {
    vi.useFakeTimers();

    const onRecordingComplete = vi.fn();
    render(<VoiceRecorder onRecordingComplete={onRecordingComplete} />);

    // Start recording
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const allowButton = screen.getByText("Sure, Let's Go!");
      fireEvent.click(allowButton);
    });

    // Fast forward to 120 seconds
    vi.advanceTimersByTime(120000);

    await waitFor(() => {
      expect(screen.getByText(/Sending your details/)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('should handle permission denied with error modal', async () => {
    const getUserMediaMock = vi.fn().mockRejectedValue({
      name: 'NotAllowedError',
    });
    global.navigator.mediaDevices.getUserMedia = getUserMediaMock;

    render(<VoiceRecorder />);

    // Click button
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Grant permission (which will fail)
    await waitFor(() => {
      const allowButton = screen.getByText("Sure, Let's Go!");
      fireEvent.click(allowButton);
    });

    // Should show error modal
    await waitFor(() => {
      expect(screen.getByText('Eish, I Need Permission!')).toBeInTheDocument();
    });
  });

  it('should handle no microphone found error', async () => {
    const getUserMediaMock = vi.fn().mockRejectedValue({
      name: 'NotFoundError',
    });
    global.navigator.mediaDevices.getUserMedia = getUserMediaMock;

    render(<VoiceRecorder />);

    // Click button
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Grant permission (which will fail)
    await waitFor(() => {
      const allowButton = screen.getByText("Sure, Let's Go!");
      fireEvent.click(allowButton);
    });

    // Should show error modal
    await waitFor(() => {
      expect(screen.getByText("Where's Your Mic?")).toBeInTheDocument();
    });
  });

  it('should display long-press overlay after 500ms', async () => {
    vi.useFakeTimers();

    render(<VoiceRecorder />);

    const button = screen.getByRole('button');
    fireEvent.mouseDown(button);

    // Fast forward 500ms
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('📋 Recent Clients')).toBeInTheDocument();
      expect(screen.getByText('⌨️ Type Instead')).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('should handle unsupported browser', async () => {
    // Remove mediaDevices support
    const originalMediaDevices = global.navigator.mediaDevices;
    (global.navigator as any).mediaDevices = undefined;

    render(<VoiceRecorder />);

    // Click button
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Grant permission (which will fail)
    await waitFor(() => {
      const allowButton = screen.getByText("Sure, Let's Go!");
      fireEvent.click(allowButton);
    });

    // Should show error modal
    await waitFor(() => {
      expect(screen.getByText('Oops, Browser Issue')).toBeInTheDocument();
    });

    // Restore
    (global.navigator as any).mediaDevices = originalMediaDevices;
  });
});
