
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

const App: React.FC = () => {
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

  // Admin/Staff state for generating links
  const [adminMobileInput, setAdminMobileInput] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  // Initialize mobile number from URL parameter on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mobile = params.get('mobile');
    if (mobile) {
      setData(prev => ({ ...prev, mobileNumber: mobile }));
    }
  }, []);

  const generateLink = () => {
    if (!adminMobileInput) return;
    const url = new URL(window.location.href);
    url.searchParams.set('mobile', adminMobileInput);
    setGeneratedUrl(url.toString());
  };

  const stepsOrder: StepId[] = [
    'welcome',
    'q1_stylists',
    ...QUESTIONS.map(q => q.id as StepId),
    'q10_comments',
    'loading',
    'completion'
  ];

  const currentStepIndex = useMemo(() => stepsOrder.indexOf(step), [step]);
  const progress = useMemo(() => ((currentStepIndex + 1) / stepsOrder.length) * 100, [currentStepIndex]);

  const nextStep = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < stepsOrder.length) {
      setStep(stepsOrder[nextIdx]);
    }
  };

  const handleFinish = async (finalComments: string) => {
    const updatedData = { ...data, additionalComments: finalComments };
    setData(updatedData);
    setStep('loading');

    // Parallel execution of sync and AI message generation
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
  };

  const renderStep = () => {
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

            {/* Staff / Client Link Generator Section */}
            <div className="mt-32 w-full max-w-sm border-t border-gray-200 pt-8 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Staff Access</p>

              {data.mobileNumber && (
                <div className="mb-4 text-sm text-luxury-gold font-medium">
                  Client Mobile: {data.mobileNumber}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Client Mobile #"
                  className="flex-1 bg-transparent border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-luxury-gold font-light"
                  value={adminMobileInput}
                  onChange={(e) => setAdminMobileInput(e.target.value)}
                />
                <button
                  onClick={generateLink}
                  className="text-xs uppercase tracking-widest text-gray-500 hover:text-luxury-gold transition-colors"
                >
                  Generate Link
                </button>
              </div>

              {generatedUrl && (
                <div className="mt-4 p-4 bg-gray-50 rounded text-left">
                  <p className="text-xs text-gray-400 mb-2">Unique URL:</p>
                  <code className="block text-xs text-gray-600 break-all mb-2">{generatedUrl}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedUrl);
                      // Also proactively set it for this session just in case they want to start immediately
                      setData(prev => ({ ...prev, mobileNumber: adminMobileInput }));
                    }}
                    className="text-xs text-luxury-gold font-bold uppercase tracking-wider"
                  >
                    Copy & Set Active
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'q1_stylists':
        return (
          <StylistRatingComponent
            onComplete={(ratings) => {
              setData({ ...data, stylistRatings: ratings });
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

        return (
          <BinaryQuestion
            text={qConfig.text}
            onAnswer={(val) => {
              setData({ ...data, [fieldMap[step]]: val });
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
    <Layout progress={progress}>
      {renderStep()}
    </Layout>
  );
};

export default App;
