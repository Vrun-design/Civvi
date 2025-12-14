import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AtsAnalysis, ResumeData, CustomSection, Experience, Education, Project, Certification } from "../types";

// Helper to get API key from env or local storage
const getApiKey = (): string => {
    const envKey = process.env.API_KEY;
    if (envKey) return envKey;

    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey) return localKey;

    throw new Error("API_KEY_MISSING");
};

// Helper to check if API key exists (for UI)
export const hasApiKey = (): boolean => {
    try {
        getApiKey();
        return true;
    } catch {
        return false;
    }
};

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                portfolio: { type: Type.STRING },
            },
        },
        summary: { type: Type.STRING },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    isCurrent: { type: Type.BOOLEAN },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
            },
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    degree: { type: Type.STRING },
                    university: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                },
            },
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                    link: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
            },
        },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        certifications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    provider: { type: Type.STRING },
                    date: { type: Type.STRING },
                    link: { type: Type.STRING },
                },
            },
        },
        customSections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The title of the custom section (e.g., 'Publications', 'Volunteering')." },
                    content: { type: Type.STRING, description: "The content of the custom section, formatted as a single string with newlines for bullet points (e.g., '- Point one.\\n- Point two.')." }
                }
            }
        },
    },
};

const processParsedResumeData = (parsedData: any): Partial<ResumeData> => {
    // Add IDs to array items
    if (parsedData.experience) parsedData.experience.forEach((e: Experience) => e.id = crypto.randomUUID());
    if (parsedData.education) parsedData.education.forEach((e: Education) => e.id = crypto.randomUUID());
    if (parsedData.projects) parsedData.projects.forEach((e: Project) => e.id = crypto.randomUUID());
    if (parsedData.certifications) parsedData.certifications.forEach((c: Certification) => c.id = crypto.randomUUID());
    if (parsedData.customSections) parsedData.customSections.forEach((cs: CustomSection) => cs.id = crypto.randomUUID());

    // Infer section order if not explicitly provided
    const sectionOrder: string[] = [];
    if (parsedData.summary) sectionOrder.push('summary');
    if (parsedData.experience?.length) sectionOrder.push('experience');
    if (parsedData.education?.length) sectionOrder.push('education');
    if (parsedData.projects?.length) sectionOrder.push('projects');
    if (parsedData.skills?.length) sectionOrder.push('skills');
    if (parsedData.certifications?.length) sectionOrder.push('certifications');
    if (parsedData.customSections?.length) {
        parsedData.customSections.forEach((cs: CustomSection) => sectionOrder.push(cs.title.toLowerCase()));
    }
    parsedData.sectionOrder = sectionOrder;

    return parsedData;
};


export const parseResumeFromFile = async (base64File: string, mimeType: string): Promise<Partial<ResumeData>> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64File,
                        },
                    },
                    {
                        text: "Parse the resume from this file. Extract all standard sections and any custom sections like 'Publications' or 'Volunteering'. Structure custom sections with a title and content. If a standard field is not present, omit it from the JSON. For dates, use formats like 'Month YYYY'.",
                    },
                ],
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: resumeSchema
            },
        });

        const jsonString = (response.text || "").trim() || "{}";
        const parsedData = JSON.parse(jsonString) as Partial<ResumeData>;

        return processParsedResumeData(parsedData);
    } catch (error) {
        console.error("Error parsing resume from file:", error);
        throw new Error("Failed to parse resume. The file might be in an unsupported format or corrupted.");
    }
};

export const parseResumeFromText = async (resumeHtml: string): Promise<Partial<ResumeData>> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `Parse the resume from this HTML content. Extract all standard sections and any custom sections like 'Publications' or 'Volunteering'. Structure custom sections with a title and content. If a standard field is not present, omit it from the JSON. For dates, use formats like 'Month YYYY'.\n\nHTML Content:\n${resumeHtml}`;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: resumeSchema
            },
        });

        const jsonString = (response.text || "").trim() || "{}";
        const parsedData = JSON.parse(jsonString) as Partial<ResumeData>;

        return processParsedResumeData(parsedData);

    } catch (error) {
        console.error("Error parsing resume from text:", error);
        throw new Error("Failed to parse resume from the document content.");
    }
};

const atsAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "ATS match score from 0-100" },
        missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key skills and keywords from the JD missing in the resume." },
        summarySuggestions: { type: Type.STRING, description: "A rewritten, optimized summary tailored to the job description." },
        experienceSuggestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    experienceId: { type: Type.STRING, description: "The ID of the experience entry." },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific, rewritten bullet points for this experience." }
                }
            },
        },
        weakPhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of weak phrases found in the resume." },
    }
};

export const analyzeWithATS = async (resumeData: ResumeData, jobDescription: string): Promise<AtsAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `You are an expert ATS (Applicant Tracking System) and professional resume writer. Analyze this resume (JSON format): ${JSON.stringify(resumeData)} against this job description: ${jobDescription}. Provide a detailed analysis. The experience IDs are crucial for mapping suggestions back to the resume. Return the result as a JSON object.`;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: atsAnalysisSchema
            },
        });
        const jsonString = (response.text || "").trim() || "{}";
        return JSON.parse(jsonString) as AtsAnalysis;
    } catch (error) {
        console.error("Error analyzing with ATS:", error);
        throw new Error("Failed to analyze resume. Please try again.");
    }
};


export const rewriteText = async (text: string, context: 'summary' | 'bullet point' | 'project description' | 'custom section', jobDescription?: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = `You are a professional resume writer. Rewrite this resume ${context}: "${text}" to be more concise, professional, and impactful, using action verbs. ${jobDescription ? `Tailor it to this job description: ${jobDescription}` : ''}. Return only the rewritten text, without any additional formatting or intro.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return (response.text || "").trim() || text;
    } catch (error) {
        console.error("Error rewriting text:", error);
        throw new Error("Failed to rewrite text. Please try again.");
    }
};