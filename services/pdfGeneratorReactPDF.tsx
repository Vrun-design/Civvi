import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumeData, Template } from '../types';
import PDFTemplateA from './pdf/PDFTemplateA';
import PDFTemplateB from './pdf/PDFTemplateB';

interface PDFStyles {
    accentColor: string;
    fontFamily: string;
}

export const generatePDF = async (resumeData: ResumeData, template: Template, styles: PDFStyles) => {
    // Map HTML font family to PDF font name
    const pdfFontFamily = styles.fontFamily.includes('Times') ? 'Times-Roman' : 'Helvetica';

    // Select the correct template based on the template parameter
    const TemplateComponent = template === 'TemplateB' ? PDFTemplateB : PDFTemplateA;

    // Generate PDF blob
    const blob = await pdf(<TemplateComponent resumeData={resumeData} accentColor={styles.accentColor} fontFamily={pdfFontFamily} />).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
};
