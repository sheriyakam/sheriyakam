import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ActivityIndicator } from 'react-native';
import { Mic, MicOff, Send, Sparkles, Award } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { evaluateMockInterview } from '../../services/dynamicLlmGateway';

export default function MockInterviewSimulator({ colors, isDark, userToast, targetRole = 'Director of Operations' }) {
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
    const [mode, setMode] = useState('voice');
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [speakingSeconds, setSpeakingSeconds] = useState(0);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    const questions = [
        {
            id: 'q1',
            text: 'Walk me through how you engineered the revised vendor intake protocol to reduce turnaround bottlenecks by 32%.',
            category: 'Process Optimization',
            targetKeywords: ['SLA Governance', 'Bottlenecks', 'Escalation Thresholds', 'Efficiency']
        },
        {
            id: 'q2',
            text: 'How do you structure vendor intake governance and handle severe SLA escalations when an external supplier misses milestones?',
            category: 'Risk & Governance',
            targetKeywords: ['Root Cause Analysis', 'SLA Adherence', 'Vendor Mitigation', 'KPI Dashboards']
        },
        {
            id: 'q3',
            text: 'Describe a situation where you had to lead a cross-functional team through sudden operational budget cuts without sacrificing delivery velocity.',
            category: 'Leadership & Budgeting',
            targetKeywords: ['Zero-Based Variance', 'Milestone Gating', 'Cross-Functional', 'Team Alignment']
        }
    ];

    const currentQ = questions[selectedQuestionIdx];

    useEffect(() => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                setSpeechSupported(true);
                try {
                    const recognition = new SpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;
                    recognition.lang = 'en-US';

                    recognition.onresult = (event) => {
                        let transcript = '';
                        for (let i = 0; i < event.results.length; i++) {
                            transcript += event.results[i][0].transcript + ' ';
                        }
                        setUserAnswer(transcript.trim());
                    };

                    recognition.onerror = (e) => {
                        console.warn('[SpeechRecognition] Error:', e.error);
                        setIsListening(false);
                    };

                    recognition.onend = () => {
                        setIsListening(false);
                    };

                    recognitionRef.current = recognition;
                } catch (e) {
                    console.warn('SpeechRecognition init error:', e);
                }
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const toggleListening = () => {
        if (!speechSupported) {
            userToast?.info?.('Voice recognition not supported in this browser. Switching to text mode.');
            setMode('text');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            if (timerRef.current) clearInterval(timerRef.current);
        } else {
            setUserAnswer('');
            setSpeakingSeconds(0);
            setEvaluationResult(null);
            try {
                recognitionRef.current?.start();
                setIsListening(true);
                timerRef.current = setInterval(() => {
                    setSpeakingSeconds(s => s + 1);
                }, 1000);
            } catch (err) {
                console.warn('Speech start error:', err);
            }
        }
    };

    const handleRunEvaluation = async () => {
        if (!userAnswer.trim()) {
            userToast?.error?.('Please speak or type an answer first.');
            return;
        }

        setIsEvaluating(true);
        try {
            const res = await evaluateMockInterview({
                question: currentQ.text,
                answer: userAnswer,
                targetRole,
                targetKeywords: currentQ.targetKeywords,
                spokenSeconds: speakingSeconds
            });
            setEvaluationResult(res);
            userToast?.success?.('Answer evaluated successfully!');
        } catch (err) {
            console.error('Evaluation error:', err);
            userToast?.error?.('Evaluation failed. Using fallback evaluation.');
        } finally {
            setIsEvaluating(false);
        }
    };

    const loadSampleAnswer = () => {
        setUserAnswer('In my previous role at Apex Logistics, our team struggled with delayed vendor responses that created cross-departmental bottlenecks. To fix this, I established a standardized 4-tier intake SLA matrix with automated escalation thresholds. By eliminating handoff ambiguity and tracking metrics on a weekly dashboard, we shortened our turnaround cycle by 32% while maintaining 99.4% client SLA compliance.');
        setSpeakingSeconds(34);
    };

    return (
        <Card variant="elevated" style={styles.card}>
            <View style={styles.headerRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                    <Sparkles size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            1. AI Mock Interview Simulator
                        </Text>
                        <Badge variant="success" size="sm">VOICE & TEXT</Badge>
                        <Badge variant="info" size="sm">FREE TRIAL · LITE · ACTIVE SEARCH</Badge>
                    </View>
                    <Text style={[styles.sub, { color: colors.textSecondary }]}>
                        Practice real interview questions derived from your target job description with instant AI scoring on answer quality, STAR structure, and pacing.
                    </Text>
                </View>
            </View>

            {/* Question Selector Tabs */}
            <View style={styles.questionTabsRow}>
                {questions.map((q, idx) => (
                    <TouchableOpacity
                        key={q.id}
                        style={[
                            styles.questionTabBtn,
                            selectedQuestionIdx === idx && styles.questionTabBtnActive,
                            { borderColor: isDark ? '#1E293B' : '#E2E8F0' }
                        ]}
                        onPress={() => {
                            setSelectedQuestionIdx(idx);
                            setEvaluationResult(null);
                        }}
                    >
                        <Text style={[
                            styles.questionTabNumber,
                            selectedQuestionIdx === idx ? { color: '#FFFFFF' } : { color: colors.textSecondary }
                        ]}>
                            Q{idx + 1}
                        </Text>
                        <Text numberOfLines={1} style={[
                            styles.questionTabLabel,
                            selectedQuestionIdx === idx ? { color: '#FFFFFF' } : { color: colors.textPrimary }
                        ]}>
                            {q.category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Current Question Box */}
            <View style={[styles.promptBox, { backgroundColor: isDark ? '#141E2E' : '#F8FAFC', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Badge variant="warning" size="sm">TARGET QUESTION</Badge>
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>Role: {targetRole}</Text>
                </View>
                <Text style={[styles.promptText, { color: colors.textPrimary }]}>
                    "{currentQ.text}"
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    <Text style={{ fontSize: 10.5, fontWeight: '700', color: colors.textSecondary }}>Target Keywords to Hit:</Text>
                    {currentQ.targetKeywords.map((kw, kIdx) => (
                        <View key={kIdx} style={[styles.kwTag, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                            <Text style={{ fontSize: 10, color: colors.textPrimary }}>{kw}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Mode Selector & Recording Controls */}
            <View style={styles.controlsRow}>
                <View style={styles.modeGroup}>
                    <TouchableOpacity
                        style={[styles.modeBtn, mode === 'voice' && styles.modeBtnActive]}
                        onPress={() => setMode('voice')}
                    >
                        <Mic size={13} color={mode === 'voice' ? '#FFFFFF' : colors.textPrimary} />
                        <Text style={[styles.modeText, mode === 'voice' && { color: '#FFFFFF' }]}>Voice Mode</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeBtn, mode === 'text' && styles.modeBtnActive]}
                        onPress={() => setMode('text')}
                    >
                        <Send size={13} color={mode === 'text' ? '#FFFFFF' : colors.textPrimary} />
                        <Text style={[styles.modeText, mode === 'text' && { color: '#FFFFFF' }]}>Text Mode</Text>
                    </TouchableOpacity>
                </View>

                {mode === 'voice' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity
                            style={[
                                styles.recordBtn,
                                isListening ? styles.recordBtnRecording : { backgroundColor: '#10B981' }
                            ]}
                            onPress={toggleListening}
                        >
                            {isListening ? <MicOff size={16} color="#FFFFFF" /> : <Mic size={16} color="#FFFFFF" />}
                            <Text style={styles.recordBtnText}>
                                {isListening ? `Stop Recording (${speakingSeconds}s)` : 'Speak Your Answer'}
                            </Text>
                        </TouchableOpacity>
                        {!isListening && (
                            <TouchableOpacity onPress={loadSampleAnswer} style={{ padding: 6 }}>
                                <Text style={{ fontSize: 11, color: '#10B981', textDecorationLine: 'underline' }}>
                                    Load Sample Response
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity onPress={loadSampleAnswer} style={{ padding: 6 }}>
                        <Text style={{ fontSize: 11, color: '#10B981', textDecorationLine: 'underline' }}>
                            Load Sample Response
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Answer Input Box */}
            <View style={[styles.inputBox, { borderColor: isDark ? '#1E293B' : '#E2E8F0', backgroundColor: isDark ? '#0B1120' : '#FFFFFF' }]}>
                <TextInput
                    multiline
                    numberOfLines={4}
                    placeholder="Your spoken or typed answer appears here. Practice using the STAR methodology (Situation, Task, Action, Result)..."
                    placeholderTextColor={colors.textSecondary}
                    value={userAnswer}
                    onChangeText={setUserAnswer}
                    style={[styles.textInput, { color: colors.textPrimary }]}
                />
            </View>

            {/* Action Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                    Words: {userAnswer.trim().split(/\s+/).filter(Boolean).length} · Spoken: {speakingSeconds}s
                </Text>
                <Button
                    variant="primary"
                    size="sm"
                    iconLeft={isEvaluating ? undefined : Award}
                    onPress={handleRunEvaluation}
                    disabled={isEvaluating}
                    style={{ backgroundColor: '#10B981' }}
                >
                    {isEvaluating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        'Evaluate Answer with AI'
                    )}
                </Button>
            </View>

            {/* Evaluation Results Card */}
            {evaluationResult && (
                <View style={[styles.evalBox, { backgroundColor: isDark ? '#141E2E' : '#ECFDF5', borderColor: '#10B98140' }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Award size={18} color="#10B981" />
                            <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>
                                Interview Score: {evaluationResult.score}/100
                            </Text>
                            <Badge variant={evaluationResult.score >= 80 ? 'success' : 'warning'} size="sm">
                                {evaluationResult.score >= 80 ? 'EXECUTIVE READY' : 'STRONG POTENTIAL'}
                            </Badge>
                        </View>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                            Pacing: ~{evaluationResult.wpm} WPM · Fillers: {evaluationResult.fillerCount}
                        </Text>
                    </View>

                    {/* STAR Method Verification */}
                    <View style={styles.starRow}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary, width: '100%', marginBottom: 4 }}>
                            STAR Method Verification:
                        </Text>
                        <View style={[styles.starPill, evaluationResult.starCheck?.situation && styles.starPillActive]}>
                            <Text style={styles.starText}>S (Situation) {evaluationResult.starCheck?.situation ? '✓' : '✗'}</Text>
                        </View>
                        <View style={[styles.starPill, evaluationResult.starCheck?.task && styles.starPillActive]}>
                            <Text style={styles.starText}>T (Task) {evaluationResult.starCheck?.task ? '✓' : '✗'}</Text>
                        </View>
                        <View style={[styles.starPill, evaluationResult.starCheck?.action && styles.starPillActive]}>
                            <Text style={styles.starText}>A (Action) {evaluationResult.starCheck?.action ? '✓' : '✗'}</Text>
                        </View>
                        <View style={[styles.starPill, evaluationResult.starCheck?.result && styles.starPillActive]}>
                            <Text style={styles.starText}>R (Result) {evaluationResult.starCheck?.result ? '✓' : '✗'}</Text>
                        </View>
                    </View>

                    {/* Keyword Coverage */}
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                            Keywords Captured:
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                            {evaluationResult.keywordsUsed?.map((kw, idx) => (
                                <View key={idx} style={[styles.kwPill, { backgroundColor: '#10B98120', borderColor: '#10B981' }]}>
                                    <Text style={{ fontSize: 10.5, color: '#10B981', fontWeight: '700' }}>✓ {kw}</Text>
                                </View>
                            ))}
                            {evaluationResult.keywordsMissing?.map((kw, idx) => (
                                <View key={idx} style={[styles.kwPill, { backgroundColor: '#EF444415', borderColor: '#EF4444' }]}>
                                    <Text style={{ fontSize: 10.5, color: '#EF4444', fontWeight: '700' }}>✗ Missing: {kw}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Pacing Feedback */}
                    <View style={{ marginTop: 8, padding: 8, borderRadius: 6, backgroundColor: isDark ? '#0B1120' : '#F1F5F9' }}>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                            🎙️ <Text style={{ fontWeight: '700' }}>Pacing & Delivery:</Text> {evaluationResult.pacingFeedback}
                        </Text>
                    </View>

                    {/* Model Answer */}
                    {evaluationResult.modelAnswer && (
                        <View style={{ marginTop: 8, padding: 10, borderRadius: 8, backgroundColor: isDark ? '#0B1120' : '#FFFFFF', borderWidth: 1, borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981', marginBottom: 4 }}>
                                💡 Recommended Answer (Tailored to Your Real Experience):
                            </Text>
                            <Text style={{ fontSize: 11, lineHeight: 16, color: colors.textPrimary, fontStyle: 'italic' }}>
                                "{evaluationResult.modelAnswer}"
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12
    },
    headerRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 12
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight: '800'
    },
    sub: {
        fontSize: 11.5,
        lineHeight: 16,
        marginTop: 3
    },
    questionTabsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
        flexWrap: 'wrap'
    },
    questionTabBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1
    },
    questionTabBtnActive: {
        backgroundColor: '#10B981',
        borderColor: '#10B981'
    },
    questionTabNumber: {
        fontSize: 11,
        fontWeight: '800'
    },
    questionTabLabel: {
        fontSize: 11,
        fontWeight: '600'
    },
    promptBox: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 12
    },
    promptText: {
        fontSize: 12.5,
        fontWeight: '700',
        lineHeight: 18
    },
    kwTag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
        gap: 8
    },
    modeGroup: {
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 2
    },
    modeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6
    },
    modeBtnActive: {
        backgroundColor: '#10B981'
    },
    modeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B'
    },
    recordBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    recordBtnRecording: {
        backgroundColor: '#EF4444'
    },
    recordBtnText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700'
    },
    inputBox: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 8
    },
    textInput: {
        fontSize: 12,
        lineHeight: 18,
        minHeight: 70,
        textAlignVertical: 'top'
    },
    evalBox: {
        marginTop: 14,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1
    },
    starRow: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 6
    },
    starPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        backgroundColor: '#CBD5E1',
        marginRight: 4
    },
    starPillActive: {
        backgroundColor: '#10B981'
    },
    starText: {
        fontSize: 10.5,
        fontWeight: '800',
        color: '#FFFFFF'
    },
    kwPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1
    }
});
