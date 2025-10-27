import React from 'react';
import type { LearnerLevel, FeedbackTone } from '../types';
import { PencilIcon, SparklesIcon } from './icons';

interface FeedbackFormProps {
  level: LearnerLevel;
  setLevel: (level: LearnerLevel) => void;
  tone: FeedbackTone;
  setTone: (tone: FeedbackTone) => void;
  text: string;
  setText: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const levelOptions: { value: LearnerLevel; label: string }[] = [
  { value: 'débutant' as LearnerLevel.Beginner, label: 'Débutant' },
  { value: 'intermédiaire' as LearnerLevel.Intermediate, label: 'Intermédiaire' },
  { value: 'avancé' as LearnerLevel.Advanced, label: 'Avancé' },
];

const toneOptions: { value: FeedbackTone; label: string; description: string }[] = [
  { value: '1' as FeedbackTone.Neutral, label: 'Neutre', description: 'Professionnel et direct.' },
  { value: '2' as FeedbackTone.Benevolent, label: 'Bienveillant', description: 'Constructif et positif.' },
  { value: '3' as FeedbackTone.Encouraging, label: 'Encourageant', description: 'Très positif et motivant.' },
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  level,
  setLevel,
  tone,
  setTone,
  text,
  setText,
  onSubmit,
  isLoading,
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Niveau de l'apprenant</h3>
        <div role="radiogroup" className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-900 p-1.5">
          {levelOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              role="radio"
              aria-checked={level === option.value}
              onClick={() => setLevel(option.value)}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-900 ${
                level === option.value
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Ton souhaité</h3>
        <div role="radiogroup" className="mt-3 space-y-3">
          {toneOptions.map((option) => (
             <label
              key={option.value}
              htmlFor={option.value}
              className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                tone === option.value
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-600 ring-1 ring-indigo-500'
                  : 'bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex h-6 items-center">
                <input
                  id={option.value}
                  name="tone"
                  type="radio"
                  checked={tone === option.value}
                  onChange={() => setTone(option.value)}
                  className="h-4 w-4 border-slate-400 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <span className="font-medium text-slate-800 dark:text-slate-200">{option.label}</span>
                <p className="text-slate-500 dark:text-slate-400">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="learner-text" className="flex items-center text-lg font-medium text-slate-900 dark:text-white">
                <PencilIcon className="w-5 h-5 mr-2 text-slate-500" />
                Texte à évaluer
            </label>
            <span className="text-sm text-slate-500 dark:text-slate-400">{wordCount} mot{wordCount > 1 ? 's' : ''}</span>
        </div>
        <textarea
          id="learner-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="block w-full rounded-md border-0 p-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-indigo-500"
          placeholder="Collez ici le texte de l'apprenant..."
          required
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !text}
          className="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </>
          ) : (
            <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Générer le Feedback
            </>
          )}
        </button>
      </div>
    </form>
  );
};