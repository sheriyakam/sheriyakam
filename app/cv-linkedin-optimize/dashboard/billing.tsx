import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CareerLayout } from '../components/CareerLayout';
import {
  getCreditLedger,
  upgradePlan,
  CreditLedgerStatus
} from '../../../services/careerService';
import {
  Zap,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Check,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react-native';

export default function CareerDashboardBillingPage() {
  const router = useRouter();
  const [ledger, setLedger] = useState<CreditLedgerStatus>(getCreditLedger());
  const [justUpgraded, setJustUpgraded] = useState<string | null>(null);

  useEffect(() => {
    setLedger(getCreditLedger());
  }, []);

  const subroutes = [
    { label: 'Overview', path: '/cv-linkedin-optimize/dashboard' },
    { label: 'Saved Resumes', path: '/cv-linkedin-optimize/dashboard/resumes' },
    { label: 'Past Analyses', path: '/cv-linkedin-optimize/dashboard/analyses' },
    { label: 'Saved Jobs', path: '/cv-linkedin-optimize/dashboard/jobs' },
    { label: 'LinkedIn Drafts', path: '/cv-linkedin-optimize/dashboard/linkedin' },
    { label: 'Cover Letters', path: '/cv-linkedin-optimize/dashboard/cover-letters' },
    { label: 'Billing & Credits', path: '/cv-linkedin-optimize/dashboard/billing', active: true },
    { label: 'Settings', path: '/cv-linkedin-optimize/dashboard/settings' },
  ];

  const handleUpgrade = (tier: 'lite' | 'active_search') => {
    upgradePlan(tier);
    setLedger(getCreditLedger());
    setJustUpgraded(tier);
    setTimeout(() => setJustUpgraded(null), 3000);
    if (Platform.OS === 'web') {
      window.alert(`Successfully activated ${tier === 'lite' ? 'Lite ($2)' : 'Active Search ($5)'} plan credits!`);
    } else {
      Alert.alert('Plan Activated', `Added credits for ${tier === 'lite' ? 'Lite' : 'Active Search'}.`);
    }
  };

  return (
    <CareerLayout
      title="Credits & Plans | Sheriyakam Career Workspace"
      description="Transparent credit ledger, rolling refill countdown, and transparent pricing plans."
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
            <Text style={styles.pageTitle}>Credits Ledger & Plans</Text>
            <Text style={styles.pageSub}>
              Fair, deterministic pricing. Free rolling credits refill every 5 hours with zero credit card required.
            </Text>
          </View>
        </View>

        {/* Current Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <View>
              <Text style={styles.balanceLabel}>Current Available Balance</Text>
              <View style={styles.balanceNumberRow}>
                <Text style={styles.balanceNumber}>
                  {ledger.freeCreditsRemaining + ledger.paidCredits}
                </Text>
                <Text style={styles.balanceUnits}>Total Credits</Text>
              </View>
            </View>

            <View style={styles.balanceRight}>
              <View style={styles.planBadge}>
                <Zap size={13} color="#059669" />
                <Text style={styles.planBadgeText}>
                  Active Plan: {ledger.plan.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.balanceBreakdownRow}>
            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Free Rolling Credits</Text>
              <Text style={styles.breakdownVal}>{ledger.freeCreditsRemaining} of 3 remaining</Text>
              <View style={styles.refillRow}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.refillText}>Refills in: {ledger.nextUnlockFormatted}</Text>
              </View>
            </View>

            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Paid Pack Balance</Text>
              <Text style={styles.breakdownVal}>{ledger.paidCredits} credits</Text>
              <Text style={styles.refillText}>Never expire • Priority LLM speed</Text>
            </View>

            <View style={styles.breakdownCol}>
              <Text style={styles.breakdownLabel}>Audit Log</Text>
              <Text style={styles.breakdownVal}>{ledger.history?.length || 0} actions recorded</Text>
              <Text style={styles.refillText}>Transparent per-request deduction</Text>
            </View>
          </View>
        </View>

        {/* Plan Cards Grid */}
        <Text style={styles.plansSectionTitle}>Choose Your Plan</Text>
        <Text style={styles.plansSectionSub}>No recurring subscriptions unless desired. Pay for only what you use.</Text>

        <View style={styles.plansGrid}>
          {/* Free Tier */}
          <View style={styles.planCard}>
            <Text style={styles.tierName}>Free Rolling</Text>
            <View style={styles.tierPriceRow}>
              <Text style={styles.tierPrice}>$0</Text>
              <Text style={styles.tierBilling}>/ forever</Text>
            </View>
            <Text style={styles.tierDesc}>Ideal for occasional job applications and single-resume checks.</Text>

            <View style={styles.tierFeatureList}>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>3 ATS checks every 5 hours</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>6-category score breakdown</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>Basic keyword matching</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>Anti-fabrication guardrails</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btnCurrentPlan} disabled>
              <Text style={styles.btnCurrentPlanText}>Included Default</Text>
            </TouchableOpacity>
          </View>

          {/* Lite Plan ($2) */}
          <View style={[styles.planCard, styles.planCardHighlighted]}>
            <View style={styles.popularRibbon}>
              <Text style={styles.popularRibbonText}>GREAT FOR 1 TARGET JOB</Text>
            </View>
            <Text style={styles.tierName}>Lite Pack</Text>
            <View style={styles.tierPriceRow}>
              <Text style={styles.tierPrice}>$2</Text>
              <Text style={styles.tierBilling}>one-time</Text>
            </View>
            <Text style={styles.tierDesc}>25 credits with instant access to deep keyword diagnostics.</Text>

            <View style={styles.tierFeatureList}>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>25 flexible career credits</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>Full keyword gap locator</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>Resume humanizer & buzzword fixer</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>Single-color vector ATS print</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnUpgradePrimary}
              onPress={() => handleUpgrade('lite')}
            >
              <Zap size={14} color="#FFFFFF" />
              <Text style={styles.btnUpgradePrimaryText}>
                {justUpgraded === 'lite' ? 'Activated!' : 'Get Lite Pack ($2)'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Search ($5) */}
          <View style={styles.planCard}>
            <Text style={styles.tierName}>Active Search</Text>
            <View style={styles.tierPriceRow}>
              <Text style={styles.tierPrice}>$5</Text>
              <Text style={styles.tierBilling}>one-time</Text>
            </View>
            <Text style={styles.tierDesc}>100 credits for multi-role job hunts and complete career rebranding.</Text>

            <View style={styles.tierFeatureList}>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>100 high-priority credits</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>Unlimited resume tailoring</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>LinkedIn Headline & Hook suite</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>STAR Mock Interview simulator</Text>
              </View>
              <View style={styles.tierFeatureItem}>
                <Check size={14} color="#059669" />
                <Text style={styles.tierFeatureText}>Multi-tone cover letter generator</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnUpgradeDark}
              onPress={() => handleUpgrade('active_search')}
            >
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.btnUpgradeDarkText}>
                {justUpgraded === 'active_search' ? 'Activated!' : 'Get Active Search ($5)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ledger Transaction History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Credit Consumption History</Text>
          {(!ledger.history || ledger.history.length === 0) ? (
            <View style={styles.emptyHistoryBox}>
              <Text style={styles.emptyHistoryText}>No credit deductions recorded yet.</Text>
            </View>
          ) : (
            <View style={styles.historyTable}>
              {ledger.history.slice(0, 10).map((h: any) => (
                <View key={h.id} style={styles.historyRow}>
                  <View style={styles.historyActionCol}>
                    <Text style={styles.historyActionText}>{h.action}</Text>
                    <Text style={styles.historyTimestamp}>
                      {new Date(h.timestamp).toLocaleDateString()} at {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={styles.historyCostCol}>
                    <Text style={[styles.historyCostText, h.cost > 0 ? styles.costDeduct : styles.costAdd]}>
                      {h.cost > 0 ? `-${h.cost} credit` : 'Added'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
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
    marginBottom: 24,
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
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 18,
    marginBottom: 18,
    flexWrap: 'wrap',
    gap: 12,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  balanceNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -1,
  },
  balanceUnits: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  balanceRight: {
    alignItems: 'flex-end',
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  balanceBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  breakdownCol: {
    flex: 1,
    minWidth: 200,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  breakdownVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  refillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refillText: {
    fontSize: 12,
    color: '#6B7280',
  },
  plansSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.3,
  },
  plansSectionSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  plansGrid: {
    flexDirection: 'row',
    gap: 18,
    flexWrap: 'wrap',
    marginBottom: 36,
  },
  planCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    position: 'relative',
  },
  planCardHighlighted: {
    borderColor: '#059669',
    borderWidth: 2,
    shadowColor: '#059669',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  popularRibbon: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  popularRibbonText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 6,
  },
  tierPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111111',
  },
  tierBilling: {
    fontSize: 13,
    color: '#6B7280',
  },
  tierDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 20,
    minHeight: 36,
  },
  tierFeatureList: {
    gap: 10,
    marginBottom: 24,
  },
  tierFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierFeatureText: {
    fontSize: 13,
    color: '#374151',
  },
  btnCurrentPlan: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCurrentPlanText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  btnUpgradePrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnUpgradePrimaryText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  btnUpgradeDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#111111',
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnUpgradeDarkText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 14,
  },
  emptyHistoryBox: {
    padding: 20,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  historyTable: {
    gap: 10,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyActionCol: {
    flex: 1,
  },
  historyActionText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  historyTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  historyCostCol: {
    paddingLeft: 12,
  },
  historyCostText: {
    fontSize: 12,
    fontWeight: '600',
  },
  costDeduct: {
    color: '#DC2626',
  },
  costAdd: {
    color: '#059669',
  },
});
