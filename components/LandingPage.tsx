import React, { useState, useRef } from 'react';
import {
    SparklesIcon, ArrowRightIcon, GithubBrandIcon, LogoIcon, UploadIcon,
    CloseIcon, SunIcon, MoonIcon, RobotIcon, EyeIcon, DragIcon,
    DownloadIcon, SettingsIcon, CheckIcon
} from './icons';

interface LandingPageProps {
    onGetStarted: () => void;
    onScanAndOptimize: (file: File, jobDescription: string) => Promise<void>;
    isProcessing: boolean;
    onToggleTheme: () => void;
    theme: 'light' | 'dark';
    showScanModal: boolean;
    setShowScanModal: (show: boolean) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
    onGetStarted,
    onScanAndOptimize,
    isProcessing,
    onToggleTheme,
    theme,
    showScanModal,
    setShowScanModal
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleScanSubmit = async () => {
        if (!selectedFile || !jobDescription) return;
        await onScanAndOptimize(selectedFile, jobDescription);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-primary animate-fade-in font-sans selection:bg-accent/30 overflow-x-hidden">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-10 relative">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-8 h-8 bg-primary text-background rounded-full flex items-center justify-center">
                        <LogoIcon className="text-[18px]" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Civvi</span>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/Vrun-design/Civvi.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-medium"
                    >
                        <GithubBrandIcon className="w-4 h-4" />
                        Star on GitHub
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center px-6 pt-12 pb-24 relative overflow-hidden">
                {/* Abstract background blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/50 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-4 shadow-sm animate-fade-in">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        POWERED BY XP
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-primary leading-[0.95] mb-2 animate-slide-up">
                        Get Hired. <br />
                        <span className="text-zinc-400">Not Filtered.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed font-light animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        The intelligent workspace to parse, analyze, and optimize your resume for modern Applicant Tracking Systems.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={onGetStarted}
                            className="h-14 px-8 rounded-full bg-primary text-background font-semibold text-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:-translate-y-1 dark:shadow-none"
                        >
                            Build Resume
                        </button>
                        <button
                            onClick={() => setShowScanModal(true)}
                            className="h-14 px-8 rounded-full border border-border bg-transparent text-primary font-medium text-lg hover:bg-surface transition-colors flex items-center gap-2"
                        >
                            <SparklesIcon className="text-primary" />
                            Scan & Optimize
                        </button>
                    </div>
                </div>
            </div>

            {/* Bento Grid Features Section */}
            <section className="py-20 relative z-10 border-t border-border bg-background/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold tracking-tight text-primary">Core Capabilities</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Feature 1: ATS Intelligence (Large Card) */}
                        <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-surface/30 border border-border p-8 flex flex-col justify-between hover:bg-surface/50 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <RobotIcon className="text-[200px]" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-background flex items-center justify-center mb-6">
                                    <RobotIcon className="text-[24px]" />
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-2">ATS Intelligence</h3>
                                <p className="text-zinc-500 leading-relaxed max-w-md">
                                    Don't guess. Know. Parse your resume against job descriptions using Gemini models to identify keyword gaps.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs font-bold">Score Analysis</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-xs font-bold">Keyword Match</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2: AI Writer */}
                        <div className="md:col-span-1 rounded-3xl bg-surface/30 border border-border p-8 hover:bg-surface/50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                                <SparklesIcon className="text-[20px]" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">AI Writer</h3>
                            <p className="text-sm text-zinc-500">
                                Transform weak bullet points into impactful achievements with one click.
                            </p>
                        </div>

                        {/* Feature 3: Live Preview */}
                        <div className="md:col-span-1 rounded-3xl bg-surface/30 border border-border p-8 hover:bg-surface/50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                                <EyeIcon className="text-[20px]" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">Real-time Preview</h3>
                            <p className="text-sm text-zinc-500">
                                See your PDF changes instantly with accurate A4 page breaks.
                            </p>
                        </div>

                        {/* Feature 4: Layout */}
                        <div className="md:col-span-1 rounded-3xl bg-surface/30 border border-border p-8 hover:bg-surface/50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                                <DragIcon className="text-[20px]" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">Smart Reordering</h3>
                            <p className="text-sm text-zinc-500">
                                Drag and drop sections to tailor your narrative for every role.
                            </p>
                        </div>

                        {/* Feature 5: Design */}
                        <div className="md:col-span-1 rounded-3xl bg-surface/30 border border-border p-8 hover:bg-surface/50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4">
                                <SettingsIcon className="text-[20px]" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">Custom Themes</h3>
                            <p className="text-sm text-zinc-500">
                                Typography and accent controls to match your personal brand.
                            </p>
                        </div>

