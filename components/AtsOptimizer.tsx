import React, { useState, useEffect } from 'react';
import { AtsAnalysis, ResumeData } from '../types';
import { SparklesIcon, RobotIcon, CloseIcon, ArrowRightIcon } from './icons';
import { analyzeWithATS } from '../services/geminiService';

interface AtsOptimizerProps {
  resumeData: ResumeData;
  onApplySuggestions: (analysis: AtsAnalysis) => void;
  initialAnalysis?: AtsAnalysis | null;
}

const AtsOptimizer: React.FC<AtsOptimizerProps> = ({ resumeData, onApplySuggestions, initialAnalysis }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(initialAnalysis || null);

  useEffect(() => {
      if (initialAnalysis) {
          setAnalysis(initialAnalysis);
      }
  }, [initialAnalysis]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description to analyze.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeWithATS(resumeData, jobDescription);
      setAnalysis(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
  };

  return (
    <div className="h-full flex flex-col">
      {!analysis ? (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full pt-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">New Analysis</h2>
                <p className="text-zinc-500">Paste a new job description to check your compatibility.</p>
            </div>
            
            {isLoading ? (
                <div className="flex-1 mb-6 bg-input border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-500/5 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                        <SparklesIcon className="text-primary text-[32px]"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-1">Analyzing Resume...</h3>
                        <p className="text-sm text-zinc-500">Matching skills, experience, and keywords against JD.</p>
                    </div>
                    <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-primary w-1/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 mb-6 relative group">
                    <textarea
                    id="job-description"
                    className="w-full h-64 p-6 bg-input border border-border rounded-2xl text-primary placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all resize-none text-sm leading-relaxed shadow-sm"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste Job Description here (Ctrl+V)..."
                    />
                </div>
            )}
            
            <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                    Powered by XP
                </p>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary text-background font-bold py-3 px-8 rounded-full hover:opacity-90 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
                >
                    {isLoading ? (
                    <>
                        Analyzing...
                    </>
                    ) : (
                    <>
                        <SparklesIcon className="text-[18px]" />
                        Analyze Match
                    </>
                    )}
                </button>
            </div>
            {error && <p className="text-sm text-red-400 mt-4 p-3 bg-red-900/10 border border-red-900/30 rounded">{error}</p>}
        </div>
      ) : (
        <div className="animate-fade-in space-y-8 pb-20">
          {/* Header Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`col-span-1 p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(analysis.score || 0)}`}>
                  <div className="text-5xl font-bold mb-2 tracking-tighter">{analysis.score || 0}%</div>
                  <div className="text-sm font-medium uppercase tracking-wider opacity-80">Match Score</div>
              </div>
              
              <div className="col-span-1 md:col-span-2 p-6 rounded-2xl border border-border bg-surface flex flex-col justify-center">
                   <h3 className="text-lg font-bold text-primary mb-2">Executive Summary</h3>
                   <p className="text-sm text-zinc-500 leading-relaxed">
                       {analysis.score && analysis.score > 80 
                       ? "Great match! Your resume is well-aligned. Review the missing keywords below to reach 100%."
                       : "Good foundation, but optimization is needed. Focus on incorporating the missing hard skills and refining your summary."}
                   </p>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Column: Issues */}
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface/50 border border-border rounded-xl p-5">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? analysis.missingKeywords.map(kw => (
                        <span key={kw} className="px-2.5 py-1 bg-background border border-border text-primary text-xs font-medium rounded-md">
                            {kw}
                        </span>
                        )) : <p className="text-sm text-emerald-500">All key keywords found!</p>}
                    </div>
                </div>
             </div>

             {/* Right Column: Fixes */}
             <div className="lg:col-span-2 space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent"></span> Optimization Plan
                    </h4>
                    <div className="space-y-4">
                        {/* Summary Suggestion */}
                        <div className="bg-background border border-border rounded-xl p-5 hover:border-zinc-500 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <RobotIcon className="text-[20px]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-primary mb-1">Recommended Summary</p>
                                    <p className="text-xs text-zinc-500 mb-3">Tailored to the job description provided.</p>
                                    <div className="p-3 bg-surface rounded-lg text-sm text-zinc-600 italic leading-relaxed border-l-2 border-accent">
                                        "{analysis.summarySuggestions || 'No suggestion available'}"
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience Suggestions */}
                        {analysis.experienceSuggestions && analysis.experienceSuggestions.map((expSugg, i) => (
                             <div key={i} className="bg-background border border-border rounded-xl p-5 hover:border-zinc-500 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center mt-0.5">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-primary mb-3">Bullet Point Improvements</p>
                                        <ul className="space-y-2">
                                            {expSugg.suggestions && expSugg.suggestions.map((s, idx) => (
                                                <li key={idx} className="text-sm text-zinc-600 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-zinc-300 before:rounded-full">
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>
          
           {/* Floating Action Bar */}
           <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3 p-2 bg-zinc-900/90 backdrop-blur-md rounded-full border border-zinc-700 shadow-2xl">
                <button 
                    onClick={() => setAnalysis(null)} 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Clear Analysis"
                >
                    <CloseIcon />
                </button>
                <div className="h-4 w-[1px] bg-zinc-700"></div>
                <button
                    onClick={() => onApplySuggestions(analysis)}
                    className="flex items-center gap-2 bg-white text-black font-bold py-2.5 px-6 rounded-full hover:bg-zinc-200 transition-colors pr-8 relative group"
                >
                    <SparklesIcon className="text-[18px]" />
                    Optimize & Edit
                    <ArrowRightIcon className="absolute right-2 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-[14px]" />
                </button>
           </div>
        </div>
      )}
      
      <style>{`
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AtsOptimizer;