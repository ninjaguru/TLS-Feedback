
import React, { useState, useMemo, useEffect } from 'react';
import { StepId, SurveyData, StylistRating } from './types';
import { QUESTIONS } from './constants';
import Layout from './components/Layout';
import StylistRatingComponent from './components/StylistRating';
import BinaryQuestion from './components/BinaryQuestion';
import CommentQuestion from './components/CommentQuestion';
import LoadingScreen from './components/LoadingScreen';
import CompletionScreen from './components/CompletionScreen';
import { syncFeedbackToRegistry } from './services/dataService';
import { generateThankYouMessage } from './services/geminiService';
import StaffAccess from './components/StaffAccess';

const App: React.FC = () => {
  const [isStaffPage, setIsStaffPage] = useState(window.location.pathname === '/staff');
  const [step, setStep] = useState<StepId>('welcome');
  const [data, setData] = useState<SurveyData>({
    stylistRatings: [],
    isFirstVisit: null,
    isSatisfied: null,
    isWelcoming: null,
    isTimely: null,
    teaOffered: null,
    packagesExplained: null,
    reviewRequested: null,
    couponReceived: null,
    additionalComments: '',
    mobileNumber: null
  });
  const [aiMessage, setAiMessage] = useState('');

  // Handle browser back/forward buttons for "routing"
  useEffect(() => {
    const handlePopState = () => {
      setIsStaffPage(window.location.pathname === '/staff');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize mobile number from URL parameter on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mobileEnc = params.get('m');
    if (mobileEnc) {
      try {
        const decoded = atob(mobileEnc);
        console.log("Registry: Decoded mobile number from URL:", decoded);
        setData(prev => ({ ...prev, mobileNumber: decoded }));
      } catch (e) {
        console.error("Failed to decode mobile number:", e);
      }
    } else {
      // Fallback to legacy 'mobile' if present
      const mobile = params.get('mobile');
      if (mobile) {
        console.log("Registry: Captured legacy mobile number from URL:", mobile);
        setData(prev => ({ ...prev, mobileNumber: mobile }));
      }
    }
  }, []);

  const stepsOrder: StepId[] = [
    'welcome',
    'q1_stylists',
    ...QUESTIONS.map(q => q.id as StepId),
    'q10_comments',
    'loading',
    'completion'
  ];

  const currentStepIndex = useMemo(() => stepsOrder.indexOf(step), [step]);
  const progress = useMemo(() => isStaffPage ? 0 : ((currentStepIndex + 1) / stepsOrder.length) * 100, [currentStepIndex, isStaffPage]);

  const nextStep = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < stepsOrder.length) {
      setStep(stepsOrder[nextIdx]);
    }
  };

  const handleFinish = async (finalComments: string) => {
    // Functional update to get latest state for sync
    setData(prev => {
      const updatedData = { ...prev, additionalComments: finalComments };

      // Trigger sync with the most up-to-date data
      (async () => {
        setStep('loading');
        try {
          const [syncResult, message] = await Promise.all([
            syncFeedbackToRegistry(updatedData),
            generateThankYouMessage(updatedData)
          ]);
          setAiMessage(message);
          setStep('completion');
        } catch (error) {
          console.error("Workflow error:", error);
          setAiMessage("Thank you for your visit. We have recorded your feedback and look forward to serving you again.");
          setStep('completion');
        }
      })();

      return updatedData;
    });
  };

  const renderContent = () => {
    if (isStaffPage) {
      return (
        <StaffAccess
          currentMobile={data.mobileNumber}
          onMobileSet={(mobile) => setData(prev => ({ ...prev, mobileNumber: mobile }))}
        />
      );
    }

    switch (step) {
      case 'welcome':
        return (
          <div className="text-center fade-in max-w-2xl w-full flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl mb-8 serif italic font-light tracking-tight leading-none">Welcome back</h1>
            <p className="text-lg md:text-xl font-light text-gray-500 mb-16 max-w-lg mx-auto leading-relaxed">
              We invite you to register your experience at our salon today. Your feedback ensures our craft remains unparalleled.
            </p>
            <button
              onClick={nextStep}
              className="group relative inline-block px-12 py-5 border border-luxury-gold text-luxury-gold uppercase tracking-[0.5em] text-xs font-bold transition-all duration-500 hover:bg-luxury-gold hover:text-white"
            >
              Enter Registry
            </button>
          </div>
        );

      case 'q1_stylists':
        return (
          <StylistRatingComponent
            onComplete={(ratings) => {
              setData(prev => ({ ...prev, stylistRatings: ratings }));
              nextStep();
            }}
          />
        );

      case 'q2_first_visit':
      case 'q3_satisfied':
      case 'q4_environment':
      case 'q5_timely':
      case 'q6_tea':
      case 'q7_packages':
      case 'q8_review':
      case 'q9_coupon': {
        const qConfig = QUESTIONS.find(q => q.id === step);
        if (!qConfig) return null;

        const fieldMap: Record<string, keyof SurveyData> = {
          q2_first_visit: 'isFirstVisit',
          q3_satisfied: 'isSatisfied',
          q4_environment: 'isWelcoming',
          q5_timely: 'isTimely',
          q6_tea: 'teaOffered',
          q7_packages: 'packagesExplained',
          q8_review: 'reviewRequested',
          q9_coupon: 'couponReceived',
        };

        const qImages: Record<string, string[]> = {
          q6_tea: ['/greentea.webp', '/lemontea.webp'],
          q7_packages: ['/packages.png'],
          q8_review: ['/google_review.webp'],
          q9_coupon: ['/coupon.jpg']
        };

        return (
          <BinaryQuestion
            text={qConfig.text}
            images={qImages[step]}
            onAnswer={(val) => {
              setData(prev => ({ ...prev, [fieldMap[step]]: val }));
              nextStep();
            }}
          />
        );
      }

      case 'q10_comments':
        return <CommentQuestion onComplete={handleFinish} />;

      case 'loading':
        return <LoadingScreen />;

      case 'completion':
        return <CompletionScreen message={aiMessage} />;

      default:
        return null;
    }
  };

  return (
    <Layout progress={progress} showProgress={!isStaffPage}>
      {renderContent()}
    </Layout>
  );
};


export default App;