                        {/* Feature 6: Export */}
                        <div className="md:col-span-1 rounded-3xl bg-surface/30 border border-border p-8 hover:bg-surface/50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-zinc-500/10 text-zinc-500 flex items-center justify-center mb-4">
                                <DownloadIcon className="text-[20px]" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">Clean Export</h3>
                            <p className="text-sm text-zinc-500">
                                Generate semantic, machine-readable PDFs that pass ATS parsers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section className="py-24 bg-background relative border-t border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
                        <div>
                            <h2 className="text-2xl font-semibold text-primary tracking-tight mb-2">Select your foundation.</h2>
                            <p className="text-sm text-zinc-500">Engineered for readability and impact.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Template Stockholm */}
                        <div onClick={onGetStarted} className="group cursor-pointer">
                            <div className="aspect-[3/4] bg-surface rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500 border border-border">
                                <div className="absolute inset-0 p-8 opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {/* Abstract Resume Stockholm */}
                                    <div className="w-full h-full bg-background shadow-lg border border-border/50 p-6">
                                        <div className="text-center mb-6">
                                            <div className="h-4 w-1/2 bg-primary mx-auto mb-2"></div>
                                            <div className="h-2 w-1/3 bg-zinc-300 mx-auto"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-0.5 w-full bg-border"></div>
                                            <div className="h-2 w-1/4 bg-primary"></div>
                                            <div className="h-1.5 w-full bg-zinc-200"></div>
                                            <div className="h-1.5 w-5/6 bg-zinc-200"></div>
                                            <div className="h-1.5 w-full bg-zinc-200"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
                                    <h3 className="text-lg font-bold text-primary">Stockholm</h3>
                                    <p className="text-xs text-zinc-500">Minimalist serif. Executive & Clean.</p>
                                </div>
                            </div>
                        </div>

                        {/* Template Tokyo */}
                        <div onClick={onGetStarted} className="group cursor-pointer">
                            <div className="aspect-[3/4] bg-surface rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500 border border-border">
                                <div className="absolute inset-0 p-8 opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {/* Abstract Resume Tokyo */}
                                    <div className="w-full h-full bg-background shadow-lg border border-border/50 p-6">
                                        <div className="text-left mb-6">
                                            <div className="h-8 w-1/2 bg-primary mb-2"></div>
                                            <div className="h-2 w-full bg-accent"></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-1 space-y-2">
                                                <div className="h-1.5 w-full bg-zinc-300"></div>
                                                <div className="h-1.5 w-full bg-zinc-300"></div>
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <div className="h-2 w-1/3 bg-primary"></div>
                                                <div className="h-1.5 w-full bg-zinc-200"></div>
                                                <div className="h-1.5 w-5/6 bg-zinc-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
                                    <h3 className="text-lg font-bold text-primary">Tokyo</h3>
                                    <p className="text-xs text-zinc-500">Bold sans-serif. Tech & Creative.</p>
                                </div>
                            </div>
                        </div>

                        {/* Coming Soon */}
                        <div className="group relative">
                            <div className="aspect-[3/4] bg-surface/30 border border-border border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8 hover:bg-surface/50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-sm">
                                    <SparklesIcon className="text-zinc-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-primary">Berlin & NYC</h3>
                                <p className="text-xs text-zinc-500 mt-2 max-w-[160px] leading-relaxed">
                                    Engineering and creative focused templates coming soon.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 border-t border-border bg-background">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-6">
                        Build your future.
                    </h2>
                    <p className="text-lg text-zinc-500 mb-10">
                        Join thousands of professionals securing interviews with Civvi.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="h-12 px-8 rounded-full bg-primary text-background font-semibold text-sm hover:opacity-90 transition-all shadow-lg"
                    >
                        Start Building Now
                    </button>
                </div>
            </section>

            {/* Simplified Footer */}
            <footer className="border-t border-border py-8 px-6 bg-background">
                <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
                    <p className="text-xs text-zinc-500 font-mono">Civvi © 2025.</p>

                    <button
                        onClick={onToggleTheme}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-surface transition-colors text-xs font-medium text-zinc-500 hover:text-primary"
                    >
                        {theme === 'dark' ? <><SunIcon className="text-[14px]" /> Light</> : <><MoonIcon className="text-[14px]" /> Dark</>}
                    </button>
                </div>
            </footer>

            {/* Scan Modal */}
            {showScanModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex justify-between items-center bg-surface/50">
                            <div>
                                <h2 className="text-xl font-bold text-primary">ATS Intelligence Scanner</h2>
                                <p className="text-sm text-zinc-500">Upload your CV and the Job Description to get a match score.</p>
                            </div>
                            <button onClick={() => setShowScanModal(false)} className="text-zinc-500 hover:text-primary transition-colors">
                                <CloseIcon className="text-[24px]" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-8 overflow-y-auto">
                            {/* Step 1: Upload */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">1. Upload Resume (PDF)</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-accent bg-accent/5' : 'border-border hover:border-zinc-500 hover:bg-surface'}`}
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,image/*" />
                                    {selectedFile ? (
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                                <UploadIcon className="text-[20px]" />
                                            </div>
                                            <p className="font-medium text-primary">{selectedFile.name}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <UploadIcon className="text-[32px] text-zinc-600 mb-3 mx-auto" />
                                            <p className="text-sm text-zinc-400">Click to upload or drag and drop</p>
                                            <p className="text-xs text-zinc-600 mt-1">PDF, DOCX, PNG supported</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: JD */}
                            <div className="space-y-3 h-full flex flex-col">
                                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">2. Paste Job Description</label>
                                <textarea
                                    className="w-full h-32 bg-input border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none placeholder-zinc-700"
                                    placeholder="Paste the full job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-border bg-surface/50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowScanModal(false)}
                                disabled={isProcessing}
                                className="px-6 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:text-primary hover:bg-input transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleScanSubmit}
                                disabled={!selectedFile || !jobDescription || isProcessing}
                                className={`px-8 py-3 rounded-lg text-sm font-bold bg-primary text-background hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden ${isProcessing ? 'cursor-wait' : ''}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        <span className="animate-spin">⟳</span> Processing...
                                    </>
                                ) : (
                                    <>
                                        Run Analysis <ArrowRightIcon />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;