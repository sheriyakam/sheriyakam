import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  getSavedLinkedInDrafts,
  saveLinkedInDraft,
  deleteLinkedInDraft,
  SavedLinkedInDraft
} from '../../../services/careerService';
import {
  Linkedin,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react-native';

export default function CareerDashboardLinkedInPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<SavedLinkedInDraft[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(getSavedLinkedInDrafts());
  }, []);

  const subroutes = [
    { label: 'Overview', path: '/cv-linkedin-optimize/dashboard' },
    { label: 'Saved Resumes', path: '/cv-linkedin-optimize/dashboard/resumes' },
    { label: 'Past Analyses', path: '/cv-linkedin-optimize/dashboard/analyses' },
    { label: 'Saved Jobs', path: '/cv-linkedin-optimize/dashboard/jobs' },
    { label: 'LinkedIn Drafts', path: '/cv-linkedin-optimize/dashboard/linkedin', active: true },
    { label: 'Cover Letters', path: '/cv-linkedin-optimize/dashboard/cover-letters' },
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
    deleteLinkedInDraft(id);
    setDrafts(getSavedLinkedInDrafts());
  };

  return (
    <CareerLayout
      title="LinkedIn Profile Drafts | Sheriyakam Career Workspace"
      description="Manage your optimized LinkedIn headlines, 3-sentence hooks, and endorsement checklists."
    >
      <View style={styles.container}>
        {/* Subtabs Bar */}
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

        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>LinkedIn Profile Drafts</Text>
            <Text style={styles.pageSub}>
              Copy recruiter-ready headlines and About sections directly to your LinkedIn profile.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnNewDraft}
            onPress={() => router.push('/cv-linkedin-optimize/linkedin' as any)}
          >
            <Sparkles size={16} color="#FFFFFF" />
            <Text style={styles.btnNewDraftText}>Run Optimizer</Text>
          </TouchableOpacity>
        </View>

        {/* Drafts List */}
        {drafts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Linkedin size={40} color="#0A66C2" />
            <Text style={styles.emptyTitle}>No saved LinkedIn drafts</Text>
            <Text style={styles.emptySub}>
              Generate a high-visibility headline and 3-sentence About hook tailored to recruiter search patterns.
            </Text>
            <TouchableOpacity
              style={styles.btnStartDraft}
              onPress={() => router.push('/cv-linkedin-optimize/linkedin' as any)}
            >
              <Sparkles size={15} color="#FFFFFF" />
              <Text style={styles.btnStartDraftText}>Optimize Your Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.draftsList}>
            {drafts.map(d => {
              const charCount = d.headline.length;
              const isHeadlineIdeal = charCount <= 220;

              return (
                <View key={d.id} style={styles.draftCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{d.title}</Text>
                      <Text style={styles.cardRole}>Target: {d.targetRole} • Updated {d.lastModified}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(d.id)}
                    >
                      <Trash2 size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>

                  {/* Headline Block */}
                  <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionLabel}>Optimized Headline</Text>
                      <View style={[styles.charCountBadge, isHeadlineIdeal ? styles.badgeGood : styles.badgeWarn]}>
                        <Text style={[styles.charCountText, isHeadlineIdeal ? styles.textGood : styles.textWarn]}>
                          {charCount}/220 chars {isHeadlineIdeal ? '(Ideal)' : '(Over limit)'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.contentBox}>
                      <Text style={styles.contentText}>{d.headline}</Text>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() => handleCopy(d.headline, `${d.id}_headline`)}
                      >
                        {copiedId === `${d.id}_headline` ? (
                          <>
                            <Check size={13} color="#059669" />
                            <Text style={styles.copyBtnTextCopied}>Copied</Text>
                          </>
                        ) : (
                          <>
                            <Copy size={13} color="#4B5563" />
                            <Text style={styles.copyBtnText}>Copy Headline</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* About Hook Block */}
                  <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionLabel}>3-Sentence "About" Hook (Before 'See More')</Text>
                    </View>
                    <View style={styles.contentBox}>
                      <Text style={styles.contentText}>{d.aboutHook}</Text>
                      <TouchableOpacity
                        style={styles.copyBtn}
                        onPress={() => handleCopy(d.aboutHook, `${d.id}_hook`)}
                      >
                        {copiedId === `${d.id}_hook` ? (
                          <>
                            <Check size={13} color="#059669" />
                            <Text style={styles.copyBtnTextCopied}>Copied</Text>
                          </>
                        ) : (
                          <>
                            <Copy size={13} color="#4B5563" />
                            <Text style={styles.copyBtnText}>Copy Hook</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Narrative Body */}
                  {d.aboutNarrative && (
                    <View style={styles.sectionBlock}>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionLabel}>Full Narrative Story</Text>
                      </View>
                      <View style={styles.contentBox}>
                        <Text style={styles.contentText}>{d.aboutNarrative}</Text>
                        <TouchableOpacity
                          style={styles.copyBtn}
                          onPress={() => handleCopy(d.aboutNarrative, `${d.id}_narrative`)}
                        >
                          {copiedId === `${d.id}_narrative` ? (
                            <>
                              <Check size={13} color="#059669" />
                              <Text style={styles.copyBtnTextCopied}>Copied</Text>
                            </>
                          ) : (
                            <>
                              <Copy size={13} color="#4B5563" />
                              <Text style={styles.copyBtnText}>Copy Story</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Skills to Add */}
                  {d.skillsToAdd && d.skillsToAdd.length > 0 && (
                    <View style={styles.skillsBlock}>
                      <Text style={styles.skillsBlockTitle}>Recommended LinkedIn Endorsement Skills:</Text>
                      <View style={styles.skillsChips}>
                        {d.skillsToAdd.map((s, idx) => (
                          <View key={idx} style={styles.skillChip}>
                            <Text style={styles.skillChipText}>+ {s}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
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
  btnNewDraft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A66C2',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnNewDraftText: {
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
  btnStartDraft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnStartDraftText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  draftsList: {
    gap: 20,
  },
  draftCard: {
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  cardRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  btnDelete: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  charCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeGood: {
    backgroundColor: '#ECFDF5',
  },
  badgeWarn: {
    backgroundColor: '#FEF2F2',
  },
  charCountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  textGood: {
    color: '#059669',
  },
  textWarn: {
    color: '#DC2626',
  },
  contentBox: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  contentText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 10,
  },
  copyBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  copyBtnTextCopied: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  skillsBlock: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  skillsBlockTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  skillsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillChipText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
});
