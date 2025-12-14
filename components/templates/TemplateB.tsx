import React from 'react';
import { ResumeData } from '../../types';
import { MailIcon, PhoneIcon, LinkedinBrandIcon, GithubBrandIcon, LinkIcon, LocationIcon } from '../icons';

const TemplateB: React.FC<{ resumeData: ResumeData; accentColor: string }> = ({ resumeData, accentColor }) => {
    const { personalInfo, summary, experience, education, projects, skills, certifications, customSections, sectionOrder } = resumeData;

    const renderSection = (section: string) => {
        switch (section) {
            case 'summary':
                return summary && (
                    <div key="summary" className="mb-6 section-item">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-800 mb-3 pb-1 text-gray-900">Summary</h2>
                        <p className="text-xs leading-relaxed text-gray-700">{summary}</p>
                    </div>
                );
            case 'experience':
                return experience?.length > 0 && (
                    <div key="experience" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-800 mb-4 pb-1 text-gray-900">Experience</h2>
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-5 section-item">
                                <h3 className="text-sm font-bold text-gray-900">{exp.title}</h3>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-semibold" style={{ color: accentColor }}>{exp.company}</span>
                                    <div className="text-xs text-gray-500 flex gap-4">
                                        <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                                        <span className="flex items-center gap-1"><LocationIcon className="text-[10px]" />{exp.location}</span>
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
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-800 mb-4 pb-1 text-gray-900">Education</h2>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-4 section-item">
                                <h3 className="text-sm font-bold text-gray-900 mb-0.5">{edu.degree}</h3>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-medium" style={{ color: accentColor }}>{edu.university}</span>
                                    <div className="text-xs text-gray-500 flex gap-4">
                                        <span>{edu.startDate} – {edu.endDate}</span>
                                        <span className="flex items-center gap-1"><LocationIcon className="text-[10px]" />{edu.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                return projects?.length > 0 && (
                    <div key="projects" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-800 mb-4 pb-1 text-gray-900">Projects</h2>
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-4 section-item">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                                    {proj.link && (
                                        <a href={`https://${proj.link.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline flex items-center gap-0.5" style={{ color: accentColor }}>
                                            <LinkIcon className="text-[10px]" />
                                        </a>
                                    )}
                                </div>
                                {proj.techStack?.length > 0 && <p className="text-xs font-medium text-gray-500 mb-1">{proj.techStack.join(' • ')}</p>}
                                <p className="text-xs leading-relaxed text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return skills?.length > 0 && (
                    <div key="skills" className="mb-6 section-item">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-800 mb-4 pb-1 text-gray-900">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="text-xs font-medium px-3 py-1 rounded-sm bg-gray-100 text-gray-700 border-l-2" style={{ borderLeftColor: accentColor }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            case 'certifications':
                return certifications?.length > 0 && (
                    <div key="certifications" className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-800 mb-4 pb-1 text-gray-900">Certifications</h2>
                        {certifications.map(cert => (
                            <div key={cert.id} className="mb-3 section-item">
                                <h3 className="text-xs font-bold text-gray-900">{cert.name}</h3>
                                <p className="text-xs text-gray-600">{cert.provider} • <span className="text-gray-400">{cert.date}</span></p>
                            </div>
                        ))}
                    </div>
                );
            default:
                const customSection = customSections.find(cs => cs.title.toLowerCase() === section.toLowerCase());
                if (!customSection) return null;
                return (
                    <div key={customSection.id} className="mb-6 section-item">
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-800 mb-4 pb-1 text-gray-900">{customSection.title}</h2>
                        <div className="text-xs leading-relaxed whitespace-pre-wrap text-gray-700">
                            {customSection.content}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="p-8 bg-white text-black h-full">
            {/* Left Aligned Header */}
            <div className="text-left mb-8 section-item">
                <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-gray-900 block">{personalInfo.name}</h1>
                <p className="text-xl font-medium mb-4 block" style={{ color: accentColor }}>{personalInfo.title}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-gray-600">
                    {personalInfo.email && (
                        <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-black transition-colors">
                            <MailIcon className="text-[14px]" style={{ color: accentColor }} /> {personalInfo.email}
                        </a>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-1.5">
                            <PhoneIcon className="text-[14px]" style={{ color: accentColor }} /> {personalInfo.phone}
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-1.5">
                            <LocationIcon className="text-[14px]" style={{ color: accentColor }} /> {personalInfo.location}
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black transition-colors">
                            <LinkedinBrandIcon className="text-[14px] w-3.5 h-3.5" style={{ color: accentColor }} /> LinkedIn
                        </a>
                    )}
                    {personalInfo.portfolio && (
                        <a href={`https://${personalInfo.portfolio.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black transition-colors">
                            <LinkIcon className="text-[14px]" style={{ color: accentColor }} /> Portfolio
                        </a>
                    )}
                    {personalInfo.github && (
                        <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black transition-colors">
                            <GithubBrandIcon className="text-[14px] w-3.5 h-3.5" style={{ color: accentColor }} /> GitHub
                        </a>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                {sectionOrder.map(section => renderSection(section))}
            </div>
        </div>
    );
};

export default TemplateB;