import { useAuth, useUser } from '@clerk/clerk-expo';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { C } from '@/src/constants/Colors';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert('Çıkış yap', 'Emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış yap', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Profile</Text>
      </View>

      <View style={s.card}>
        {user?.imageUrl
          ? <Image source={{ uri: user.imageUrl }} style={s.avatar} />
          : <View style={s.avatarPlaceholder}><Text style={s.avatarInitial}>{user?.firstName?.[0] ?? '?'}</Text></View>
        }
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{user?.fullName ?? 'User'}</Text>
          <Text style={s.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>About</Text>
        <InfoRow label="Version" value="1.0.0" />
        <InfoRow label="Plan" value="Free" />
      </View>

      <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
        <Text style={s.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '700', color: C.text },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: C.border, marginBottom: 24 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.accentDim, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 24, fontWeight: '700', color: C.accent },
  name: { fontSize: 17, fontWeight: '600', color: C.text },
  email: { fontSize: 13, color: C.textSub },
  section: { marginHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: C.textSub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  rowLabel: { fontSize: 15, color: C.text },
  rowValue: { fontSize: 15, color: C.textSub },
  signOutBtn: { marginHorizontal: 20, backgroundColor: C.surface, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 0.5, borderColor: C.red },
  signOutText: { color: C.red, fontSize: 17, fontWeight: '600' },
});
