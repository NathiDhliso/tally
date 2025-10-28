import { useNavigate } from 'react-router-dom';
import { VoiceRecorder, Button } from '../components';
import { useToast } from '../contexts/ToastContext';

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleRecordingComplete = (audioBlob: Blob) => {
    console.log('Recording complete:', audioBlob);
    toast.info('Processing audio...');
    
    // TODO: Upload and process audio with backend
    // For now, simulate extraction and navigate to review
    setTimeout(() => {
      navigate('/invoice/review', {
        state: {
          extractedData: {
            clientName: 'Acme Corp',
            itemDescription: 'Web Development Services',
            quantity: 1,
            unitPrice: 5000,
            date: new Date().toISOString().split('T')[0],
          },
          confidence: {
            clientName: 95,
            itemDescription: 90,
            quantity: 100,
            unitPrice: 85,
            date: 100,
          },
        },
      });
    }, 2000);
  };

  const handleError = (error: Error) => {
    console.error('Recording error:', error);
    toast.error('Recording failed. Please try again.');
  };

  const handleManualEntry = () => {
    navigate('/invoice/review', {
      state: {
        extractedData: {
          clientName: '',
          itemDescription: '',
          quantity: 1,
          unitPrice: 0,
          date: new Date().toISOString().split('T')[0],
        },
        confidence: {
          clientName: 100,
          itemDescription: 100,
          quantity: 100,
          unitPrice: 100,
          date: 100,
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Voice to Invoice
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Speak to create your invoice in seconds
        </p>
        
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          onError={handleError}
          onSwitchToManualEntry={handleManualEntry}
        />

        <div className="mt-8">
          <Button variant="outline" size="lg" onClick={handleManualEntry}>
            Type Instead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
