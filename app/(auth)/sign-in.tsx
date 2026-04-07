import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { C } from '@/src/constants/Colors';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (e) { console.error(e); }
  }, []);

  return (
    <View style={s.container}>
      <View style={s.logo}>
        <Text style={s.logoText}>unbuilt</Text>
        <Text style={s.tagline}>for vibecoders</Text>
      </View>

      <View style={s.buttons}>
        <TouchableOpacity style={s.googleBtn} onPress={onGoogleSignIn}>
          <Text style={s.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={s.terms}>
          By continuing you agree to our Terms of Service
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between', padding: 32, paddingTop: 120, paddingBottom: 60 },
  logo: { alignItems: 'center', gap: 8 },
  logoText: { fontSize: 48, fontWeight: '700', color: C.accent, letterSpacing: -2 },
  tagline: { fontSize: 16, color: C.textSub },
  buttons: { gap: 16 },
  googleBtn: { backgroundColor: C.accent, borderRadius: 14, padding: 18, alignItems: 'center' },
  googleBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  terms: { color: C.textTert, fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
