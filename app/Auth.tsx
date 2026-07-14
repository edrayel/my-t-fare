import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space, shadows } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { CTA } from '../components/CTA';
import { Keypad } from '../components/Keypad';
import { PinDots } from '../components/PinDots';
import { Gradient } from '../components/Gradient';
import { SLIDES, ROLES, useAppStore } from '../store/useAppStore';
import { bioAuth } from '../lib/biometric';

/* ---------------- Onboarding ---------------- */
export function Onboarding({ navigation }: any) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.skip} onPress={() => navigation.navigate('role')}>
        <Text style={styles.skipT}>Skip</Text>
      </TouchableOpacity>
      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.slideCard}>
              <Gradient colors={['#0a4030', '#00AC57']} angle={160} />
              <View style={styles.slideTile}>
                <Icon name={item.icon} size={56} stroke={colors.paper} sw={1.8} />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideBody}>{item.body}</Text>
            </View>
          </View>
        )}
        keyExtractor={(_, idx) => String(idx)}
      />
      <View style={styles.dots}>
        {SLIDES.map((_, idx) => (
          <View key={idx} style={[styles.dot, idx === i ? styles.dotA : styles.dotI]} />
        ))}
      </View>
      <View style={styles.ctaWrap}>
        <CTA
          label={last ? 'Get started' : 'Next'}
          onPress={() => (last ? navigation.navigate('role') : setI(i + 1))}
        />
      </View>
    </View>
  );
}

/* ---------------- Role select ---------------- */
export function RoleSelect({ navigation }: any) {
  const [sel, setSel] = useState<string | null>(null);
  const setRole = useAppStore((s) => s.setRole);
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.pad}>
        <Text style={typography.screenTitle}>How do you use My T-Fare?</Text>
        <Text style={[typography.body, styles.sub]}>One platform · different experiences</Text>
        <View style={{ marginTop: 18, gap: 12 }}>
          {ROLES.map((r) => {
            const on = sel === r.key;
            return (
              <TouchableOpacity
                key={r.key}
                activeOpacity={0.9}
                onPress={() => setSel(r.key)}
                style={[styles.role, on && styles.roleOn]}
              >
                <View style={[styles.roleIcon, on && styles.roleIconOn]}>
                  <Icon name={r.icon} size={22} stroke={on ? colors.lime : colors.green} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.roleLabel}>{r.key}</Text>
                  <Text style={styles.roleDesc}>{r.desc}</Text>
                </View>
                <View style={[styles.check, on && styles.checkOn]}>
                  {on && <Icon name="check" size={14} stroke={colors.green} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.ctaWrap}>
        <CTA
          label={sel ? `Continue as ${sel}` : 'Continue'}
          disabled={!sel}
          onPress={() => {
            if (sel) setRole(sel as any);
            navigation.navigate('signin');
          }}
        />
      </View>
    </View>
  );
}

/* ---------------- Sign in ---------------- */
export function SignIn({ navigation }: any) {
  const [pin, setPin] = useState('');
  const signIn = useAppStore((s) => s.signIn);
  const flashToast = useAppStore((s) => s.flashToast);
  const toggleBio = useAppStore((s) => s.toggleBio);
  const go = () => {
    signIn();
    navigation.navigate('(tabs)');
  };
  const onKey = (k: string) =>
    setPin((p) => {
      if (p.length >= 4) return p;
      const next = p + k;
      if (next.length === 4) setTimeout(go, 320);
      return next;
    });
  const bio = async () => {
    toggleBio(true);
    const ok = await bioAuth('Sign in to My T-Fare');
    toggleBio(false);
    if (ok) go();
    else flashToast('Biometric not available');
  };
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.pad}>
        <Text style={typography.screenTitle}>Welcome back</Text>
        <Text style={[typography.body, styles.sub]}>Sign in to keep moving cashless</Text>
        <View style={styles.phoneRow}>
          <View style={styles.prefix}>
            <Text style={styles.flag}>🇳🇬</Text>
            <Text style={styles.prefixT}>+234</Text>
          </View>
          <TextInput style={styles.phoneInput} defaultValue="803 124 9920" editable={false} showSoftInputOnFocus={false} />
        </View>
            <View style={{ marginTop: 22 }}>
              <PinDots pin={pin} />
            </View>
        <View style={styles.keypadWrap}>
          <Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} />
        </View>
        <TouchableOpacity style={styles.finger} onPress={bio}>
          <Icon name="finger" size={26} stroke={colors.green} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
          <Text style={styles.footer}>New to My T-Fare? <Text style={styles.link}>Create account</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- Sign up ---------------- */
