import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { C, API } from '@/src/constants/Colors';

export default function DigScreen() {
  const { getToken } = useAuth();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idea: idea.trim(), platform: 'mobile', budget: 'bootstrap', techLevel: 'developer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Hata');
      setResult(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      setError(e.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Dig my idea</Text>
        <Text style={s.sub}>Market gap analysis powered by AI</Text>

        <TextInput
          style={s.input}
          placeholder="e.g. AI writing tool for marketers"
          placeholderTextColor={C.textTert}
          value={idea}
          onChangeText={setIdea}
          multiline
          maxLength={500}
        />

        <TouchableOpacity style={[s.btn, loading && s.btnDim]} onPress={analyze} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>Analyze →</Text>}
        </TouchableOpacity>

        {error ? <Text style={s.error}>{error}</Text> : null}

        {result && (
          <View style={s.result}>
            <Score score={result.marketScore} label={result.marketScoreLabel} />
            <Text style={s.summary}>{result.marketScoreSummary}</Text>

            {result.painPoints?.map((p: any, i: number) => (
              <View key={i} style={s.card}>
                <Text style={[s.badge, p.severity === 'high' && s.badgeRed]}>
                  {p.severity?.toUpperCase()}
                </Text>
                <Text style={s.cardText}>"{p.quote}"</Text>
                <Text style={s.cardSrc}>{p.source}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Score({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? C.green : score >= 40 ? C.orange : C.red;
  return (
    <View style={s.scoreRow}>
      <View style={[s.scoreCircle, { borderColor: color }]}>
        <Text style={[s.scoreNum, { color }]}>{score}</Text>
      </View>
      <Text style={[s.scoreLabel, { color }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, paddingTop: 64 },
  title: { fontSize: 28, fontWeight: '700', color: C.text, marginBottom: 4 },
  sub: { fontSize: 14, color: C.textSub, marginBottom: 24 },
  input: {
    backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border,
    borderRadius: 12, padding: 16, color: C.text, fontSize: 16,
    minHeight: 80, textAlignVertical: 'top', marginBottom: 16,
  },
  btn: { backgroundColor: C.accent, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnDim: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  error: { color: C.red, fontSize: 14, marginBottom: 16 },
  result: { gap: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  scoreCircle: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  scoreNum: { fontSize: 26, fontWeight: '700' },
  scoreLabel: { fontSize: 16, fontWeight: '600', flex: 1 },
  summary: { color: C.textSub, fontSize: 14, lineHeight: 22, marginBottom: 8 },
  card: { backgroundColor: C.surface, borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: C.border, gap: 8 },
  badge: { fontSize: 11, fontWeight: '700', color: C.orange, alignSelf: 'flex-start', backgroundColor: '#2a1800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeRed: { color: C.red, backgroundColor: '#2a0000' },
  cardText: { color: C.text, fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  cardSrc: { color: C.textTert, fontSize: 12 },
});
