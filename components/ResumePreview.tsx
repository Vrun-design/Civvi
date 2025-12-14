import React from 'react';
import { ResumeData, Template } from '../types';
import TemplateA from './templates/TemplateA';
import TemplateB from './templates/TemplateB';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: Template;
  innerRef: React.RefObject<HTMLDivElement | null>;
  fontFamily: string;
  accentColor: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, template, innerRef, fontFamily, accentColor }) => {
  return (
    <div className="relative shadow-2xl transition-all duration-300 ease-in-out">
      <div
        id="resume-preview-content"
        ref={innerRef}
        className="bg-white text-black box-border relative"
        style={{
          fontFamily,
          width: '210mm',
          minHeight: '297mm',
          padding: '0',
          margin: '0',
          transform: 'scale(0.65)',
          transformOrigin: 'top center',
        }}
      >
        {/* Visual Page Break Marker for Page 1/2 Boundary (approximate visual aid) */}
        <div className="absolute left-0 w-full border-b border-dashed border-red-300 pointer-events-none page-break-marker flex items-end justify-end pr-2" style={{ top: '296mm' }}>
          <span className="text-[10px] text-red-300 font-mono bg-white px-1">Page Break</span>
        </div>
        <div className="absolute left-0 w-full border-b border-dashed border-red-300 pointer-events-none page-break-marker flex items-end justify-end pr-2" style={{ top: '593mm' }}>
          <span className="text-[10px] text-red-300 font-mono bg-white px-1">Page Break</span>
        </div>

        {template === 'TemplateA' && <TemplateA resumeData={resumeData} accentColor={accentColor} />}
        {template === 'TemplateB' && <TemplateB resumeData={resumeData} accentColor={accentColor} />}
      </div>

      <style>{`
@media(max-width: 1280px) {
  #resume-preview-content {
    transform: scale(0.5)!important;
  }
}
@media(max-width: 1024px) {
  #resume-preview-content {
    transform: scale(0.4)!important;
  }
}
`}</style>
    </div>
  );
};

export default ResumePreview;