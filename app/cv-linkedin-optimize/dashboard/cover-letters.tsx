import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  getSavedCoverLetters,
  deleteCoverLetter,
  SavedCoverLetter
} from '../../../services/careerService';
import {
  Mail,
  Copy,
  Check,
  Plus,
  Trash2,
  Building,
  Briefcase,
  Sparkles
} from 'lucide-react-native';

export default function CareerDashboardCoverLettersPage() {
  const router = useRouter();
  const [letters, setLetters] = useState<SavedCoverLetter[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setLetters(getSavedCoverLetters());
  }, []);

  const subroutes = [
    { label: 'Overview', path: '/cv-linkedin-optimize/dashboard' },
    { label: 'Saved Resumes', path: '/cv-linkedin-optimize/dashboard/resumes' },
    { label: 'Past Analyses', path: '/cv-linkedin-optimize/dashboard/analyses' },
    { label: 'Saved Jobs', path: '/cv-linkedin-optimize/dashboard/jobs' },
    { label: 'LinkedIn Drafts', path: '/cv-linkedin-optimize/dashboard/linkedin' },
    { label: 'Cover Letters', path: '/cv-linkedin-optimize/dashboard/cover-letters', active: true },
    { label: 'Billing & Credits', path: '/cv-linkedin-optimize/dashboard/billing' },
    { label: 'Settings', path: '/cv-linkedin-optimize/dashboard/settings' },
  ];

  const handleCopy = (text: string, id: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    deleteCoverLetter(id);
    setLetters(getSavedCoverLetters());
  };

  return (
    <CareerLayout
      title="Saved Cover Letters | Sheriyakam Career Workspace"
      description="Access and copy your customized, recruiter-targeted cover letters."
    >
      <View style={styles.container}>
        {/* Subtabs Navigation */}
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

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Saved Cover Letters</Text>
            <Text style={styles.pageSub}>
              Role-specific cover letters written with authentic career achievements and no AI fluff.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnNewLetter}
            onPress={() => router.push('/cv-linkedin-optimize/cover-letter' as any)}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.btnNewLetterText}>New Cover Letter</Text>
          </TouchableOpacity>
        </View>

        {/* List of Letters */}
        {letters.length === 0 ? (
          <View style={styles.emptyCard}>
            <Mail size={40} color="#6B7280" />
            <Text style={styles.emptyTitle}>No saved cover letters</Text>
            <Text style={styles.emptySub}>
              Generate a high-conversion, fact-checked cover letter tailored to a specific job description.
            </Text>
            <TouchableOpacity
              style={styles.btnEmptyCreate}
              onPress={() => router.push('/cv-linkedin-optimize/cover-letter' as any)}
            >
              <Sparkles size={15} color="#FFFFFF" />
              <Text style={styles.btnEmptyCreateText}>Generate Your First Letter</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.lettersGrid}>
            {letters.map(letter => (
              <View key={letter.id} style={styles.letterCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.roleTitle}>{letter.roleTitle}</Text>
                    <View style={styles.companyRow}>
                      <Building size={13} color="#6B7280" />
                      <Text style={styles.companyText}>{letter.companyName}</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.dateText}>{letter.dateCreated}</Text>
                    </View>
                  </View>

                  <View style={styles.headerRight}>
                    <View style={styles.toneBadge}>
                      <Text style={styles.toneText}>{letter.tone}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(letter.id)}
                    >
                      <Trash2 size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Letter Body Preview */}
                <View style={styles.letterBody}>
                  <Text style={styles.letterContent}>{letter.content}</Text>
                </View>

                {/* Card Actions */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.btnCopy}
                    onPress={() => handleCopy(letter.content, letter.id)}
                  >
                    {copiedId === letter.id ? (
                      <>
                        <Check size={14} color="#059669" />
                        <Text style={styles.btnCopyTextCopied}>Copied to Clipboard</Text>
                      </>
                    ) : (
                      <>
                        <Copy size={14} color="#111111" />
                        <Text style={styles.btnCopyText}>Copy Letter Text</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnRegen}
                    onPress={() => router.push('/cv-linkedin-optimize/cover-letter' as any)}
                  >
                    <Sparkles size={14} color="#4B5563" />
                    <Text style={styles.btnRegenText}>Adjust Tone</Text>
                  </TouchableOpacity>
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
  btnNewLetter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnNewLetterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
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
    maxWidth: 400,
    marginBottom: 16,
  },
  btnEmptyCreate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnEmptyCreateText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  lettersGrid: {
    gap: 20,
  },
  letterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 14,
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  dot: {
    color: '#9CA3AF',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toneBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toneText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  btnDelete: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  letterBody: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  letterContent: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 22,
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : undefined,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  btnCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnCopyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },
  btnCopyTextCopied: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  btnRegen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  btnRegenText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
});
