import React from 'react';
import { ResumeData } from '../../types';
import { MailIcon, PhoneIcon, LinkedinBrandIcon, GithubBrandIcon, LinkIcon, LocationIcon } from '../icons';

const TemplateA: React.FC<{ resumeData: ResumeData; accentColor: string }> = ({ resumeData, accentColor }) => {
    const { personalInfo, summary, experience, education, projects, skills, certifications, customSections, sectionOrder } = resumeData;

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return summary && (
                    <div key="summary" className="mb-6 section-item">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-3 pb-1" style={{ color: '#000' }}>Summary</h2>
                        <p className="text-xs leading-relaxed text-gray-700">{summary}</p>
                    </div>
                );
            case 'experience':
                return experience?.length > 0 && (
                    <div key="experience" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1" style={{ color: '#000' }}>Experience</h2>
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-4 section-item">
                                <h3 className="text-sm font-bold text-gray-900">{exp.title}</h3>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-semibold" style={{ color: accentColor }}>{exp.company}</span>
                                    <div className="text-xs text-gray-500 italic flex gap-4">
                                        <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                                        <span>{exp.location}</span>
                                    </div>
                                </div>
                                <ul className="list-disc list-outside text-xs ml-4 space-y-1 text-gray-700 marker:text-gray-400">
                                    {exp.responsibilities.map((resp, i) => <li key={i} className="leading-relaxed pl-1">{resp}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            case 'education':
                return education?.length > 0 && (
                    <div key="education" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1" style={{ color: '#000' }}>Education</h2>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-3 section-item">
                                <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-semibold" style={{ color: accentColor }}>{edu.university}</span>
                                    <div className="text-xs text-gray-500 italic flex gap-4">
                                        <span>{edu.startDate} – {edu.endDate}</span>
                                        <span>{edu.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                return projects?.length > 0 && (
                    <div key="projects" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1" style={{ color: '#000' }}>Projects</h2>
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-4 section-item">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                                    {proj.link && (
                                        <a href={`https://${proj.link.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline flex items-center gap-1" style={{ color: accentColor }}>
                                            <LinkIcon className="text-[10px]" /> Link
                                        </a>
                                    )}
                                </div>
                                {proj.techStack?.length > 0 && (
                                    <div className="mb-1">
                                        <span className="text-xs font-semibold text-gray-700">Tech: </span>
                                        <span className="text-xs text-gray-600 italic">{proj.techStack.join(', ')}</span>
                                    </div>
                                )}
                                <p className="text-xs leading-relaxed text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return skills?.length > 0 && (
                    <div key="skills" className="mb-6 section-item">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1" style={{ color: '#000' }}>Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="text-xs font-medium px-3 py-1.5 rounded-md" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            case 'certifications':
                return certifications?.length > 0 && (
                    <div key="certifications" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1" style={{ color: '#000' }}>Certifications</h2>
                        {certifications.map(cert => (
                            <div key={cert.id} className="mb-2 flex justify-between items-baseline section-item">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">{cert.name}</span>
                                    <span className="text-xs text-gray-600">{cert.provider}</span>
                                </div>
                                <span className="text-xs text-gray-500 italic">{cert.date}</span>
                            </div>
                        ))}
                    </div>
                );
            default:
                const customSection = customSections.find(cs => cs.title.toLowerCase() === section.toLowerCase());
                if (!customSection) return null;
                return (
                    <div key={customSection.id} className="mb-6 section-item">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-1" style={{ color: '#000' }}>{customSection.title}</h2>
                        <div className="text-xs leading-relaxed whitespace-pre-wrap text-gray-700">
                            {customSection.content}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="p-8 bg-white text-black h-full">
            {/* Centered Header */}
            <div className="flex flex-col items-center text-center mb-8 section-item">
                <h1 className="text-4xl font-bold mb-3 block" style={{ color: accentColor }}>{personalInfo.name}</h1>
                <p className="text-lg font-medium text-gray-800 mb-3 block">{personalInfo.title}</p>

                <div className="flex justify-center items-center gap-4 flex-wrap text-xs text-gray-600">
                    {personalInfo.email && (
                        <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:text-black transition-colors">
                            <span style={{ color: accentColor }}>@</span> {personalInfo.email}
                        </a>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-1">
                            <PhoneIcon className="text-[12px]" style={{ color: accentColor }} /> {personalInfo.phone}
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-black transition-colors">
                            <LinkedinBrandIcon className="text-[12px] w-3 h-3" style={{ color: accentColor }} /> LinkedIn
                        </a>
                    )}
                    {personalInfo.github && (
                        <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-black transition-colors">
                            <GithubBrandIcon className="text-[12px] w-3 h-3" style={{ color: accentColor }} /> GitHub
                        </a>
                    )}
                    {personalInfo.portfolio && (
                        <a href={`https://${personalInfo.portfolio.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-black transition-colors">
                            <LinkIcon className="text-[12px]" style={{ color: accentColor }} /> Portfolio
                        </a>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-1">
                            <LocationIcon className="text-[12px]" style={{ color: accentColor }} /> {personalInfo.location}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                {sectionOrder.map(section => renderSection(section))}
            </div>
        </div>
    );
};

export default TemplateA;