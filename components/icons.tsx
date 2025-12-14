import React from 'react';

type IconProps = {
  className?: string;
  style?: React.CSSProperties;
};

// Helper to merge classes
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

export const MailIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>mail</span>
);

export const PhoneIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>call</span>
);

// Generic symbol for UI
export const LinkedinIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>post_add</span>
);

// Brand SVG for Resume Template (PDF)
export const LinkedinBrandIcon = ({ className, style }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
    style={style}
  >
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.6.6 0 00.08.35V19h-3v-9h3v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 4.5z" />
  </svg>
);

// Generic code icon for UI
export const CodeIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>code</span>
);

export const LinkIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>link</span>
);

export const LocationIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>location_on</span>
);

export const SparklesIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={{ ...style, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
);

export const SettingsIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>tune</span>
);

export const DownloadIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>download</span>
);

export const EyeIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>visibility</span>
);

export const ArrowLeftIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>arrow_back</span>
);

export const ArrowRightIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>arrow_forward</span>
);

export const UploadIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>upload_file</span>
);

export const DragIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>drag_indicator</span>
);

export const CloseIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>close</span>
);

export const AddIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>add</span>
);

export const EditIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>edit</span>
);

export const DeleteIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>delete</span>
);

export const RobotIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>smart_toy</span>
);

export const SunIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>light_mode</span>
);

export const MoonIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>dark_mode</span>
);

export const CheckIcon = ({ className, style }: IconProps) => (
  <span className={cn("material-symbols-rounded", className)} style={style}>check</span>
);

export const LogoIcon = ({ className, style }: IconProps) => (
  <span
    className={cn("material-symbols-rounded", className)}
    style={{ ...style, fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}
  >
    robot_2
  </span>
);

// Brand SVG for Resume Template (PDF)
export const GithubBrandIcon = ({ className, style }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
    style={style}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-1.55 1.02-2.53-.15-.22-.44-1.08.1-2.45 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.23.1 2.45.64.98 1.02 1.42 1.02 2.53 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
  </svg>
);