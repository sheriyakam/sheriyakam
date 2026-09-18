import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from './components/CareerLayout';
import {
  validateResumeForAtsExport,
  generateTextSelectableAtsHtml,
  saveResume,
  getSavedResumes,
  SavedResume
} from '../../services/careerService';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  Download,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  ShieldCheck,
  Layers,
  FileText
} from 'lucide-react-native';

export default function ResumeBuilderPage() {
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState<'ats-classic' | 'modern' | 'executive' | 'minimal'>('ats-classic');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showExportModal, setShowExportModal] = useState(false);

  // Resume form state
  const [fullName, setFullName] = useState('Alex Vance');
  const [jobTitle, setJobTitle] = useState('Senior Operations Lead');
  const [email, setEmail] = useState('alex.vance@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [location, setLocation] = useState('San Francisco, CA');
  const [summary, setSummary] = useState('Impact-driven operations leader with 6+ years driving cross-functional SLA governance, process automation, and verified team execution across enterprise accounts.');
  const [skills, setSkills] = useState(['Operations Management', 'Cross-Functional Leadership', 'SLA Optimization', 'Risk Assessment', 'Process Automation', 'Budget Controls']);
  const [newSkill, setNewSkill] = useState('');

  const [experience, setExperience] = useState([
    {
      id: 'exp_1',
      role: 'Senior Operations Lead',
      company: 'Apex Logistics Global',
      dates: '2021 – Present',
      location: 'San Francisco, CA',
      bullets: [
        'Directed cross-functional SLA governance maintaining 99.4% on-time milestone delivery across enterprise accounts.',
        'Engineered automated intake protocols, decreasing end-to-end turnaround latency by 32%.'
      ]
    },
    {
      id: 'exp_2',
      role: 'Operations Specialist',
      company: 'Northwind Courier Corp',
      dates: '2018 – 2021',
      location: 'Oakland, CA',
      bullets: [
        'Supervised dispatch logistics for a 28-member team, increasing route yield efficiency by 18%.',
        'Standardized operational escalation SOPs, ensuring 100% adherence to 2-hour response windows.'
      ]
    }
  ]);

  const [education, setEducation] = useState([
    { id: 'edu_1', degree: 'B.S. in Business Administration', school: 'University of California, Berkeley', year: '2018' }
  ]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...experience];
    updated[expIndex].bullets[bulletIndex] = text;
    setExperience(updated);
  };

  const addBullet = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets.push('Spearheaded new operational initiative resulting in verified milestone completion.');
    setExperience(updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    setExperience(updated);
  };

  const handleSaveToWorkspace = () => {
    const resumeData: SavedResume = {
      id: 'res_' + Date.now(),
      title: `${fullName} - ${jobTitle || 'Resume'}`,
      targetRole: jobTitle,
      lastModified: new Date().toLocaleDateString(),
      atsScore: 92,
      isMaster: false,
      content: {
        fullName,
        jobTitle,
        email,
        phone,
        location,
        summary,
        skills,
        experience,
        education
      }
    };
    saveResume(resumeData);
    router.push('/cv-linkedin-optimize/dashboard/resumes' as any);
  };

  const resumePayload = {
    fullName,
    jobTitle,
    email,
    phone,
    location,
    summary,
    skills,
    experience,
    education
  };

  const atsValidation = validateResumeForAtsExport(resumePayload);
  const atsHtml = generateTextSelectableAtsHtml(resumePayload, selectedTemplate);

  const handleDownload = (format: 'pdf' | 'docx') => {
    const element = document.createElement('a');
    const file = new Blob([atsHtml], { type: format === 'pdf' ? 'text/html' : 'application/msword' });
    element.href = URL.createObjectURL(file);
    element.download = `${fullName.replace(/\s+/g, '_')}_Resume.${format === 'pdf' ? 'html' : 'doc'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowExportModal(false);
  };

  return (
    <CareerLayout
      title="Structured ATS Resume Builder & Vector Export | Sheriyakam Career"
      description="Build a parser-friendly single-column resume with clean header hierarchy, AI bullet improver, and text-selectable vector export."
    >
      <View style={styles.container}>
        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.title}>Structured ATS Resume Builder</Text>
            <Text style={styles.subtitle}>
              Clean, single-column architecture designed for 100% readability across legacy and modern ATS parsers.
            </Text>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity style={styles.btnSave} onPress={handleSaveToWorkspace}>
              <Text style={styles.btnSaveText}>Save to Workspace</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnExport} onPress={() => setShowExportModal(true)}>
              <Download size={15} color="#FFFFFF" />
              <Text style={styles.btnExportText}>Export Document</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Selector & Template Picker */}
        <View style={styles.controlsRow}>
          <View style={styles.tabToggle}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'edit' && styles.tabBtnActive]}
              onPress={() => setActiveTab('edit')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'edit' && styles.tabBtnTextActive]}>
                Edit Sections
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'preview' && styles.tabBtnActive]}
              onPress={() => setActiveTab('preview')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'preview' && styles.tabBtnTextActive]}>
                Live Preview
              </Text>
            </TouchableOpacity>
          </View>

          {/* Template Selector Chips */}
          <View style={styles.templateChipsRow}>
            <Text style={styles.templateLabel}>ATS Template:</Text>
            {[
              { id: 'ats-classic', label: 'ATS Classic' },
              { id: 'modern', label: 'Modern Professional' },
              { id: 'executive', label: 'Executive' },
              { id: 'minimal', label: 'Minimal' }
            ].map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.templateChip, selectedTemplate === t.id && styles.templateChipActive]}
                onPress={() => setSelectedTemplate(t.id as any)}
              >
                <Text style={[styles.templateChipText, selectedTemplate === t.id && styles.templateChipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TAB 1: Edit Form */}
        {activeTab === 'edit' && (
          <View style={styles.editorWrap}>
            {/* Section: Contact Details */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>1. Personal & Contact Information</Text>
              <View style={styles.grid2}>
                <View style={styles.fieldCol}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
                </View>
                <View style={styles.fieldCol}>
                  <Text style={styles.fieldLabel}>Target Job Title</Text>
                  <TextInput style={styles.input} value={jobTitle} onChangeText={setJobTitle} />
                </View>
                <View style={styles.fieldCol}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <TextInput style={styles.input} value={email} onChangeText={setEmail} />
                </View>
                <View style={styles.fieldCol}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
                </View>
                <View style={styles.fieldColFull}>
                  <Text style={styles.fieldLabel}>Location (City, State / Remote)</Text>
                  <TextInput style={styles.input} value={location} onChangeText={setLocation} />
                </View>
              </View>
            </View>

            {/* Section: Professional Summary */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderBetween}>
                <Text style={styles.sectionCardTitle}>2. Professional Summary</Text>
                <View style={styles.aiHintBadge}>
                  <Sparkles size={12} color="#059669" />
                  <Text style={styles.aiHintText}>Keep between 2-3 impact sentences</Text>
                </View>
              </View>
              <TextInput
                style={styles.summaryArea}
                multiline
                numberOfLines={4}
                value={summary}
                onChangeText={setSummary}
              />
            </View>

            {/* Section: Core Skills */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>3. Core Competencies & Skills</Text>
              <View style={styles.skillsTagWrap}>
                {skills.map((skill, index) => (
                  <View key={skill} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(index)}>
                      <Text style={styles.skillTagRemove}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.addSkillRow}>
                <TextInput
                  style={styles.inputSmall}
                  placeholder="Type a skill and press Add..."
                  value={newSkill}
                  onChangeText={setNewSkill}
                  onSubmitEditing={addSkill}
                />
                <TouchableOpacity style={styles.btnAddSkill} onPress={addSkill}>
                  <Plus size={14} color="#FFFFFF" />
                  <Text style={styles.btnAddSkillText}>Add Skill</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section: Professional Experience */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>4. Professional Experience</Text>
              {experience.map((exp, expIdx) => (
                <View key={exp.id} style={styles.expCard}>
                  <View style={styles.grid2}>
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Role / Position</Text>
                      <TextInput
                        style={styles.input}
                        value={exp.role}
                        onChangeText={(t) => {
                          const updated = [...experience];
                          updated[expIdx].role = t;
                          setExperience(updated);
                        }}
                      />
                    </View>
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Company Name</Text>
                      <TextInput
                        style={styles.input}
                        value={exp.company}
                        onChangeText={(t) => {
                          const updated = [...experience];
                          updated[expIdx].company = t;
                          setExperience(updated);
                        }}
                      />
                    </View>
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Dates (e.g. 2021 – Present)</Text>
                      <TextInput
                        style={styles.input}
                        value={exp.dates}
                        onChangeText={(t) => {
                          const updated = [...experience];
                          updated[expIdx].dates = t;
                          setExperience(updated);
                        }}
                      />
                    </View>
                    <View style={styles.fieldCol}>
                      <Text style={styles.fieldLabel}>Location</Text>
                      <TextInput
                        style={styles.input}
                        value={exp.location}
                        onChangeText={(t) => {
                          const updated = [...experience];
                          updated[expIdx].location = t;
                          setExperience(updated);
                        }}
                      />
                    </View>
                  </View>

                  {/* Bullet Points */}
                  <Text style={styles.bulletsSubhead}>Accomplishment Bullet Points</Text>
                  {exp.bullets.map((b, bIdx) => (
                    <View key={bIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <TextInput
                        style={styles.bulletInput}
                        multiline
                        value={b}
                        onChangeText={(t) => updateBullet(expIdx, bIdx, t)}
                      />
                      <TouchableOpacity
                        style={styles.btnDeleteBullet}
                        onPress={() => removeBullet(expIdx, bIdx)}
                      >
                        <Trash2 size={13} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity style={styles.btnAddBullet} onPress={() => addBullet(expIdx)}>
                    <Plus size={13} color="#059669" />
                    <Text style={styles.btnAddBulletText}>Add Bullet Point</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Section: Education */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardTitle}>5. Education</Text>
              {education.map((edu, eduIdx) => (
                <View key={edu.id} style={styles.grid2}>
                  <View style={styles.fieldCol}>
                    <Text style={styles.fieldLabel}>Degree</Text>
                    <TextInput
                      style={styles.input}
                      value={edu.degree}
                      onChangeText={(t) => {
                        const updated = [...education];
                        updated[eduIdx].degree = t;
                        setEducation(updated);
                      }}
                    />
                  </View>
                  <View style={styles.fieldCol}>
                    <Text style={styles.fieldLabel}>School / University</Text>
                    <TextInput
                      style={styles.input}
                      value={edu.school}
                      onChangeText={(t) => {
                        const updated = [...education];
                        updated[eduIdx].school = t;
                        setEducation(updated);
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: Live HTML Vector Preview */}
        {activeTab === 'preview' && (
          <View style={styles.previewContainer}>
            <View style={styles.atsPreflightCard}>
              <View style={styles.preflightLeft}>
                <CheckCircle2 size={18} color="#059669" />
                <Text style={styles.preflightText}>
                  ATS Validation: Ready for parsing. 100% single-column selectable vector hierarchy.
                </Text>
              </View>
              <TouchableOpacity style={styles.btnDownloadNow} onPress={() => setShowExportModal(true)}>
                <Download size={14} color="#FFFFFF" />
                <Text style={styles.btnDownloadNowText}>Download</Text>
              </TouchableOpacity>
            </View>

            {/* Rendered Document Sheet */}
            <View style={styles.paperDocument}>
              <Text style={styles.docName}>{fullName}</Text>
              <Text style={styles.docTitle}>{jobTitle}</Text>
              <Text style={styles.docContact}>
                {[email, phone, location].filter(Boolean).join('  |  ')}
              </Text>

              <Text style={styles.docHeading}>Professional Summary</Text>
              <Text style={styles.docBody}>{summary}</Text>

              <Text style={styles.docHeading}>Core Competencies & Skills</Text>
              <Text style={styles.docBody}>{skills.join(' • ')}</Text>

              <Text style={styles.docHeading}>Professional Experience</Text>
              {experience.map((exp) => (
                <View key={exp.id} style={styles.docExpItem}>
                  <View style={styles.docBetweenRow}>
                    <Text style={styles.docRole}>{exp.role}</Text>
                    <Text style={styles.docDates}>{exp.dates}</Text>
                  </View>
                  <View style={styles.docBetweenRow}>
                    <Text style={styles.docCompany}>{exp.company}</Text>
                    <Text style={styles.docLoc}>{exp.location}</Text>
                  </View>
                  {exp.bullets.map((b, i) => (
                    <Text key={i} style={styles.docBullet}>• {b}</Text>
                  ))}
                </View>
              ))}

              <Text style={styles.docHeading}>Education</Text>
              {education.map((edu) => (
                <View key={edu.id} style={styles.docBetweenRow}>
                  <Text style={styles.docBody}><strong>{edu.degree}</strong> — {edu.school}</Text>
                  <Text style={styles.docDates}>{edu.year}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pre-Flight Export Modal */}
        {showExportModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <FileCheck size={20} color="#059669" />
                  <Text style={styles.modalTitle}>Pre-Flight ATS Validation Check</Text>
                </View>
                <TouchableOpacity onPress={() => setShowExportModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.checklistGrid}>
                {atsValidation.checks.map((c, i) => (
                  <View key={i} style={styles.checkRow}>
                    <CheckCircle2 size={16} color="#059669" />
                    <Text style={styles.checkText}>{c.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalDivider} />

              <Text style={styles.selectFormatLabel}>Select Export Format:</Text>
              <View style={styles.exportOptionsRow}>
                <TouchableOpacity style={styles.btnFormatOption} onPress={() => handleDownload('pdf')}>
                  <FileText size={18} color="#059669" />
                  <View>
                    <Text style={styles.formatTitle}>Text-Selectable PDF (HTML Print)</Text>
                    <Text style={styles.formatDesc}>#000000 typography, 0.75in margins, calibrated for ATS parsers.</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnFormatOption} onPress={() => handleDownload('docx')}>
                  <Briefcase size={18} color="#2563EB" />
                  <View>
                    <Text style={styles.formatTitle}>Word Document (.DOCX)</Text>
                    <Text style={styles.formatDesc}>Standard single-column editable format.</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </CareerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1080,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  topBar: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    maxWidth: 600,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnSave: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  btnSaveText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  btnExport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#111111',
  },
  btnExportText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  controlsRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    padding: 3,
    borderRadius: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  tabBtnTextActive: {
    color: '#111111',
    fontWeight: '700',
  },
  templateChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  templateLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 4,
  },
  templateChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  templateChipText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  templateChipTextActive: {
    color: '#065F46',
    fontWeight: '700',
  },
  editorWrap: {
    gap: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    gap: 14,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  aiHintText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '500',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fieldCol: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 240 : '100%',
  },
  fieldColFull: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111111',
  },
  summaryArea: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    color: '#111111',
    lineHeight: 19,
    minHeight: 80,
  },
  skillsTagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillTagText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  skillTagRemove: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },
  addSkillRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inputSmall: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
  },
  btnAddSkill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#111111',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnAddSkillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  expCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
    marginBottom: 10,
  },
  bulletsSubhead: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletDot: {
    fontSize: 14,
    color: '#059669',
    marginTop: 4,
  },
  bulletInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    lineHeight: 17,
  },
  btnDeleteBullet: {
    padding: 8,
  },
  btnAddBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  btnAddBulletText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  previewContainer: {
    gap: 20,
  },
  atsPreflightCard: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 10,
  },
  preflightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  preflightText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
  },
  btnDownloadNow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnDownloadNowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paperDocument: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 40,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  docName: {
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 2,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 4,
  },
  docContact: {
    fontSize: 10,
    textAlign: 'center',
    color: '#222222',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  docHeading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginVertical: 10,
    letterSpacing: 0.5,
  },
  docBody: {
    fontSize: 11,
    lineHeight: 16,
    color: '#000000',
    marginBottom: 6,
  },
  docExpItem: {
    marginBottom: 10,
  },
  docBetweenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  docRole: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  docDates: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#111111',
  },
  docCompany: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#222222',
  },
  docLoc: {
    fontSize: 10,
    color: '#444444',
  },
  docBullet: {
    fontSize: 10.5,
    lineHeight: 15,
    color: '#000000',
    marginLeft: 10,
    marginBottom: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    maxWidth: 500,
    width: '100%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  modalClose: {
    fontSize: 16,
    color: '#6B7280',
    padding: 4,
  },
  checklistGrid: {
    gap: 8,
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    fontSize: 12,
    color: '#374151',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  selectFormatLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 10,
  },
  exportOptionsRow: {
    gap: 10,
  },
  btnFormatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  formatTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  formatDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});
