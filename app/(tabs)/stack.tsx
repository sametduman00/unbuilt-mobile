import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import * as Haptics from 'expo-haptics';
import { C, API } from '@/src/constants/Colors';

const BUDGETS = [
  { id: 'bootstrap', label: 'Bootstrap', sub: '$0-500/mo' },
  { id: 'growing', label: 'Growing', sub: '$500-2k/mo' },
  { id: 'funded', label: 'Funded', sub: '$2k+/mo' },
];
const LEVELS = [
  { id: 'nocode', label: 'No-code' },
  { id: 'lowcode', label: 'Low-code' },
  { id: 'developer', label: 'Developer' },
];

export default function StackScreen() {
  const { getToken } = useAuth();
  const [idea, setIdea] = useState('');
  const [budget, setBudget] = useState('bootstrap');
  const [level, setLevel] = useState('developer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!idea.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/stack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idea: idea.trim(), budget, techLevel: level, platform: 'both' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Hata');
      setResult(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      setError(e.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Get my Stack</Text>
        <Text style={s.sub}>Tech recommendations for your idea</Text>

        <TextInput
          style={s.input}
          placeholder="e.g. Marketplace for local freelancers"
          placeholderTextColor={C.textTert}
          value={idea} onChangeText={setIdea}
          multiline maxLength={500}
        />

        <Text style={s.label}>Budget</Text>
        <View style={s.chips}>
          {BUDGETS.map(b => (
            <TouchableOpacity key={b.id} style={[s.chip, budget === b.id && s.chipActive]} onPress={() => setBudget(b.id)}>
              <Text style={[s.chipText, budget === b.id && s.chipTextActive]}>{b.label}</Text>
              <Text style={[s.chipSub, budget === b.id && s.chipTextActive]}>{b.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Tech Level</Text>
        <View style={s.chips}>
          {LEVELS.map(l => (
            <TouchableOpacity key={l.id} style={[s.chip, level === l.id && s.chipActive]} onPress={() => setLevel(l.id)}>
              <Text style={[s.chipText, level === l.id && s.chipTextActive]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[s.btn, loading && s.btnDim]} onPress={analyze} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Build my stack →</Text>}
        </TouchableOpacity>

        {error ? <Text style={s.error}>{error}</Text> : null}

        {result?.phases?.map((phase: any, i: number) => (
          <View key={i} style={s.phase}>
            <Text style={s.phaseName}>{phase.name}</Text>
            <Text style={s.phaseSub}>{phase.subtitle}</Text>
            <Text style={s.phaseTotal}>Total: {phase.costs?.total}</Text>
            {phase.tools?.map((tool: any, j: number) => (
              <View key={j} style={s.tool}>
                <View style={s.toolHead}>
                  <Text style={s.toolName}>{tool.name}</Text>
                  <Text style={[s.toolPrice, tool.free && s.toolFree]}>{tool.free ? 'Free' : tool.price}</Text>
                </View>
                <Text style={s.toolPurpose}>{tool.purpose}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, paddingTop: 64 },
  title: { fontSize: 28, fontWeight: '700', color: C.text, marginBottom: 4 },
  sub: { fontSize: 14, color: C.textSub, marginBottom: 24 },
  input: { backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: 12, padding: 16, color: C.text, fontSize: 16, minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: C.textSub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  chip: { backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  chipActive: { backgroundColor: C.accentDim, borderColor: C.accent },
  chipText: { color: C.textSub, fontSize: 14, fontWeight: '500' },
  chipSub: { color: C.textTert, fontSize: 11 },
  chipTextActive: { color: C.accent },
  btn: { backgroundColor: C.accent, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 24 },
  btnDim: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  error: { color: C.red, fontSize: 14, marginBottom: 16 },
  phase: { backgroundColor: C.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border, gap: 8 },
  phaseName: { fontSize: 16, fontWeight: '700', color: C.accent },
  phaseSub: { fontSize: 13, color: C.textSub },
  phaseTotal: { fontSize: 13, color: C.green, fontWeight: '600' },
  tool: { backgroundColor: C.bg, borderRadius: 8, padding: 12, gap: 4 },
  toolHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toolName: { fontSize: 14, fontWeight: '600', color: C.text },
  toolPrice: { fontSize: 12, color: C.orange, fontWeight: '500' },
  toolFree: { color: C.green },
  toolPurpose: { fontSize: 12, color: C.textSub },
});
