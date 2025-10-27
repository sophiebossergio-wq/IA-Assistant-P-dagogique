import React, { useState, useCallback } from 'react';
import { LearnerLevel, FeedbackTone } from './types';
import type { FeedbackParams, Feedback } from './types';
import { generateFeedback } from './services/geminiService';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { AcademicCapIcon } from './components/icons';

function App() {
  const [level, setLevel] = useState<LearnerLevel>(LearnerLevel.Intermediate);
  const [tone, setTone] = useState<FeedbackTone>(FeedbackTone.Benevolent);
  const [text, setText] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!text) return;

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    const params: FeedbackParams = { level, tone, text };
    
    try {
      const result = await generateFeedback(params);
      setFeedback(result);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('An unknown error occurred.');
        }
      setFeedback(null);
    } finally {
      setIsLoading(false);
    }
  }, [level, tone, text]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
            <AcademicCapIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400"/>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
            Assistant Pédagogique <span className="text-indigo-500">IA</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Générez des feedbacks constructifs et personnalisés pour aider vos apprenants à progresser.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="bg-white dark:bg-slate-900/70 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 mb-8 lg:mb-0">
            <FeedbackForm
              level={level}
              setLevel={setLevel}
              tone={tone}
              setTone={setTone}
              text={text}
              setText={setText}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:sticky top-8 self-start">
             <FeedbackDisplay
                feedback={feedback}
                isLoading={isLoading}
                error={error}
            />
          </div>
        </div>
        
        <footer className="text-center mt-16 text-sm text-slate-500 dark:text-slate-400">
            <p>Powered by Google Gemini. Designed for educational purposes.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
