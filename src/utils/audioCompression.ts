import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let loadPromise: Promise<FFmpeg> | null = null;

/**
 * Load FFmpeg instance (singleton pattern)
 */
export const loadFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  if (isLoading && loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegInstance = ffmpeg;
    isLoading = false;
    return ffmpeg;
  })();

  return loadPromise;
};

/**
 * Compress audio blob to MP3 format (32-64 kbps)
 * @param audioBlob - Original audio blob
 * @param onProgress - Progress callback (0-100)
 * @returns Compressed audio blob
 */
export const compressAudio = async (
  audioBlob: Blob,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  try {
    if (onProgress) onProgress(0);

    // Load FFmpeg
    const ffmpeg = await loadFFmpeg();
    if (onProgress) onProgress(10);

    // Write input file
    const inputFileName = 'input.webm';
    const outputFileName = 'output.mp3';
    
    await ffmpeg.writeFile(inputFileName, await fetchFile(audioBlob));
    if (onProgress) onProgress(30);

    // Set up progress monitoring
    ffmpeg.on('progress', ({ progress }) => {
      if (onProgress) {
        // Map FFmpeg progress (0-1) to our range (30-90)
        const mappedProgress = 30 + (progress * 60);
        onProgress(Math.round(mappedProgress));
      }
    });

    // Compress audio to MP3 with 48 kbps bitrate
    await ffmpeg.exec([
      '-i', inputFileName,
      '-codec:a', 'libmp3lame',
      '-b:a', '48k',
      '-ar', '16000', // 16kHz sample rate (good for voice)
      '-ac', '1', // Mono channel
      outputFileName
    ]);

    if (onProgress) onProgress(90);

    // Read output file
    const data = await ffmpeg.readFile(outputFileName);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const compressedBlob = new Blob([data as any], { type: 'audio/mp3' });

    // Clean up
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    if (onProgress) onProgress(100);

    return compressedBlob;
  } catch (error) {
    console.error('Audio compression failed:', error);
    // Return original blob if compression fails
    return audioBlob;
  }
};

/**
 * Get compression ratio
 */
export const getCompressionRatio = (originalSize: number, compressedSize: number): number => {
  return Math.round((1 - compressedSize / originalSize) * 100);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
