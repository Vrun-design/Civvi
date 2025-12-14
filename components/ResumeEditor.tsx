import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project, Certification, CustomSection } from '../types';
import { SparklesIcon, DeleteIcon, AddIcon, CloseIcon } from './icons';
import { rewriteText } from '../services/geminiService';

type ResumeEditorProps = {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  activeSection: string;
};

// Vercel-style minimal input with explicit text color enforcement for light mode
const InputField: React.FC<{ 
    label: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    placeholder?: string,
    name?: string,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void 
}> = ({ label, value, onChange, placeholder, name, onKeyDown }) => (
    <div className="group">
        <label className="block text-xs font-medium text-zinc-500 mb-1.5 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-white">{label}</label>
        <input 
            type="text" 
            name={name} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            onKeyDown={onKeyDown} 
            className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all shadow-sm"
        />
    </div>
);

const TextAreaWithAI: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, onRewrite: () => Promise<void>, rows?: number }> = ({ label, value, onChange, onRewrite, rows = 4 }) => {
    const [isRewriting, setIsRewriting] = useState(false);
    const handleRewriteClick = async () => {
        setIsRewriting(true);
        await onRewrite();
        setIsRewriting(false);
    };
    return (
        <div className="group relative">
            <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-zinc-500 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-white">{label}</label>
                <button 
                    onClick={handleRewriteClick} 
                    disabled={isRewriting || !value} 
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface border border-border hover:border-primary/50 text-[10px] font-medium text-zinc-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    {isRewriting ? <span className="animate-spin">⟳</span> : <SparklesIcon className="text-[12px]"/>}
                    {isRewriting ? 'Optimizing...' : 'AI Rewrite'}
                </button>
            </div>
            <textarea 
                value={value} 
                onChange={onChange} 
                rows={rows} 
                className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all resize-y shadow-sm"
            />
        </div>
    );
};


