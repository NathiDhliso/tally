import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compressAudio, getCompressionRatio, formatFileSize } from '../audioCompression';

// Mock FFmpeg
vi.mock('@ffmpeg/ffmpeg', () => ({
  FFmpeg: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    deleteFile: vi.fn().mockResolvedValue(undefined),
    exec: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
  })),
}));

vi.mock('@ffmpeg/util', () => ({
  fetchFile: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5])),
  toBlobURL: vi.fn().mockResolvedValue('blob:mock-url'),
}));

describe('audioCompression', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('compressAudio', () => {
    it('should compress audio blob to MP3 format', async () => {
      const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });
      const progressCallback = vi.fn();

      const result = await compressAudio(mockBlob, progressCallback);

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('audio/mp3');
      expect(progressCallback).toHaveBeenCalled();
    });

    it('should call progress callback with values from 0 to 100', async () => {
      const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });
      const progressCallback = vi.fn();

      await compressAudio(mockBlob, progressCallback);

      // Check that progress was called with 0, 10, 30, 90, 100
      expect(progressCallback).toHaveBeenCalledWith(0);
      expect(progressCallback).toHaveBeenCalledWith(10);
      expect(progressCallback).toHaveBeenCalledWith(30);
      expect(progressCallback).toHaveBeenCalledWith(90);
      expect(progressCallback).toHaveBeenCalledWith(100);
    });

    it('should return original blob if compression fails', async () => {
      const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });
      
      // Mock FFmpeg to throw an error
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      vi.mocked(FFmpeg).mockImplementationOnce(() => ({
        load: vi.fn().mockRejectedValue(new Error('FFmpeg load failed')),
        writeFile: vi.fn(),
        readFile: vi.fn(),
        deleteFile: vi.fn(),
        exec: vi.fn(),
        on: vi.fn(),
      }) as any);

      const result = await compressAudio(mockBlob);

      expect(result).toBe(mockBlob);
    });

    it('should work without progress callback', async () => {
      const mockBlob = new Blob(['test audio data'], { type: 'audio/webm' });

      const result = await compressAudio(mockBlob);

      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('getCompressionRatio', () => {
    it('should calculate compression ratio correctly', () => {
      expect(getCompressionRatio(1000, 500)).toBe(50);
      expect(getCompressionRatio(1000, 700)).toBe(30);
      expect(getCompressionRatio(1000, 300)).toBe(70);
    });

    it('should handle edge cases', () => {
      expect(getCompressionRatio(1000, 1000)).toBe(0);
      expect(getCompressionRatio(1000, 0)).toBe(100);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(2048)).toBe('2.0 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB');
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    });
  });
});
