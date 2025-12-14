import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, Template, AtsAnalysis, Experience } from './types';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import AtsOptimizer from './components/AtsOptimizer';
import LandingPage from './components/LandingPage';
import ApiKeyModal from './components/ApiKeyModal';
import { parseResumeFromFile, parseResumeFromText, analyzeWithATS, hasApiKey } from './services/geminiService';
import {
    SettingsIcon, DownloadIcon, ArrowLeftIcon, ArrowRightIcon,
    SparklesIcon, UploadIcon, AddIcon, DragIcon, SunIcon, MoonIcon, LogoIcon, DeleteIcon, CloseIcon, CheckIcon
} from './components/icons';

const initialResumeData: ResumeData = {
    personalInfo: {
        name: "Alex Morgan",
        title: "Senior Product Designer",
        email: "alex.morgan@design.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexmorgan",
        github: "dribbble.com/alexmorgan",
        portfolio: "alexmorgan.design",
    },
    summary: "Creative and user-centric Product Designer with 6+ years of experience in designing intuitive digital experiences for web and mobile platforms. Proficient in the end-to-end design process, from user research and wireframing to high-fidelity prototyping and design systems. Passionate about solving complex problems through elegant, accessible, and data-driven design solutions.",
    experience: [
        {
            id: "exp1",
            title: "Senior Product Designer",
            company: "TechFlow Solutions",
            location: "San Francisco, CA",
            startDate: "March 2021",
            endDate: "Present",
            isCurrent: true,
            responsibilities: [
                "Led the redesign of the core SaaS dashboard, resulting in a 25% increase in user engagement and a 15% reduction in churn.",
                "Established and maintained a comprehensive Design System in Figma, improving design-to-development handoff efficiency by 40%.",
                "Conducted user research, usability testing, and stakeholder interviews to inform product strategy and roadmap.",
                "Mentored junior designers and fostered a collaborative design culture within the product team."
            ]
        },
        {
            id: "exp2",
            title: "UX/UI Designer",
            company: "CreativePulse Agency",
            location: "Austin, TX",
            startDate: "June 2018",
            endDate: "February 2021",
            isCurrent: false,
            responsibilities: [
                "Designed responsive websites and mobile apps for diverse clients in fintech, healthcare, and e-commerce sectors.",
                "Collaborated with cross-functional teams to deliver high-quality designs within tight deadlines.",
                "Created interactive prototypes using Protopie and Principle to validate design concepts with users.",
                "Facilitated design workshops and sprints to accelerate ideation and problem-solving."
            ]
        }
    ],
    education: [
        {
            id: "edu1",
            degree: "Bachelor of Fine Arts in Interaction Design",
            university: "California College of the Arts",
            location: "San Francisco, CA",
            startDate: "September 2014",
            endDate: "May 2018",
        }
    ],
    projects: [
        {
            id: "proj1",
            name: "FinTrack Mobile App",
            techStack: ["Figma", "iOS", "User Research"],
            link: "alexmorgan.design/fintrack",
            description: "A personal finance management app designed to help millennials track expenses and set savings goals. Featured in 'Best Design' on Behance."
        },
        {
            id: "proj2",
            name: "EcoShop E-commerce",
            techStack: ["Adobe XD", "Webflow", "Sustainability"],
            link: "alexmorgan.design/ecoshop",
            description: "An eco-friendly e-commerce platform focused on sustainable products. Implemented a carbon footprint calculator in the checkout flow."
        }
    ],
    skills: ["Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research", "Wireframing", "Design Systems", "HTML/CSS", "Accessibility (WCAG)", "Agile"],
    certifications: [
        {
            id: "cert1",
            name: "Google UX Design Professional Certificate",
            provider: "Coursera",
            date: "2020",
            link: ""
        }
    ],
    customSections: [],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
};

const fontOptions = [
    { value: 'Helvetica, sans-serif', label: 'Helvetica', pdfFont: 'Helvetica' },
    { value: 'Times New Roman, serif', label: 'Times Roman', pdfFont: 'Times-Roman' },
];

