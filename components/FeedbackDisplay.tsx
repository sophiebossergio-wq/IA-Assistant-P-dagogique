import React, { useMemo, useState } from 'react';
import type { Feedback } from '../types';
import { LightBulbIcon, ExclamationTriangleIcon, AcademicCapIcon, ThumbsUpIcon, PencilRulerIcon, SparklesIcon, ClipboardIcon, ClipboardCheckIcon } from './icons';

interface FeedbackDisplayProps {
  feedback: Feedback | null;
  isLoading: boolean;
  error: string | null;
}

const FeedbackSection: React.FC<{ title: string; items: string[]; icon: React.ReactNode }> = ({ title, items, icon }) => {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="flex items-center text-base font-semibold text-slate-800 dark:text-slate-200 mt-5 mb-2">
        {icon}
        {title}
      </h4>
      <ul className="space-y-2 pl-5 list-disc text-slate-700 dark:text-slate-300 marker:text-indigo-500">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isLoading, error }) => {
    const [isCopied, setIsCopied] = useState(false);

    const formattedFeedbackText = useMemo(() => {
        if (!feedback) return '';
        return `
POINTS FORTS :
${feedback.strengths.map(s => `- ${s}`).join('\n')}

POINTS À AMÉLIORER :
${feedback.areasForImprovement.map(s => `- ${s}`).join('\n')}

PISTES D’AMÉLIORATION :
${feedback.suggestions.map(s => `- ${s}`).join('\n')}

MESSAGE FINAL :
${feedback.finalMessage}
        `.trim();
    }, [feedback]);
    
    const handleCopy = () => {
        if (!feedback) return;
        navigator.clipboard.writeText(formattedFeedbackText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        });
    };

  if (isLoading) {
    return (
      <div className="w-full p-8 bg-white dark:bg-slate-800/50 rounded-lg shadow-lg animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-5"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6 mt-8"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-3"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6 mb-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg text-center">
        <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-200">Erreur de Génération</h3>
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="w-full p-8 bg-white dark:bg-slate-800/50 rounded-lg shadow-lg text-center border border-slate-200 dark:border-slate-700/50">
        <AcademicCapIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">En attente d'une analyse</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Remplissez le formulaire pour obtenir un feedback pédagogique détaillé.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 md:p-8 bg-white dark:bg-slate-800/50 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Feedback Détaillé</h3>
        <button
          onClick={handleCopy}
          className="flex items-center text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          aria-label="Copier le feedback"
        >
          {isCopied ? (
            <>
              <ClipboardCheckIcon className="w-4 h-4 mr-2 text-green-500" />
              Copié !
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4 mr-2" />
              Copier
            </>
          )}
        </button>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <FeedbackSection title="Points Forts" items={feedback.strengths} icon={<ThumbsUpIcon className="w-5 h-5 mr-2 text-green-500" />} />
        <FeedbackSection title="Points à Améliorer" items={feedback.areasForImprovement} icon={<PencilRulerIcon className="w-5 h-5 mr-2 text-amber-500" />} />
        <FeedbackSection title="Pistes d'Amélioration" items={feedback.suggestions} icon={<LightBulbIcon className="w-5 h-5 mr-2 text-sky-500" />} />
        
        {feedback.finalMessage && (
             <div>
                <h4 className="flex items-center text-base font-semibold text-slate-800 dark:text-slate-200 mt-5 mb-2">
                    <SparklesIcon className="w-5 h-5 mr-2 text-indigo-500" />
                    Message Final
                </h4>
                <p className="text-slate-700 dark:text-slate-300">{feedback.finalMessage}</p>
            </div>
        )}
      </div>
    </div>
  );
};