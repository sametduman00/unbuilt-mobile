import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ActivityIndicator, Image, RefreshControl, FlatList,
} from 'react-native';
import { C, API } from '@/src/constants/Colors';

type Tab = 'ph' | 'appstore';

export default function PulseScreen() {
  const [tab, setTab] = useState<Tab>('appstore');
  const [phData, setPhData] = useState<any[]>([]);
  const [asData, setAsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPH = useCallback(async () => {
    const res = await fetch(`${API}/api/pulse`);
    const data = await res.json();
    setPhData((data.signals ?? []).filter((s: any) => s.source === 'producthunt'));
  }, []);

  const fetchAS = useCallback(async () => {
    const res = await fetch(`${API}/api/pulse/appstore`);
    const data = await res.json();
    const apps = (data.days ?? []).flatMap((d: any) => d.apps ?? []);
    setAsData(apps);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPH(), fetchAS()]).finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await (tab === 'ph' ? fetchPH() : fetchAS());
    setRefreshing(false);
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Pulse</Text>
        <View style={s.tabs}>
          {(['appstore', 'ph'] as Tab[]).map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === 'appstore' ? 'App Store' : 'Product Hunt'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={C.accent} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={tab === 'ph' ? phData : asData}
          keyExtractor={(_, i) => String(i)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
          contentContainerStyle={s.list}
          renderItem={({ item }) => tab === 'ph' ? <PHCard item={item} /> : <ASCard item={item} />}
          ListEmptyComponent={<Text style={s.empty}>Veri yok</Text>}
        />
      )}
    </View>
  );
}

function PHCard({ item }: { item: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity style={s.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
      <View style={s.cardHead}>
        {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={s.thumb} /> : <View style={[s.thumb, { backgroundColor: C.accentDim }]} />}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={s.cardSub} numberOfLines={1}>{item.subtitle}</Text>
          {item.topics?.length > 0 && (
            <View style={s.topicRow}>
              {item.topics.slice(0, 3).map((t: string, i: number) => (
                <Text key={i} style={s.topic}>{t}</Text>
              ))}
            </View>
          )}
        </View>
      </View>
      {expanded && item.tagline && <Text style={s.tagline}>{item.tagline}</Text>}
    </TouchableOpacity>
  );
}

function ASCard({ item }: { item: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity style={s.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
      <View style={s.cardHead}>
        {item.icon_url ? <Image source={{ uri: item.icon_url }} style={s.iconImg} /> : <View style={[s.iconImg, { backgroundColor: C.surface }]} />}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.cardTitle} numberOfLines={1}>{item.app_name}</Text>
          <Text style={s.cardSub} numberOfLines={1}>{item.developer} · {item.category}</Text>
          <View style={s.topicRow}>
            <Text style={[s.topic, item.price !== 'Free' && { color: C.orange }]}>{item.price}</Text>
            {item.claude_difficulty && <Text style={s.topic}>{item.claude_difficulty}</Text>}
          </View>
        </View>
      </View>
      {expanded && (
        <>
          {item.claude_what && <Text style={s.tagline}>{item.claude_what}</Text>}
          {item.screenshot_urls?.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {item.screenshot_urls.map((url: string, i: number) => (
                <Image key={i} source={{ uri: url }} style={s.screenshot} resizeMode="cover" />
              ))}
            </ScrollView>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 0 },
  title: { fontSize: 28, fontWeight: '700', color: C.text, marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.border },
  tabActive: { backgroundColor: C.accentDim, borderColor: C.accent },
  tabText: { color: C.textSub, fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: C.accent },
  list: { padding: 16, paddingTop: 12, gap: 10 },
  empty: { color: C.textTert, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: C.border, gap: 10 },
  cardHead: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  thumb: { width: 52, height: 52, borderRadius: 10 },
  iconImg: { width: 52, height: 52, borderRadius: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: C.text },
  cardSub: { fontSize: 12, color: C.textSub },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  topic: { fontSize: 11, color: C.accent, backgroundColor: C.accentDim, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  tagline: { fontSize: 13, color: C.textSub, lineHeight: 20 },
  screenshot: { width: 120, height: 200, borderRadius: 8, marginRight: 8 },
});
