// Global type definitions
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  description: string;
  status: 'draft' | 'sent' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioRecording {
  id: string;
  userId: string;
  audioUrl: string;
  transcription?: string;
  createdAt: Date;
}