const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, setData, activeSection }) => {
  // State for the new skill input to properly handle typing
  const [newSkillInput, setNewSkillInput] = useState('');

  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: e.target.value } }));
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prev => ({ ...prev, summary: e.target.value }));
  };
  
  const handleRewriteSummary = async () => {
      try {
          const rewritten = await rewriteText(data.summary, 'summary');
          setData(prev => ({...prev, summary: rewritten}));
      } catch (error) {
          console.error("Failed to rewrite summary", error);
          alert("AI rewrite failed. Please try again.");
      }
  };
  
  const handleSectionChange = <K extends 'experience' | 'education' | 'projects' | 'certifications'>(section: K, index: number, field: keyof ResumeData[K][number]) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setData(prev => {
        const newSection = prev[section].map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        return { ...prev, [section]: newSection as any};
    });
  };

  const addSectionItem = (section: 'experience' | 'education' | 'projects' | 'certifications') => {
      const newItem: Experience | Education | Project | Certification = section === 'experience'
          ? { id: crypto.randomUUID(), title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, responsibilities: [''] }
          : section === 'education'
              ? { id: crypto.randomUUID(), degree: '', university: '', location: '', startDate: '', endDate: '', isCurrent: false }
              : section === 'certifications'
              ? { id: crypto.randomUUID(), name: '', provider: '', date: '', link: '' }
              : { id: crypto.randomUUID(), name: '', techStack: [], link: '', description: '' };
      setData(prev => ({ ...prev, [section]: [...prev[section] as any[], newItem] }));
  };

  const removeSectionItem = (section: 'experience' | 'education' | 'projects' | 'certifications' | 'customSections', id: string) => {
      const updatedSection = (data[section] as any[]).filter((item) => item.id !== id);

      if (section === 'customSections') {
        const removedSection = data.customSections.find(cs => cs.id === id);
        if (removedSection) {
            const newOrder = data.sectionOrder.filter(s => s !== removedSection.title.toLowerCase());
             setData(prev => ({ ...prev, customSections: updatedSection, sectionOrder: newOrder }));
             return;
        }
      }
      
      setData(prev => ({ ...prev, [section]: updatedSection as any }));
  };
  
  const handleCustomSectionChange = (id: string, field: 'title' | 'content') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setData(prev => ({
          ...prev,
          customSections: prev.customSections.map(cs => cs.id === id ? { ...cs, [field]: value } : cs)
      }));
  };

  const handleResponsibilitiesChange = (expIndex: number, respIndex: number, value: string) => {
      const updatedExperience = [...data.experience];
      updatedExperience[expIndex].responsibilities[respIndex] = value;
      setData(prev => ({ ...prev, experience: updatedExperience }));
  };
    
  const addResponsibility = (expIndex: number) => {
      const updatedExperience = [...data.experience];
      updatedExperience[expIndex].responsibilities.push('');
      setData(prev => ({ ...prev, experience: updatedExperience }));
  };
    
  const removeResponsibility = (expIndex: number, respIndex: number) => {
      const updatedExperience = [...data.experience];
      updatedExperience[expIndex].responsibilities.splice(respIndex, 1);
      setData(prev => ({ ...prev, experience: updatedExperience }));
  };
    
  const addSkill = () => {
    const newSkill = newSkillInput.trim();
    if (newSkill && !data.skills.includes(newSkill)) {
        setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
        setNewSkillInput('');
    }
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setData(prev => ({...prev, skills: prev.skills.filter(skill => skill !== skillToRemove)}));
  };

  // Helper to auto-resize textareas
  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const renderActiveSection = () => {
      // Ensure we match case-insensitively
      const sectionKey = activeSection ? activeSection.toLowerCase() : '';

      switch(sectionKey) {
        case 'personal info':
            return (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Full Name" value={data.personalInfo.name} onChange={handlePersonalInfoChange('name')} placeholder="John Doe" />
                        <InputField label="Professional Title" value={data.personalInfo.title} onChange={handlePersonalInfoChange('title')} placeholder="Full Stack Developer" />
                        <InputField label="Email Address" value={data.personalInfo.email} onChange={handlePersonalInfoChange('email')} placeholder="johndoe@example.com" />
                        <InputField label="Phone Number" value={data.personalInfo.phone} onChange={handlePersonalInfoChange('phone')} placeholder="+1 (555) 000-0000" />
                        <InputField label="Location" value={data.personalInfo.location} onChange={handlePersonalInfoChange('location')} placeholder="City, Country" />
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold text-zinc-500">Social Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="LinkedIn" value={data.personalInfo.linkedin} onChange={handlePersonalInfoChange('linkedin')} placeholder="linkedin.com/in/..." />
                            <InputField label="GitHub" value={data.personalInfo.github} onChange={handlePersonalInfoChange('github')} placeholder="github.com/..." />
                            <InputField label="Portfolio" value={data.personalInfo.portfolio} onChange={handlePersonalInfoChange('portfolio')} placeholder="yourwebsite.com" />
                        </div>
                    </div>
                </div>
            );
        case 'summary':
            return (
                 <div className="space-y-6 animate-fade-in">
                     <TextAreaWithAI label="Professional Summary" value={data.summary} onChange={handleSummaryChange} onRewrite={handleRewriteSummary} rows={8} />
                 </div>
            );
        case 'experience':
            return (
                <div className="space-y-6 animate-fade-in">
                     <button 
                        onClick={() => addSectionItem('experience')} 
                        className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-zinc-500 hover:text-primary hover:border-zinc-500 hover:bg-surface transition-all flex items-center justify-center gap-2"
                    >
                        <AddIcon className="text-[18px]"/> Add Experience
                    </button>

                    {data.experience.map((exp, index) => (
                        <div key={exp.id} className="p-5 bg-surface border border-border rounded-lg relative group transition-all hover:border-zinc-500">
                             <button 
                                onClick={() => removeSectionItem('experience', exp.id)} 
                                className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                            >
                                <DeleteIcon className="text-[18px]" />
                            </button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <InputField label="Job Title" value={exp.title} onChange={handleSectionChange('experience', index, 'title')} placeholder="Senior Engineer"/>
                                <InputField label="Company" value={exp.company} onChange={handleSectionChange('experience', index, 'company')} placeholder="Acme Inc."/>
                                <InputField label="Location" value={exp.location} onChange={handleSectionChange('experience', index, 'location')} placeholder="Remote / City"/>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Start Date" value={exp.startDate} onChange={handleSectionChange('experience', index, 'startDate')} placeholder="Jan 2020" />
                                    <InputField label="End Date" value={exp.endDate} onChange={handleSectionChange('experience', index, 'endDate')} placeholder="Present" />
                                </div>
                            </div>
                            
                            <div className="bg-input rounded-lg border border-border p-4">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Key Achievements</label>
                                <div className="space-y-2">
                                    {exp.responsibilities.map((resp, rIndex) => (
                                        <div key={rIndex} className="flex gap-3 items-start group/resp animate-fade-in">
                                            <div className="mt-3 w-1.5 h-1.5 rounded-full bg-accent/50 flex-shrink-0"></div>
                                            <div className="flex-grow">
                                                <textarea 
                                                    value={resp} 
                                                    onChange={(e) => {
                                                        handleResponsibilitiesChange(index, rIndex, e.target.value);
                                                        autoResizeTextarea(e);
                                                    }}
                                                    placeholder="Describe an achievement..." 
                                                    rows={1}
                                                    className="w-full bg-transparent border-b border-transparent focus:border-border hover:border-border/50 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none transition-colors resize-none py-2 px-1"
                                                    style={{ minHeight: '38px', overflow: 'hidden' }}
                                                />
                                            </div>
                                            <button 
                                                onClick={() => removeResponsibility(index, rIndex)} 
                                                className="mt-2 p-1 text-zinc-300 hover:text-red-500 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover/resp:opacity-100"
                                                title="Remove point"
                                            >
                                                <CloseIcon className="text-[16px]"/>
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addResponsibility(index)} className="text-xs text-zinc-500 hover:text-accent font-medium mt-2 flex items-center gap-1 py-1.5 px-2 rounded hover:bg-surface transition-colors">
                                        <AddIcon className="text-[14px]"/> Add Bullet Point
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        case 'education':
            return (
                 <div className="space-y-6 animate-fade-in">
                    <button 
                        onClick={() => addSectionItem('education')} 
                        className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-zinc-500 hover:text-primary hover:border-zinc-500 hover:bg-surface transition-all flex items-center justify-center gap-2"
                    >
                        <AddIcon className="text-[18px]"/> Add Education
                    </button>
                    {data.education.map((edu, index) => (
                        <div key={edu.id} className="p-5 bg-surface border border-border rounded-lg relative group hover:border-zinc-500">
                             <button 
                                onClick={() => removeSectionItem('education', edu.id)} 
                                className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <DeleteIcon className="text-[18px]" />
                            </button>
                            <div className="space-y-4">
                                <InputField label="Degree / Major" value={edu.degree} onChange={handleSectionChange('education', index, 'degree')} placeholder="BS Computer Science" />
                                <InputField label="University / School" value={edu.university} onChange={handleSectionChange('education', index, 'university')} placeholder="University of Technology" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Location" value={edu.location} onChange={handleSectionChange('education', index, 'location')} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Start" value={edu.startDate} onChange={handleSectionChange('education', index, 'startDate')} />
                                        <InputField label="End" value={edu.endDate} onChange={handleSectionChange('education', index, 'endDate')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        case 'projects':
            return (
                 <div className="space-y-6 animate-fade-in">
                    <button 
                        onClick={() => addSectionItem('projects')} 
                        className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-zinc-500 hover:text-primary hover:border-zinc-500 hover:bg-surface transition-all flex items-center justify-center gap-2"
                    >
                        <AddIcon className="text-[18px]"/> Add Project
                    </button>
                    {data.projects.map((proj, index) => (
                        <div key={proj.id} className="p-5 bg-surface border border-border rounded-lg relative group hover:border-zinc-500">
                            <button onClick={() => removeSectionItem('projects', proj.id)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><DeleteIcon className="text-[18px]"/></button>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Project Name" value={proj.name} onChange={handleSectionChange('projects', index, 'name')} />
                                    <InputField label="Link" value={proj.link} onChange={handleSectionChange('projects', index, 'link')} />
                                </div>
                                <InputField label="Tech Stack (Comma separated)" value={proj.techStack.join(', ')} onChange={(e) => {
                                    const newStack = e.target.value.split(',').map(s => s.trim());
                                    setData(prev => ({...prev, projects: prev.projects.map((p, i) => i === index ? {...p, techStack: newStack} : p)}))
                                }} />
                                <TextAreaWithAI label="Description" value={proj.description} onChange={(e) => handleSectionChange('projects', index, 'description')(e)} onRewrite={async () => {
                                    const rewritten = await rewriteText(proj.description, 'project description');
                                    setData(prev => ({...prev, projects: prev.projects.map((p, i) => i === index ? {...p, description: rewritten} : p)}))
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            )
        case 'skills':
             return (
               <div className="space-y-6 animate-fade-in">
                <div className="bg-surface p-6 border border-border rounded-lg">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <InputField 
                                label="Add new skill" 
                                value={newSkillInput} 
                                onChange={(e) => setNewSkillInput(e.target.value)} 
                                onKeyDown={handleSkillsKeyDown} 
                                placeholder="Type skill..." 
                            />
                        </div>
                        <button 
                            onClick={addSkill}
                            disabled={!newSkillInput.trim()}
                            className="bg-primary text-background px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
                        >
                            Add
                        </button>
                    </div>
                    
                    <div className="mt-8">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Current Skills</label>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="flex items-center gap-1.5 bg-input border border-border text-zinc-900 dark:text-zinc-100 text-xs font-medium pl-3 pr-2 py-1.5 rounded-full hover:border-zinc-400 transition-colors shadow-sm group">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="text-zinc-400 hover:text-red-500 flex items-center justify-center w-4 h-4 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">
                                       <CloseIcon className="text-[14px]" />
                                    </button>
                                </span>
                            ))}
                            {data.skills.length === 0 && <span className="text-xs text-zinc-400 italic">No skills added yet.</span>}
                        </div>
                    </div>
                </div>
               </div>
            );
        case 'certifications':
             return (
                 <div className="space-y-6 animate-fade-in">
                    <button 
                        onClick={() => addSectionItem('certifications')} 
                         className="w-full py-3 border border-dashed border-border rounded-lg text-sm text-zinc-500 hover:text-primary hover:border-zinc-500 hover:bg-surface transition-all flex items-center justify-center gap-2"
                    >
                        <AddIcon className="text-[18px]"/> Add Certification
                    </button>
                    {data.certifications.map((cert, index) => (
                        <div key={cert.id} className="p-5 bg-surface border border-border rounded-lg relative group hover:border-zinc-500">
                             <button onClick={() => removeSectionItem('certifications', cert.id)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><DeleteIcon className="text-[18px]"/></button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Name" value={cert.name} onChange={handleSectionChange('certifications', index, 'name')} />
                                <InputField label="Provider" value={cert.provider} onChange={handleSectionChange('certifications', index, 'provider')} />
                                <InputField label="Date" value={cert.date} onChange={handleSectionChange('certifications', index, 'date')} />
                                <InputField label="Link" value={cert.link || ''} onChange={handleSectionChange('certifications', index, 'link')} />
                            </div>
                        </div>
                    ))}
                </div>
            );
        default:
            const customSection = data.customSections.find(cs => cs.title.toLowerCase() === sectionKey);
            if (!customSection) return (
                <div className="text-zinc-500 p-8 text-center bg-surface border border-border rounded-lg border-dashed">
                    Select a section to start editing or click "Add Section" to create a new one.
                </div>
            );
            
            return (
                 <div className="space-y-6 animate-fade-in" key={customSection.id}>
                    <div className="flex justify-between items-center pb-4 border-b border-border">
                         <div className="w-full">
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Section Title</label>
                            <input 
                                type="text" 
                                value={customSection.title}
                                onChange={handleCustomSectionChange(customSection.id, 'title')}
                                className="w-full bg-transparent text-xl font-semibold text-primary focus:outline-none placeholder-zinc-500"
                             />
                        </div>
                         <button onClick={() => removeSectionItem('customSections', customSection.id)} className="text-zinc-400 hover:text-red-500 p-2"><DeleteIcon className="text-[20px]"/></button>
                    </div>
                    <TextAreaWithAI
                        label="Content"
                        value={customSection.content}
                        onChange={(e) => handleCustomSectionChange(customSection.id, 'content')(e)}
                        onRewrite={async () => {
                             const rewritten = await rewriteText(customSection.content, 'custom section');
                             setData(prev => ({...prev, customSections: prev.customSections.map(cs => cs.id === customSection.id ? {...cs, content: rewritten} : cs)}));
                        }}
                        rows={12}
                    />
                </div>
            )
      }
  }

  return (
    <div className="min-h-full pb-10">
        {renderActiveSection()}
    </div>
  );
};

export default ResumeEditor;