import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

// Register fonts (optional - can use built-in fonts)
// Note: react-pdf has built-in support for Helvetica, Times-Roman, and Courier

interface PDFTemplateProps {
    resumeData: ResumeData;
    accentColor: string;
    fontFamily: string;
}

const styles = (accentColor: string, fontFamily: string) => StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: fontFamily,
        lineHeight: 1.4,
    },
    // Header styles
    headerCenter: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 24,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: accentColor,
        marginBottom: 24,
    },
    title: {
        fontSize: 16,
        color: '#3c3c3c',
        marginBottom: 8,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 9,
        color: '#646464',
    },
    contactItem: {
        marginHorizontal: 4,
    },
    // Section styles
    section: {
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        borderBottomWidth: 0.5,
        borderBottomColor: '#cccccc',
        paddingBottom: 2,
        marginBottom: 6,
    },
    // Experience styles
    expItem: {
        marginBottom: 8,
    },
    expTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    expCompany: {
        fontSize: 9,
        fontWeight: 'bold',
        color: accentColor,
    },
    expMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9,
        color: '#646464',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    bulletList: {
        marginLeft: 12,
    },
    bullet: {
        fontSize: 8.5,
        color: '#484848',
        marginBottom: 3,
        flexDirection: 'row',
    },
    bulletPoint: {
        width: 8,
    },
    bulletText: {
        flex: 1,
    },
    // Skills styles
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        backgroundColor: 'rgb(243, 244, 246)',
        color: accentColor,
        fontSize: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        lineHeight: 1.2,
    },
    // Project styles
    projectItem: {
        marginBottom: 8,
    },
    projectTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    projectTech: {
        fontSize: 8.5,
        color: '#646464',
        marginBottom: 2,
    },
    projectDesc: {
        fontSize: 8.5,
        color: '#484848',
    },
    // Education styles
    eduItem: {
        marginBottom: 6,
    },
    eduDegree: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    eduUniv: {
        fontSize: 9,
        fontWeight: 'bold',
        color: accentColor,
    },
    eduMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9,
        color: '#646464',
        fontStyle: 'italic',
    },
    // Certification styles
    certItem: {
        marginBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    certName: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    certProvider: {
        fontSize: 8.5,
        color: '#505050',
    },
    certDate: {
        fontSize: 8.5,
        color: '#646464',
        fontStyle: 'italic',
    },
});

export const PDFTemplateA = ({ resumeData, accentColor, fontFamily }: PDFTemplateProps) => {
    const s = styles(accentColor, fontFamily);
    const { personalInfo, summary, experience, education, projects, skills, certifications, customSections, sectionOrder } = resumeData;

    const renderSection = (sectionKey: string) => {
        switch (sectionKey) {
            case 'summary':
                return summary && (
                    <View style={s.section} key="summary">
                        <Text style={s.sectionHeader}>SUMMARY</Text>
                        <Text style={{ fontSize: 9, color: '#444444' }}>{summary}</Text>
                    </View>
                );

            case 'experience':
                return experience?.length > 0 && (
                    <View style={s.section} key="experience">
                        <Text style={s.sectionHeader}>EXPERIENCE</Text>
                        {experience.map((exp, idx) => (
                            <View style={s.expItem} key={idx}>
                                <Text style={s.expTitle}>{exp.title}</Text>
                                <Text style={s.expCompany}>{exp.company}</Text>
                                <View style={s.expMeta}>
                                    <Text>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</Text>
                                    <Text>{exp.location}</Text>
                                </View>
                                <View style={s.bulletList}>
                                    {exp.responsibilities.map((resp, i) => (
                                        <View style={s.bullet} key={i}>
                                            <Text style={s.bulletPoint}>• </Text>
                                            <Text style={s.bulletText}>{resp}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                );

            case 'education':
                return education?.length > 0 && (
                    <View style={s.section} key="education">
                        <Text style={s.sectionHeader}>EDUCATION</Text>
                        {education.map((edu, idx) => (
                            <View style={s.eduItem} key={idx}>
                                <Text style={s.eduDegree}>{edu.degree}</Text>
                                <Text style={s.eduUniv}>{edu.university}</Text>
                                <View style={s.eduMeta}>
                                    <Text>{edu.startDate} – {edu.endDate}</Text>
                                    <Text>{edu.location}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                );

            case 'skills':
                return skills?.length > 0 && (
                    <View style={s.section} key="skills">
                        <Text style={s.sectionHeader}>SKILLS</Text>
                        <View style={s.skillsContainer}>
                            {skills.map((skill, idx) => (
                                <Text style={s.skillBadge} key={idx}>{skill}</Text>
                            ))}
                        </View>
                    </View>
                );

            case 'projects':
                return projects?.length > 0 && (
                    <View style={s.section} key="projects">
                        <Text style={s.sectionHeader}>PROJECTS</Text>
                        {projects.map((proj, idx) => (
                            <View style={s.projectItem} key={idx}>
                                <Text style={s.projectTitle}>{proj.name}</Text>
                                {proj.techStack?.length > 0 && (
                                    <Text style={s.projectTech}>Tech: {proj.techStack.join(', ')}</Text>
                                )}
                                <Text style={s.projectDesc}>{proj.description}</Text>
                            </View>
                        ))}
                    </View>
                );

            case 'certifications':
                return certifications?.length > 0 && (
                    <View style={s.section} key="certifications">
                        <Text style={s.sectionHeader}>CERTIFICATIONS</Text>
                        {certifications.map((cert, idx) => (
                            <View key={idx}>
                                <View style={s.certItem}>
                                    <View>
                                        <Text style={s.certName}>{cert.name}</Text>
                                        <Text style={s.certProvider}>{cert.provider}</Text>
                                    </View>
                                    <Text style={s.certDate}>{cert.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                );

            default:
                const customSection = customSections.find(cs => cs.title.toLowerCase() === sectionKey);
                return customSection && (
                    <View style={s.section} key={customSection.id}>
                        <Text style={s.sectionHeader}>{customSection.title.toUpperCase()}</Text>
                        <Text style={{ fontSize: 9, color: '#444444' }}>{customSection.content}</Text>
                    </View>
                );
        }
    };

    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Centered Header */}
                <View style={s.headerCenter}>
                    <Text style={s.name}>{personalInfo.name}</Text>
                    <Text style={s.title}>{personalInfo.title}</Text>
                    <View style={s.contactRow}>
                        {personalInfo.email && <Link style={s.contactItem} src={`mailto:${personalInfo.email} `}>{personalInfo.email}</Link>}
                        {personalInfo.phone && <Text style={s.contactItem}>{personalInfo.phone}</Text>}
                        {personalInfo.location && <Text style={s.contactItem}>{personalInfo.location}</Text>}
                        {personalInfo.linkedin && <Link style={s.contactItem} src={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`}>LinkedIn</Link>}
                        {personalInfo.portfolio && <Link style={s.contactItem} src={`https://${personalInfo.portfolio.replace(/^https?:\/\//, '')}`}>Portfolio</Link>}
                    </View >
                </View >

                {/* Sections */}
                {sectionOrder.map(section => renderSection(section))}
            </Page >
        </Document >
    );
};

export default PDFTemplateA;