const colorOptions = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Black', value: '#18181b' },
];

const STANDARD_SECTIONS = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];

type EditorView = 'editor' | 'ats';
type ViewState = 'landing' | 'app';
type Theme = 'dark' | 'light';

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const App: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('landing');
    const [theme, setTheme] = useState<Theme>('dark');

    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const [template, setTemplate] = useState<Template>('TemplateA');
    const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
    const [accentColor, setAccentColor] = useState(colorOptions[0].value);

    // BYOK State
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    // Lifted state for Landing Page scanner modal to handle overlaps
    const [showLandingScanModal, setShowLandingScanModal] = useState(false);

    const checkApiKey = () => {
        if (hasApiKey()) return true;

        // If key is missing, close Landing Page modal so invalid key modal shows cleanly
        setShowLandingScanModal(false);
        setShowApiKeyModal(true);
        return false;
    };
    const [activeSectionKey, setActiveSectionKey] = useState<string>('Personal Info'); // Using Key string instead of index
    const [editorView, setEditorView] = useState<EditorView>('editor');

    // New state for handling the initial scan from landing page
    const [initialAtsAnalysis, setInitialAtsAnalysis] = useState<AtsAnalysis | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCustomize, setShowCustomize] = useState(false);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);

    // Drag and Drop State
    const dragItem = useRef<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize theme based on html class
        if (document.documentElement.classList.contains('dark')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'dark') {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        } else {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        }
    };

    const readFileAsBase64 = (file: File): Promise<[string, string]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64String = result.split(',')[1];
                resolve([base64String, file.type]);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    const processParsedData = (parsedData: Partial<ResumeData>) => {
        const newResumeData: ResumeData = {
            personalInfo: { ...initialResumeData.personalInfo, ...parsedData.personalInfo },
            summary: parsedData.summary || initialResumeData.summary,
            experience: parsedData.experience || initialResumeData.experience,
            education: parsedData.education || initialResumeData.education,
            projects: parsedData.projects || initialResumeData.projects,
            skills: parsedData.skills || initialResumeData.skills,
            certifications: parsedData.certifications || initialResumeData.certifications,
            customSections: parsedData.customSections || initialResumeData.customSections,
            sectionOrder: parsedData.sectionOrder || initialResumeData.sectionOrder,
        };
        setResumeData(newResumeData);
        setActiveSectionKey('Personal Info');
        return newResumeData;
    };

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check API Key for image processing as it uses multimodal
        if (file.type.startsWith("image/") && !checkApiKey()) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let parsedData: Partial<ResumeData>;
            if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const arrayBuffer = await file.arrayBuffer();
                const mammoth = (window as any).mammoth;
                if (!mammoth) throw new Error("Document parser not loaded. Please refresh.");

                const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
                parsedData = await parseResumeFromText(html);
            } else if (file.type === "application/pdf" || file.type.startsWith("image/")) {
                const [base64String, mimeType] = await readFileAsBase64(file);
                parsedData = await parseResumeFromFile(base64String, mimeType);
            } else {
                throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF, DOCX, PNG, or JPEG file.`);
            }
            processParsedData(parsedData);
            setViewState('app');
        } catch (e: any) {
            setError(e.message || 'Failed to parse resume.');
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // -- AI Actions --
    const handleScanAndOptimize = async (file: File, jd: string) => {
        if (!checkApiKey()) return;

        setIsLoading(true);
        setError(null);
        try {
            if (file) {
                if (file.type === 'application/pdf' || file.type.includes('word')) {
                    // If it's a new file, we parse then analyze
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const base64 = (e.target?.result as string).split(',')[1];
                        try {
                            // Parse first
                            const parsedData = await parseResumeFromFile(base64, file.type);
                            setResumeData(prev => ({ ...prev, ...parsedData }));

                            // Then Analyze
                            const fullData = { ...resumeData, ...parsedData };
                            const analysis = await analyzeWithATS(fullData, jd);
                            setInitialAtsAnalysis(analysis);
                            setEditorView('ats');
                            setViewState('app');
                        } catch (err) {
                            console.error(err);
                            setError("Failed to parse and analyze resume.");
                        } finally {
                            setIsLoading(false);
                        }
                    };
                    reader.readAsDataURL(file);
                    // Return early as reader is async logic
                    return;
                }
            }

            // Fallback for no file (analyze existing data) - usually called from LandingPage with just text but LandingPage sends file currently. 
            // Or if called from within app (Optimizer view)
            const analysis = await analyzeWithATS(resumeData, jd);
            setInitialAtsAnalysis(analysis);
            setEditorView('ats');
            setViewState('app');

        } catch (err: any) {
            setError("Failed to analyze resume. Please check your API key and try again.");
            console.error(err);
        } finally {
            // Only stop loading if we didn't start the async file reader
            if (!file) setIsLoading(false);
        }
    };

    const handleAddStandardSection = (sectionKey: string) => {
        if (!resumeData.sectionOrder.includes(sectionKey)) {
            setResumeData(prev => ({
                ...prev,
                sectionOrder: [...prev.sectionOrder, sectionKey]
            }));
            setActiveSectionKey(capitalize(sectionKey));
            setShowAddSectionModal(false);
        }
    };

    const handleAddCustomSection = (title: string) => {
        if (title) {
            const newSectionKey = title.toLowerCase();
            if (resumeData.sectionOrder.includes(newSectionKey) || resumeData.customSections.some(cs => cs.title.toLowerCase() === newSectionKey)) {
                alert('A section with this title already exists.');
                return;
            }

            const newSection = {
                id: crypto.randomUUID(),
                title: title,
                content: '- New item'
            };

            setResumeData(prev => ({
                ...prev,
                customSections: [...prev.customSections, newSection],
                sectionOrder: [...prev.sectionOrder, newSectionKey]
            }));
            setActiveSectionKey(title);
            setShowAddSectionModal(false);
        }
    };

    const handleDeleteSection = (sectionKey: string) => {
        if (window.confirm(`Are you sure you want to remove the ${capitalize(sectionKey)} section? Data will be preserved if you add it back later.`)) {
            setResumeData(prev => ({
                ...prev,
                sectionOrder: prev.sectionOrder.filter(s => s !== sectionKey)
            }));
            if (activeSectionKey.toLowerCase() === sectionKey) {
                setActiveSectionKey('Personal Info');
            }
        }
    };


    const handleExportPdf = async () => {
        try {
            setIsLoading(true);

            // Dynamic import to avoid bundling issues
            const { generatePDF } = await import('./services/pdfGeneratorReactPDF.tsx');

            await generatePDF(resumeData, template, {
                accentColor,
                fontFamily
            });

            setIsLoading(false);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to export PDF. Please try again.');
            setIsLoading(false);
        }
    };

    const handleApplyAtsSuggestions = async (analysis: AtsAnalysis) => {
        if (!checkApiKey()) return;

        setIsLoading(true);
        // Apply suggestions logic
        // ...
        // We might need to call rewriteText here or iterate through suggestions
        // For now, let's assume this function just applies suggestions to the state directly if they are already generated
        // But if it triggers new AI calls, we need the key.
        // Looking at the code: AtsOptimizer passes 'analysis' which HAS suggestions.
        // So we just merge them.

        // Wait, AtsOptimizer might rely on rewriteText for "Optimize & Edit" button?
        // Let's check rewriteText usage.

        // Actually, looking at the previous code (if I could see it), handleApplyAtsSuggestions was likely empty or simple merge.
        // But let's look at what was there before I start guessing.

        let newResumeData = { ...resumeData };
        if (analysis.summarySuggestions) {
            newResumeData.summary = analysis.summarySuggestions;
        }

        // We need to match experience IDs
        if (analysis.experienceSuggestions) {
            newResumeData.experience = newResumeData.experience.map(exp => {
                const suggestion = analysis.experienceSuggestions?.find(s => s.experienceId === exp.id);
                if (suggestion) {
                    return { ...exp, responsibilities: suggestion.suggestions };
                }
                return exp;
            });
        }

        setResumeData(newResumeData);
        setEditorView('editor');
        setIsLoading(false);
        setActiveSectionKey('Personal Info');
        setInitialAtsAnalysis(null);
    };

    // -- Improved Drag and Drop Logic --
    const onDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.classList.add('opacity-50');
    };

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        e.preventDefault();
        if (dragItem.current === null || dragItem.current === position) return;

        const listCopy = [...resumeData.sectionOrder];
        const draggedItemContent = listCopy[dragItem.current];

        // Remove from old index
        listCopy.splice(dragItem.current, 1);
        // Insert at new index
        listCopy.splice(position, 0, draggedItemContent);

        dragItem.current = position;
        setResumeData(prev => ({ ...prev, sectionOrder: listCopy }));
    };

    const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50');
        dragItem.current = null;
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    // Sections Logic
    const availableSections = STANDARD_SECTIONS.filter(s => !resumeData.sectionOrder.includes(s));

    if (viewState === 'landing') {
        return (
            <>
                <ApiKeyModal
                    isOpen={showApiKeyModal}
                    onClose={() => setShowApiKeyModal(false)}
                    onSave={(key) => {
                        localStorage.setItem('gemini_api_key', key);
                        setShowApiKeyModal(false);
                    }}
                />
                <LandingPage
                    onGetStarted={() => setViewState('app')}
                    onScanAndOptimize={handleScanAndOptimize}
                    isProcessing={isLoading}
                    onToggleTheme={toggleTheme}
                    theme={theme}
                    showScanModal={showLandingScanModal}
                    setShowScanModal={setShowLandingScanModal}
                />
            </>
        );
    }

    return (
        <div className="bg-background text-primary min-h-screen flex flex-col font-sans overflow-hidden animate-fade-in selection:bg-accent/30">
            <ApiKeyModal
                isOpen={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                onSave={(key) => {
                    localStorage.setItem('gemini_api_key', key);
                    setShowApiKeyModal(false);
                }}
            />
            {/* Top Header */}
            <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 z-20 no-print">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewState('landing')}>
                    <div className="w-8 h-8 bg-primary text-background rounded-full flex items-center justify-center shadow-sm">
                        <LogoIcon className="text-[18px]" />
                    </div>
                    <span className="font-semibold tracking-tight hidden sm:inline-block text-lg">Civvi</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-input text-zinc-500 hover:text-primary transition-colors md:hidden"
                    >
                        {theme === 'dark' ? <SunIcon className="text-[20px]" /> : <MoonIcon className="text-[20px]" />}
                    </button>

                    {error && <span className="text-red-500 text-xs font-medium mr-2">{error}</span>}
                    <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".pdf,.docx,image/png,image/jpeg" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-primary transition-colors border border-border rounded-md hover:border-zinc-500 hover:bg-input"
                    >
                        {isLoading ? <span className="animate-spin">⟳</span> : <UploadIcon className="text-[18px]" />}
                        Import
                    </button>
                    <button
                        onClick={handleExportPdf}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-background rounded-md hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <span className="animate-spin">⟳</span> : <DownloadIcon className="text-[18px]" />}
                        Export PDF
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Sidebar (Navigation) */}
                <aside className="w-64 bg-surface border-r border-border flex flex-col hidden md:flex no-print">
                    <div className="p-4 border-b border-border">
                        <div className="flex gap-1 p-1 bg-input rounded-lg border border-border">
                            <button
                                onClick={() => setEditorView('editor')}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-all ${editorView === 'editor' ? 'bg-secondary text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-400'}`}
                            >
                                Editor
                            </button>
                            <button
                                onClick={() => setEditorView('ats')}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-all ${editorView === 'ats' ? 'bg-secondary text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-400'}`}
                            >
                                Optimizer
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-hide">
                        {editorView === 'editor' ? (
                            <>
                                <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sections</div>

                                {/* Static Personal Info */}
                                <button
                                    onClick={() => setActiveSectionKey('Personal Info')}
                                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-between group mb-1 ${activeSectionKey === 'Personal Info' ? 'bg-secondary text-primary' : 'text-zinc-500 hover:bg-input hover:text-primary'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="w-4 h-4 opacity-0"></span>
                                        Personal Info
                                    </span>
                                    {/* Removed the active dot from static section to match design request if needed, but request was likely about the draggable list. Assuming keeping it for static is fine, but removing from list. */}
                                </button>

                                {/* Draggable Sections */}
                                {resumeData.sectionOrder.map((sectionKey, index) => {
                                    const displayName = capitalize(sectionKey === 'summary' ? 'Summary/Profile' : sectionKey);
                                    const isActive = activeSectionKey.toLowerCase() === sectionKey.toLowerCase();

                                    // Try to find if it is a custom section to get proper case title
                                    const customSec = resumeData.customSections.find(cs => cs.title.toLowerCase() === sectionKey);
                                    const title = customSec ? customSec.title : displayName;

                                    return (
                                        <div
                                            key={sectionKey}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, index)}
                                            onDragEnter={(e) => onDragEnter(e, index)}
                                            onDragEnd={onDragEnd}
                                            onDragOver={onDragOver}
                                            className={`relative group rounded-md mb-0.5 transition-all duration-200 ${isActive ? 'bg-secondary' : 'hover:bg-input'}`}
                                        >
                                            <div
                                                onClick={() => setActiveSectionKey(title)}
                                                className={`w-full text-left pl-3 pr-8 py-2.5 rounded-md text-sm font-medium flex items-center gap-3 cursor-pointer ${isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-primary'}`}
                                            >
                                                <div
                                                    className="text-zinc-400 dark:text-zinc-500 flex-shrink-0 cursor-grab active:cursor-grabbing hover:text-primary transition-colors"
                                                >
                                                    <DragIcon className="text-[16px] opacity-60" />
                                                </div>
                                                <span className="truncate select-none">{title}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                <button
                                                    // IMPORTANT: Stop propagation and prevent default to allow click to pass through draggable parent
                                                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        handleDeleteSection(sectionKey);
                                                    }}
                                                    className="text-zinc-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                                                    title="Remove Section"
                                                >
                                                    <DeleteIcon className="text-[16px]" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <button
                                    onClick={() => setShowAddSectionModal(true)}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-zinc-500 hover:text-primary hover:bg-input flex items-center gap-3 mt-4 transition-colors"
                                >
                                    <span className="w-4 h-4 flex items-center justify-center"><AddIcon className="text-[16px]" /></span>
                                    Add Section
                                </button>
                            </>
                        ) : (
                            <div className="px-3 py-4 text-sm text-zinc-500 leading-relaxed">
                                Switch to ATS Mode to analyze your resume against specific job descriptions.
                            </div>
                        )}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-border">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-center gap-2 p-2 rounded-md hover:bg-input text-zinc-500 hover:text-primary transition-colors text-sm font-medium"
                        >
                            {theme === 'dark' ? <><SunIcon className="text-[18px]" /> Light Mode</> : <><MoonIcon className="text-[18px]" /> Dark Mode</>}
                        </button>
                    </div>
                </aside>

                {/* Center Panel (Editor) */}
                <main className="flex-1 flex flex-col bg-background relative overflow-hidden transition-colors duration-300 no-print">
                    <div className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth">
                        <div className="max-w-3xl mx-auto">
                            {editorView === 'editor' ? (
                                <div className="animate-fade-in space-y-6">
                                    <div className="flex items-end justify-between border-b border-border pb-4 mb-6">
                                        <div>
                                            <h1 className="text-2xl font-semibold tracking-tight text-primary">{activeSectionKey}</h1>
                                            <p className="text-zinc-500 text-sm mt-1">Manage details for this section.</p>
                                        </div>
                                    </div>
                                    <ResumeEditor data={resumeData} setData={setResumeData} activeSection={activeSectionKey} />
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    <div className="border-b border-border pb-4 mb-6">
                                        <h1 className="text-2xl font-semibold tracking-tight text-primary flex items-center gap-2">
                                            <SparklesIcon className="text-accent" /> ATS Optimizer
                                        </h1>
                                        <p className="text-zinc-500 text-sm mt-1">Analyze and optimize for Applicant Tracking Systems.</p>
                                    </div>
                                    <AtsOptimizer
                                        resumeData={resumeData}
                                        onApplySuggestions={handleApplyAtsSuggestions}
                                        initialAnalysis={initialAtsAnalysis}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="h-20"></div>
                    </div>
                </main>

                {/* Right Panel (Preview) */}
                <aside className="w-[45%] xl:w-[40%] bg-surface border-l border-border hidden lg:flex flex-col relative transition-colors duration-300 print-preview-container">
                    <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface/50 backdrop-blur-sm z-10 absolute top-0 w-full no-print">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Live Preview</span>
                        <button
                            onClick={() => setShowCustomize(!showCustomize)}
                            className={`p-1.5 rounded transition-colors ${showCustomize ? 'bg-input text-primary' : 'text-zinc-400 hover:text-primary'}`}
                        >
                            <SettingsIcon className="text-[20px]" />
                        </button>
                    </div>

                    {showCustomize && (
                        <div className="absolute top-12 right-4 w-64 bg-input border border-border rounded-lg shadow-2xl z-20 p-4 space-y-4 animate-fade-in no-print">
                            {/* ... customization options ... */}
                            <div>
                                <label className="text-xs font-medium text-zinc-400 block mb-2">Template</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setTemplate('TemplateA')}
                                        className={`px-3 py-2 text-xs rounded border transition-all ${template === 'TemplateA' ? 'border-accent bg-accent/10 text-primary' : 'border-border text-zinc-500 hover:border-zinc-400'}`}
                                    >
                                        Stockholm
                                    </button>
                                    <button
                                        onClick={() => setTemplate('TemplateB')}
                                        className={`px-3 py-2 text-xs rounded border transition-all ${template === 'TemplateB' ? 'border-accent bg-accent/10 text-primary' : 'border-border text-zinc-500 hover:border-zinc-400'}`}
                                    >
                                        Tokyo
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-400 block mb-2">Typography</label>
                                <select
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                    className="w-full bg-background border border-border rounded px-2 py-2 text-xs text-primary focus:outline-none focus:border-zinc-500"
                                >
                                    {fontOptions.map(font => (
                                        <option key={font.value} value={font.value}>{font.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-400 block mb-2">Accent Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setAccentColor(color.value)}
                                            className={`w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform ${accentColor === color.value ? 'ring-2 ring-offset-2 ring-offset-input ring-white' : ''}`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-hidden bg-zinc-900 dark:bg-[#111] relative flex items-center justify-center p-8">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                        <ResumePreview resumeData={resumeData} template={template} innerRef={previewRef} fontFamily={fontFamily} accentColor={accentColor} />
                    </div>
                </aside>
            </div>

            {/* Add Section Modal */}
            {showAddSectionModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowAddSectionModal(false)}>
                    <div className="bg-surface border border-border rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-primary">Add Section</h2>
                            <button onClick={() => setShowAddSectionModal(false)} className="text-zinc-500 hover:text-primary"><CloseIcon className="text-[20px]" /></button>
                        </div>

                        {availableSections.length > 0 && (
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">Restore Standard Sections</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableSections.map(section => (
                                        <button
                                            key={section}
                                            onClick={() => handleAddStandardSection(section)}
                                            className="flex items-center gap-2 p-3 bg-input border border-border rounded-lg hover:border-accent hover:text-accent transition-all text-sm font-medium text-left"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-zinc-400">
                                                <AddIcon className="text-[14px]" />
                                            </div>
                                            {capitalize(section)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">Create Custom Section</label>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    handleAddCustomSection(formData.get('customTitle') as string);
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    name="customTitle"
                                    type="text"
                                    placeholder="e.g. Publications, Volunteering..."
                                    className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent"
                                    autoFocus
                                />
                                <button type="submit" className="bg-primary text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
                                    Create
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;