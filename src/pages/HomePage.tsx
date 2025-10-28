import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { VoiceRecorder, Button, Card } from '../components';
import { useToast } from '../contexts/ToastContext';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { fadeInUp, staggerChildren } from '../utils/animations';
import { FileText, Users, Settings, ArrowDown } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Lazy load AloePattern - only needed for background decoration
const AloePattern = lazy(() => import('../components/AloePattern').then(m => ({ default: m.AloePattern })));

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const prefersReducedMotion = useReducedMotion();
  
  // Smooth scroll animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const { displayedText } = useTypingEffect({
    text: 'Speak to create your invoice in seconds',
    speed: 50,
    delay: 800,
  });

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

  const scrollToActions = () => {
    const actionsElement = document.getElementById('quick-actions');
    if (actionsElement) {
      actionsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0f172a]">
      {/* Geometric Aloe Pattern Background - Static for performance */}
      <Suspense fallback={null}>
        <AloePattern opacity={0.05} color="#6b8e23" />
      </Suspense>
      
      {/* Hero Section - Center-focused with smooth scroll animations */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          style={prefersReducedMotion ? {} : { opacity, scale }}
          className="text-center w-full max-w-4xl mx-auto py-8 sm:py-12"
        >
          {/* Hero Headline with Gradient - Large animated with sage-to-gold gradient */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-sage-500 via-sage-400 to-gold-500 bg-clip-text text-transparent leading-tight tracking-tight px-4"
          >
            Voice to Invoice
          </motion.h1>

          {/* Subtitle with Typing Effect - Smooth animation */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 sm:mb-14 min-h-[2.5rem] sm:min-h-[3rem] px-4 font-light"
          >
            {displayedText}
            <span className="inline-block w-0.5 h-5 sm:h-6 bg-sage-500 ml-1 animate-pulse"></span>
          </motion.p>

          {/* VoiceRecorder as Centerpiece */}
          <motion.div variants={fadeInUp} className="mb-8 sm:mb-12">
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              onError={handleError}
              onSwitchToManualEntry={handleManualEntry}
            />
          </motion.div>

          {/* Manual Entry Button */}
          <motion.div variants={fadeInUp} className="mb-8 sm:mb-12">
            <Button variant="outline" size="lg" onClick={handleManualEntry}>
              Type Instead
            </Button>
          </motion.div>

          {/* Scroll Indicator - Smooth bounce animation */}
          <motion.button
            variants={fadeInUp}
            onClick={scrollToActions}
            className="mt-8 sm:mt-12 text-sage-500 hover:text-sage-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] rounded-full p-2"
            aria-label="Scroll to quick actions"
            animate={prefersReducedMotion ? {} : {
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.button>
        </motion.div>
      </section>

      {/* Quick Actions Section - Smooth scroll reveal */}
      <section 
        id="quick-actions"
        className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-sage-400 to-gold-500 bg-clip-text text-transparent"
          >
            Quick Actions
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-400 text-base sm:text-lg mb-10 sm:mb-14 max-w-2xl mx-auto"
          >
            Manage your invoices, clients, and settings with ease
          </motion.p>

          {/* Quick Action Cards - Glass surfaces with sage accents */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            <motion.div 
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -4 }} 
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full"
            >
              <Card
                className="p-6 sm:p-8 cursor-pointer group transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,142,35,0.3)] border-sage-500/20 h-full"
                onClick={() => navigate('/invoices')}
              >
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-sage-500 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                  View Invoices
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Browse and manage your invoices
                </p>
              </Card>
            </motion.div>

            <motion.div 
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -4 }} 
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full"
            >
              <Card
                className="p-6 sm:p-8 cursor-pointer group transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,142,35,0.3)] border-sage-500/20 h-full"
                onClick={() => navigate('/clients')}
              >
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-sage-500 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                  Manage Clients
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Add and organize your clients
                </p>
              </Card>
            </motion.div>

            <motion.div 
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -4 }} 
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-full sm:col-span-2 lg:col-span-1"
            >
              <Card
                className="p-6 sm:p-8 cursor-pointer group transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,142,35,0.3)] border-sage-500/20 h-full"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-10 h-10 sm:w-12 sm:h-12 text-sage-500 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                  Settings
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Configure your preferences
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom Spacing for Mobile */}
      <div className="h-16 sm:h-20"></div>
    </div>
  );
};

export default HomePage;
