import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

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
    headerLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 24,
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'normal',
        color: accentColor,
        marginBottom: 12,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        fontSize: 9,
        color: '#646464',
        fontWeight: 'normal',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#1a1a1a',
        paddingBottom: 2,
        marginBottom: 8,
        color: '#1a1a1a',
    },
    expItem: {
        marginBottom: 10,
    },
    expTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#1a1a1a',
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
        marginBottom: 4,
    },
    bulletList: {
        marginLeft: 12,
    },
    bullet: {
        fontSize: 9,
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
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        backgroundColor: '#f4f4f5',
        color: '#3f3f46',
        fontSize: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 2,
        borderLeftWidth: 2,
        borderLeftColor: accentColor,
        lineHeight: 1.2,
    },
    projectItem: {
        marginBottom: 8,
    },
    projectTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#1a1a1a',
    },
    projectTech: {
        fontSize: 9,
        color: '#646464',
        marginBottom: 2,
    },
    projectDesc: {
        fontSize: 9,
        color: '#484848',
    },
    eduItem: {
        marginBottom: 8,
    },
    eduDegree: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#1a1a1a',
    },
    eduUniv: {
        fontSize: 9,
        fontWeight: 'normal',
        color: accentColor,
    },
    eduMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9,
        color: '#646464',
    },
    certItem: {
        marginBottom: 6,
    },
    certName: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    certProvider: {
        fontSize: 9,
        color: '#646464',
    },
});

export const PDFTemplateB = ({ resumeData, accentColor, fontFamily }: PDFTemplateProps) => {
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
                                    <Text style={s.projectTech}>{proj.techStack.join(' • ')}</Text>
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
                            <View style={s.certItem} key={idx}>
                                <Text style={s.certName}>{cert.name}</Text>
                                <Text style={s.certProvider}>{cert.provider} • {cert.date}</Text>
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
                <View style={s.headerLeft}>
                    <Text style={s.name}>{personalInfo.name}</Text>
                    <Text style={s.title}>{personalInfo.title}</Text>
                    <View style={s.contactRow}>
                        {personalInfo.email && <Link style={s.contactItem} src={`mailto:${personalInfo.email}`}>{personalInfo.email}</Link>}
                        {personalInfo.phone && <Text style={s.contactItem}>{personalInfo.phone}</Text>}
                        {personalInfo.location && <Text style={s.contactItem}>{personalInfo.location}</Text>}
                        {personalInfo.linkedin && <Link style={s.contactItem} src={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`}>LinkedIn</Link>}
                        {personalInfo.portfolio && <Link style={s.contactItem} src={`https://${personalInfo.portfolio.replace(/^https?:\/\//, '')}`}>Portfolio</Link>}
                        {personalInfo.github && <Link style={s.contactItem} src={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`}>GitHub</Link>}
                    </View>
                </View>
                {sectionOrder.map(section => renderSection(section))}
            </Page>
        </Document>
    );
};

export default PDFTemplateB;
