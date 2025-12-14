
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  techStack: string[];
  link: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  date: string;
  link?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export type Section = 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications';

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  customSections: CustomSection[];
  sectionOrder: string[];
}

export type Template = 'TemplateA' | 'TemplateB';

export interface AtsAnalysis {
  score: number;
  missingKeywords: string[];
  summarySuggestions: string;
  experienceSuggestions: {
    experienceId: string;
    suggestions: string[];
  }[];
  weakPhrases: string[];
}