export function SignUp({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [campus, setCampus] = useState<string | null>(null);
  const signIn = useAppStore((s) => s.signIn);
  const C = ['UNILAG', 'LASU', 'UNIPORT', 'UI Ibadan', 'UNIBEN'];
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <StatusBar style="dark" />
      <Text style={typography.screenTitle}>Create your account</Text>
      <Text style={[typography.body, styles.sub]}>Join thousands riding cashless across Nigeria</Text>
      <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.mut} value={name} onChangeText={setName} />
      <View style={styles.phoneRow}>
        <View style={styles.prefix}>
          <Text style={styles.flag}>🇳🇬</Text>
          <Text style={styles.prefixT}>+234</Text>
        </View>
        <TextInput style={styles.phoneInput} placeholder="Phone" placeholderTextColor={colors.mut} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      </View>
      <Text style={styles.fieldLabel}>Where do you ride?</Text>
      <View style={styles.chips}>
        {C.map((c) => {
          const on = campus === c;
          return (
            <TouchableOpacity key={c} style={[styles.chip, on && styles.chipOn]} onPress={() => setCampus(c)}>
              <Text style={[styles.chipT, on && styles.chipTOn]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.ctaWrap}>
        <CTA label="Create account" onPress={() => { signIn(); navigation.navigate('(tabs)'); }} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('signin')}>
        <Text style={styles.footer}>Already have an account? <Text style={styles.link}>Sign in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const W = Dimensions.get('window').width;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  pad: { paddingHorizontal: space.gutterLg, paddingTop: 64, flex: 1 },
  skip: { position: 'absolute', top: 54, right: 22, zIndex: 5 },
  skipT: { color: colors.mut, fontWeight: '600', fontFamily: 'Manrope' },
  slide: { width: W, alignItems: 'center', justifyContent: 'center', paddingTop: 50 },
  slideCard: {
    width: W - 56,
    height: 460,
    borderRadius: 26,
    backgroundColor: colors.green,
    padding: 28,
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  slideTile: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  slideTitle: { color: colors.paper, fontSize: 24, fontFamily: 'Sora', fontWeight: '700', letterSpacing: -0.5 },
  slideBody: { color: 'rgba(255,255,255,0.86)', fontSize: 15, fontFamily: 'Manrope', marginTop: 12, lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginVertical: 24 },
  dot: { height: 7, width: 7, borderRadius: 4, backgroundColor: '#d3dad4' },
  dotA: { width: 22, backgroundColor: colors.brand },
  dotI: {},
  ctaWrap: { paddingHorizontal: space.gutterLg, paddingBottom: 26 },
  sub: { marginTop: 6, marginBottom: 4 },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 14,
  },
  roleOn: { borderColor: colors.green, backgroundColor: colors.tintCard },
  roleIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.tintCard, alignItems: 'center', justifyContent: 'center' },
  roleIconOn: { backgroundColor: colors.green },
  roleLabel: { fontSize: 16, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  roleDesc: { fontSize: 13, fontFamily: 'Manrope', color: colors.sub, marginTop: 2 },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: colors.fieldEdge, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  phoneRow: { flexDirection: 'row', marginTop: 26, gap: 10 },
  prefix: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.fieldEdge, borderRadius: 14, paddingHorizontal: 14 },
  flag: { fontSize: 18 },
  prefixT: { fontSize: 16, fontFamily: 'Sora', fontWeight: '600', color: colors.ink },
  phoneInput: { flex: 1, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.fieldEdge, borderRadius: 14, paddingHorizontal: 16, fontSize: 16, color: colors.ink },
  keypadWrap: { marginTop: 30 },
  finger: { alignSelf: 'center', marginTop: 18, width: 64, height: 64, borderRadius: 32, backgroundColor: colors.tintCard, alignItems: 'center', justifyContent: 'center' },
  footer: { textAlign: 'center', marginTop: 22, color: colors.sub, fontFamily: 'Manrope', fontSize: 14 },
  link: { color: colors.brand, fontWeight: '700' },
  input: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.fieldEdge, borderRadius: 14, paddingHorizontal: 16, height: 54, marginTop: 22, fontSize: 16, color: colors.ink },
  fieldLabel: { marginTop: 22, fontSize: 15, fontFamily: 'Sora', fontWeight: '600', color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  chip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1.5, borderColor: colors.fieldEdge, backgroundColor: colors.card },
  chipOn: { borderColor: colors.brand, backgroundColor: '#E4F2EC' },
  chipT: { color: colors.ink, fontFamily: 'Manrope', fontWeight: '600' },
  chipTOn: { color: colors.brand },
});
