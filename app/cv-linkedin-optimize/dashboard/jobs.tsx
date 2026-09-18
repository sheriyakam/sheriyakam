import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  getSavedJobs,
  saveJob,
  deleteJob,
  updateJobStatus,
  SavedJob
} from '../../../services/careerService';
import {
  Briefcase,
  Plus,
  Trash2,
  FileText,
  Building,
  MapPin,
  DollarSign,
  CheckCircle2,
  Sparkles
} from 'lucide-react-native';

export default function CareerDashboardJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    setJobs(getSavedJobs());
  }, []);

  const subroutes = [
    { label: 'Overview', path: '/cv-linkedin-optimize/dashboard' },
    { label: 'Saved Resumes', path: '/cv-linkedin-optimize/dashboard/resumes' },
    { label: 'Past Analyses', path: '/cv-linkedin-optimize/dashboard/analyses' },
    { label: 'Saved Jobs', path: '/cv-linkedin-optimize/dashboard/jobs', active: true },
    { label: 'LinkedIn Drafts', path: '/cv-linkedin-optimize/dashboard/linkedin' },
    { label: 'Cover Letters', path: '/cv-linkedin-optimize/dashboard/cover-letters' },
    { label: 'Billing & Credits', path: '/cv-linkedin-optimize/dashboard/billing' },
    { label: 'Settings', path: '/cv-linkedin-optimize/dashboard/settings' },
  ];

  const filteredJobs = jobs.filter(j => {
    if (statusFilter === 'all') return true;
    return j.status === statusFilter;
  });

  const handleCreateJob = () => {
    if (!newTitle.trim() || !newCompany.trim() || !newDescription.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please provide Job Title, Company, and Job Description.');
      } else {
        Alert.alert('Required', 'Please fill in Title, Company, and Description.');
      }
      return;
    }

    const words = newDescription
      .split(/[\s,.;:()]+/)
      .filter(w => w.length > 4)
      .slice(0, 5);

    const created: SavedJob = {
      id: `job_${Date.now()}`,
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: newLocation.trim() || 'Remote / Unspecified',
      salary: newSalary.trim() || undefined,
      description: newDescription.trim(),
      extractedKeywords: words.length > 0 ? words : ['Operations', 'Strategy', 'Execution'],
      dateSaved: 'Just now',
      matchScore: Math.floor(Math.random() * 15) + 80,
      status: 'saved'
    };

    saveJob(created);
    setJobs(getSavedJobs());
    setNewTitle('');
    setNewCompany('');
    setNewLocation('');
    setNewSalary('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    deleteJob(id);
    setJobs(getSavedJobs());
  };

  const handleStatusChange = (id: string, newStatus: SavedJob['status']) => {
    updateJobStatus(id, newStatus);
    setJobs(getSavedJobs());
  };

  return (
    <CareerLayout
      title="Saved Job Postings | Sheriyakam Career Workspace"
      description="Organize your target job listings, monitor skill alignment, and generate targeted resumes."
    >
      <View style={styles.container}>
        <View style={styles.subtabsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subtabsRow}>
            {subroutes.map(r => (
              <TouchableOpacity
                key={r.path}
                style={[styles.subtabBtn, r.active && styles.subtabBtnActive]}
                onPress={() => router.push(r.path as any)}
              >
                <Text style={[styles.subtabText, r.active && styles.subtabTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Saved Job Postings</Text>
            <Text style={styles.pageSub}>
              Keep job descriptions handy to match keywords and customize documents accurately.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnAddJob}
            onPress={() => setShowAddModal(!showAddModal)}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.btnAddJobText}>{showAddModal ? 'Cancel' : 'Add New Job'}</Text>
          </TouchableOpacity>
        </View>

        {showAddModal && (
          <View style={styles.addCard}>
            <Text style={styles.addCardTitle}>Save Target Job Description</Text>
            <View style={styles.addInputsGrid}>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Job Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Senior Operations Lead"
                  placeholderTextColor="#9CA3AF"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Company Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Acme Corp"
                  placeholderTextColor="#9CA3AF"
                  value={newCompany}
                  onChangeText={setNewCompany}
                />
              </View>
            </View>

            <View style={styles.addInputsGrid}>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Location / Mode</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. New York, NY (Hybrid)"
                  placeholderTextColor="#9CA3AF"
                  value={newLocation}
                  onChangeText={setNewLocation}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>Salary / Range (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. $130,000 - $155,000"
                  placeholderTextColor="#9CA3AF"
                  value={newSalary}
                  onChangeText={setNewSalary}
                />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.inputLabel}>Full Job Description & Requirements *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Paste the job description and bullet points here..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                value={newDescription}
                onChangeText={setNewDescription}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSaveConfirm}
                onPress={handleCreateJob}
              >
                <CheckCircle2 size={16} color="#FFFFFF" />
                <Text style={styles.btnSaveConfirmText}>Save Job Posting</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.filtersRow}>
          {['all', 'saved', 'tailored', 'applied', 'interviewing'].map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.filterPill, statusFilter === status && styles.filterPillActive]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[styles.filterPillText, statusFilter === status && styles.filterPillTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredJobs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Briefcase size={36} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No job descriptions found</Text>
            <Text style={styles.emptySub}>
              {statusFilter === 'all'
                ? 'Save target job descriptions to run keyword scans and tailor your resumes.'
                : `No jobs marked with status "${statusFilter}".`}
            </Text>
            <TouchableOpacity
              style={styles.btnEmptyAdd}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={15} color="#FFFFFF" />
              <Text style={styles.btnEmptyAddText}>Add Your First Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.jobList}>
            {filteredJobs.map(job => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobTop}>
                  <View style={styles.jobMetaLeft}>
                    <Text style={styles.jobRoleTitle}>{job.title}</Text>
                    <View style={styles.jobDetailsRow}>
                      <View style={styles.jobDetailItem}>
                        <Building size={13} color="#6B7280" />
                        <Text style={styles.jobDetailText}>{job.company}</Text>
                      </View>
                      <View style={styles.jobDetailItem}>
                        <MapPin size={13} color="#6B7280" />
                        <Text style={styles.jobDetailText}>{job.location}</Text>
                      </View>
                      {job.salary && (
                        <View style={styles.jobDetailItem}>
                          <DollarSign size={13} color="#6B7280" />
                          <Text style={styles.jobDetailText}>{job.salary}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.jobMatchBadge}>
                    <Text style={styles.jobMatchVal}>{job.matchScore || 82}%</Text>
                    <Text style={styles.jobMatchLabel}>Match</Text>
                  </View>
                </View>

                <Text style={styles.jobDescSnippet} numberOfLines={2}>
                  {job.description}
                </Text>

                <View style={styles.keywordsWrap}>
                  <Text style={styles.keywordsHeader}>Key Requirements:</Text>
                  <View style={styles.keywordChips}>
                    {job.extractedKeywords.map((kw, i) => (
                      <View key={i} style={styles.keywordChip}>
                        <Text style={styles.keywordChipText}>{kw}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.statusPickerRow}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    {(['saved', 'tailored', 'applied', 'interviewing'] as const).map(s => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.statusOption,
                          job.status === s && styles.statusOptionActive
                        ]}
                        onPress={() => handleStatusChange(job.id, s)}
                      >
                        <Text
                          style={[
                            styles.statusOptionText,
                            job.status === s && styles.statusOptionTextActive
                          ]}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.footerActions}>
                    <TouchableOpacity
                      style={styles.actionBtnOutline}
                      onPress={() => router.push('/cv-linkedin-optimize/cover-letter' as any)}
                    >
                      <FileText size={14} color="#111111" />
                      <Text style={styles.actionBtnOutlineText}>Cover Letter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => router.push('/cv-linkedin-optimize/resume-tailor' as any)}
                    >
                      <Sparkles size={14} color="#FFFFFF" />
                      <Text style={styles.actionBtnPrimaryText}>Tailor Resume</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(job.id)}
                    >
                      <Trash2 size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </CareerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1100,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  subtabsWrap: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subtabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  subtabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  subtabBtnActive: {
    backgroundColor: '#111111',
  },
  subtabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  subtabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.5,
  },
  pageSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  btnAddJob: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnAddJobText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  addCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 16,
  },
  addInputsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  inputCol: {
    flex: 1,
    minWidth: 220,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111111',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  btnCancel: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  btnCancelText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  btnSaveConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#059669',
  },
  btnSaveConfirmText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  jobList: {
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  jobTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  jobMetaLeft: {
    flex: 1,
  },
  jobRoleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 6,
  },
  jobDetailsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobMatchBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  jobMatchVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  jobMatchLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
    textTransform: 'uppercase',
  },
  jobDescSnippet: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  keywordsWrap: {
    marginBottom: 14,
  },
  keywordsHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  keywordChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  keywordChipText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  statusPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 2,
  },
  statusOption: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  statusOptionActive: {
    backgroundColor: '#E0E7FF',
  },
  statusOptionText: {
    fontSize: 11,
    color: '#4B5563',
  },
  statusOptionTextActive: {
    color: '#3730A3',
    fontWeight: '700',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#111111',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  btnDelete: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 380,
    marginBottom: 16,
  },
  btnEmptyAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnEmptyAddText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
