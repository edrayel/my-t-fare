import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius, typography, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { Header } from '../components/Header';
import { CTA } from '../components/CTA';
import { Keypad } from '../components/Keypad';
import { PinDots } from '../components/PinDots';
import { Logo } from '../components/Logo';
import { Gradient } from '../components/Gradient';
import {
  RECIPIENTS,
  useAppStore,
  type Recipient,
} from '../store/useAppStore';
import { formatKobo, kobo } from '../lib/money';
import { bioAuth } from '../lib/biometric';
import { requestQr } from '../lib/api';

/* ---------------- Gift pick ---------------- */
export function GiftPick() {
  const nav = useNavigation<any>();
  const balance = useAppStore((s) => s.balance);
  const mode = useAppStore((s) => s.giftMode);
  const setMode = useAppStore((s) => s.setGiftMode);
  const setRecipient = useAppStore((s) => s.setGiftRecipient);
  const setAmount = useAppStore((s) => s.setGiftAmount);
  const [q, setQ] = useState('');

  const pick = (r: Recipient) => {
    setRecipient(r);
    setAmount(0);
    nav.navigate('giftAmount');
  };
  const filtered = RECIPIENTS.filter((r) => {
    const s = q.toLowerCase();
    return !s || r.name.toLowerCase().includes(s) || r.phone.includes(s);
  });

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Header title={mode === 'send' ? 'Gift a friend' : 'Request T-Fare'} onBack={() => nav.navigate('(tabs)', { screen: 'home' })} />
      <View style={styles.seg}>
        <TouchableOpacity style={[styles.segBtn, mode === 'send' && styles.segOn]} onPress={() => setMode('send')}>
          <Text style={[styles.segT, mode === 'send' && styles.segTOn]}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.segBtn, mode === 'request' && styles.segOn]} onPress={() => setMode('request')}>
          <Text style={[styles.segT, mode === 'request' && styles.segTOn]}>Request</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceStrip}>
        <View>
          <Text style={styles.balanceLabel}>Your wallet balance</Text>
          <Text style={styles.balanceVal}>{formatKobo(balance)}</Text>
        </View>
        <Icon name="gift" size={26} stroke={colors.lime} />
      </View>

      <View style={styles.searchRow}>
        <Icon name="tag" size={18} stroke={colors.mut} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone"
          placeholderTextColor={colors.mut}
          value={q}
          onChangeText={setQ}
        />
      </View>
      <Text style={styles.sectionLbl}>Recent</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipients}>
        {filtered.map((r) => (
          <TouchableOpacity key={r.phone} style={styles.recip} onPress={() => pick(r)}>
            <View style={styles.recipAvatar}>
              <Text style={styles.recipT}>{r.initial}</Text>
            </View>
            <Text style={styles.recipName} numberOfLines={1}>{r.name}</Text>
            <Text style={styles.recipPhone}>{r.phone}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------------- Gift amount ---------------- */
export function GiftAmount() {
  const nav = useNavigation<any>();
  const mode = useAppStore((s) => s.giftMode);
  const recipient = useAppStore((s) => s.giftRecipient);
  const amount = useAppStore((s) => s.giftAmount);
  const setAmount = useAppStore((s) => s.setGiftAmount);
  const setNote = useAppStore((s) => s.setRequestNote);
  const setQr = useAppStore((s) => s.setRequestQr);

  const onKey = (k: string) =>
    setAmount(amount === 0 ? kobo(Number(k)) : amount + kobo(Number(k)));
  const onDelete = () => setAmount(Math.floor(amount / 10));

  const chips = mode === 'send' ? [200, 500, 1000, 2000] : [500, 1000, 2000, 5000];

  const next = async () => {
    if (mode === 'send') {
      nav.navigate('giftConfirm');
    } else {
      const { qrPayload } = await requestQr(amount || undefined);
      setQr(qrPayload);
      nav.navigate('requestSuccess');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Header title="Enter amount" onBack={() => nav.navigate('giftPick')} />
      {recipient && (
        <View style={styles.recipRow}>
          <View style={styles.recipAvatar}>
            <Text style={styles.recipT}>{recipient.initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recipName}>{recipient.name}</Text>
            <Text style={styles.recipPhone}>{recipient.phone}</Text>
          </View>
        </View>
      )}
      <View style={styles.amountBox}>
        <Text style={styles.amount}>{formatKobo(amount)}</Text>
      </View>
      <View style={styles.chips}>
        {chips.map((c) => {
          const on = amount === kobo(c);
          return (
            <TouchableOpacity key={c} style={[styles.chip, on && styles.chipOn]} onPress={() => setAmount(kobo(c))}>
              <Text style={[styles.chipT, on && styles.chipTOn]}>₦{c.toLocaleString()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {mode === 'request' && (
        <TextInput
          style={styles.note}
          placeholder="What do you need help with? (optional)"
          placeholderTextColor={colors.mut}
          onChangeText={setNote}
        />
      )}
      <View style={styles.keypad}>
        <Keypad onKey={onKey} onDelete={onDelete} />
      </View>
      <View style={styles.ctaWrap}>
        <CTA label={mode === 'send' ? 'Send' : 'Request'} disabled={!amount} onPress={next} />
      </View>
      {mode === 'request' && (
        <TouchableOpacity style={styles.qrLink} onPress={() => nav.navigate('requestQR')}>
          <Icon name="qr" size={18} stroke={colors.brand} />
          <Text style={styles.qrLinkT}>Show my QR for a nearby friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ---------------- Gift confirm ---------------- */
export function GiftConfirm() {
  const nav = useNavigation<any>();
  const recipient = useAppStore((s) => s.giftRecipient);
  const amount = useAppStore((s) => s.giftAmount);
  const completeGift = useAppStore((s) => s.completeGift);
  const toggleBio = useAppStore((s) => s.toggleBio);
  const [pin, setPin] = useState('');

  const go = () => {
    completeGift();
    nav.navigate('giftSuccess');
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
    const ok = await bioAuth('Authorise gift');
    toggleBio(false);
    if (ok) go();
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Header title="Confirm payment" onBack={() => nav.navigate('giftAmount')} />
      {recipient && (
        <View style={styles.confirmCard}>
          <View style={styles.recipAvatar}>
            <Text style={styles.recipT}>{recipient.initial}</Text>
          </View>
          <Text style={styles.recipName}>{recipient.name}</Text>
          <Text style={styles.recipPhone}>{recipient.phone}</Text>
          <Text style={styles.amount}>{formatKobo(amount)}</Text>
        </View>
      )}
      <PinDots pin={pin} />
      <View style={styles.keypad}>
        <Keypad onKey={onKey} onDelete={() => setPin((p) => p.slice(0, -1))} />
      </View>
      <TouchableOpacity style={styles.finger} onPress={bio}>
        <Icon name="finger" size={24} stroke={colors.green} />
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- Gift success ---------------- */
export function GiftSuccess() {
  const nav = useNavigation<any>();
  const recipient = useAppStore((s) => s.giftRecipient);
  const amount = useAppStore((s) => s.giftAmount);
  const giftRef = useAppStore((s) => s.giftRef);
  const balance = useAppStore((s) => s.balance);
  const setRecipient = useAppStore((s) => s.setGiftRecipient);
  const setAmount = useAppStore((s) => s.setGiftAmount);

  const reset = () => {
    setRecipient(null);
    setAmount(0);
    nav.navigate('giftPick');
  };

  return (
    <View style={styles.giftSuccess}>
      <Gradient colors={['#00AC57', '#0a4030']} angle={160} />
      <StatusBar style="light" />
      <View style={styles.giftCheck}>
        <Icon name="gift" size={44} stroke={colors.lime} sw={2} />
      </View>
      <Text style={styles.gsTitle}>Gift sent</Text>
      <Text style={styles.gsAmount}>{formatKobo(amount)}</Text>
      <Text style={styles.gsSub}>
        to {recipient?.name} · {recipient?.phone}
      </Text>
      <View style={styles.gsRows}>
        <View style={styles.gsRow}>
          <Text style={styles.gsLabel}>Reference</Text>
          <Text style={styles.gsValue}>{giftRef}</Text>
        </View>
        <View style={styles.gsRow}>
          <Text style={styles.gsLabel}>New balance</Text>
          <Text style={[styles.gsValue, { color: colors.lime }]}>{formatKobo(balance)}</Text>
        </View>
      </View>
      <View style={styles.gsBtns}>
        <CTA label="Send another gift" variant="outline" onPress={reset} />
        <View style={{ height: 12 }} />
        <CTA label="Done" variant="lime" onPress={() => nav.navigate('(tabs)', { screen: 'home' })} />
      </View>
    </View>
  );
}

/* ---------------- Request success ---------------- */
export function RequestSuccess() {
  const nav = useNavigation<any>();
  const recipient = useAppStore((s) => s.giftRecipient);
  const amount = useAppStore((s) => s.giftAmount);
  const note = useAppStore((s) => s.requestNote);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingTop: 70 }}>
      <StatusBar style="dark" />
      <Header title="Request" onBack={() => nav.navigate('giftPick')} />
      <View style={styles.reqCircle}>
        <Icon name="gift" size={40} stroke={colors.lime} sw={2} />
      </View>
      <Text style={styles.reqTitle}>Request sent</Text>
      <Text style={styles.reqAmount}>{formatKobo(amount)}</Text>
      <Text style={styles.reqSub}>requested from {recipient?.name}</Text>
      <View style={styles.reqRows}>
        <View style={styles.reqRow}>
          <Text style={styles.reqLabel}>To</Text>
          <Text style={styles.reqValue}>{recipient?.phone}</Text>
        </View>
        {note ? (
          <View style={styles.reqRow}>
            <Text style={styles.reqLabel}>Note</Text>
            <Text style={styles.reqValue}>{note}</Text>
          </View>
        ) : null}
        <View style={styles.reqRow}>
          <Text style={styles.reqLabel}>Reference</Text>
          <Text style={styles.reqValue}>MTF-REQ</Text>
        </View>
        <View style={styles.reqRow}>
          <Text style={styles.reqLabel}>Status</Text>
          <View style={styles.pendingPill}>
            <Text style={styles.pendingT}>Pending</Text>
          </View>
        </View>
      </View>
      <View style={styles.ctaWrap}>
        <CTA label="Done" onPress={() => nav.navigate('(tabs)', { screen: 'home' })} />
      </View>
    </ScrollView>
  );
}

/* ---------------- Request QR ---------------- */
export function RequestQR() {
  const nav = useNavigation<any>();
  const amount = useAppStore((s) => s.giftAmount);
  const qr = useAppStore((s) => s.requestQrPayload);

  return (
    <View style={styles.reqQr}>
      <StatusBar style="light" />
      <Header title="My request QR" onBack={() => nav.navigate('giftAmount')} />
      <Text style={styles.rqName}>Ada Nwosu</Text>
      <Text style={styles.rqSub}>Have a friend scan to gift you instantly</Text>
      <View style={styles.qrFrame}>
        <View style={styles.qrFinders}>
          <View style={[styles.finder, styles.fTL]} />
          <View style={[styles.finder, styles.fTR]} />
          <View style={[styles.finder, styles.fBL]} />
        </View>
        <QRCode value={qr || 'mytfare://request'} size={150} backgroundColor="white" color={colors.ink} />
        <View style={styles.qrMonogram}>
          <Logo size={34} />
        </View>
      </View>
      {amount > 0 && (
        <View style={styles.reqChip}>
          <Text style={styles.reqChipT}>Requesting {formatKobo(amount)}</Text>
        </View>
      )}
      <View style={styles.qrPulse}>
        <View style={styles.qrDot} />
        <Text style={styles.qrPulseT}>Ready to scan · nearby</Text>
      </View>
      <View style={styles.ctaWrap}>
        <CTA label="Share request link" variant="lime" onPress={() => nav.navigate('giftPick')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  seg: { flexDirection: 'row', gap: 8, paddingHorizontal: space.gutter, marginTop: 10 },
  segBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  segOn: { backgroundColor: colors.green },
  segT: { textAlign: 'center', fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  segTOn: { color: '#fff' },
  balanceStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: space.gutter, marginTop: 16, backgroundColor: colors.greenDeep, borderRadius: radius.card, padding: 16 },
  balanceLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12.5, fontFamily: 'Manrope' },
  balanceVal: { color: '#fff', fontSize: 22, fontFamily: 'Sora', fontWeight: '700', marginTop: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: space.gutter, marginTop: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontSize: 14, color: colors.ink, fontFamily: 'Manrope' },
  sectionLbl: { paddingHorizontal: space.gutter, marginTop: 18, fontSize: 13, fontFamily: 'Manrope', fontWeight: '700', color: colors.sub },
  recipients: { gap: 14, paddingHorizontal: space.gutter, paddingTop: 12 },
  recip: { width: 92, alignItems: 'center' },
  recipAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  recipT: { color: '#fff', fontSize: 22, fontFamily: 'Sora', fontWeight: '700' },
  recipName: { fontSize: 13, fontFamily: 'Sora', fontWeight: '600', color: colors.ink, marginTop: 8, width: 92, textAlign: 'center' },
  recipPhone: { fontSize: 11.5, color: colors.sub, fontFamily: 'Manrope', marginTop: 2 },
  recipRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: space.gutter, marginTop: 10, backgroundColor: colors.card, borderRadius: radius.card, padding: 14, borderWidth: 1, borderColor: colors.line },
  amountBox: { alignItems: 'center', marginTop: 18 },
  amount: { ...typography.amount, fontSize: 46 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', paddingHorizontal: space.gutter, marginTop: 14 },
  chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.fieldEdge, backgroundColor: colors.card },
  chipOn: { borderColor: colors.brand, backgroundColor: colors.tintCard },
  chipT: { color: colors.ink, fontFamily: 'Sora', fontWeight: '700' },
  chipTOn: { color: colors.brand },
  note: { marginHorizontal: space.gutter, marginTop: 16, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.fieldEdge, borderRadius: 14, paddingHorizontal: 16, height: 50, fontSize: 14, color: colors.ink },
  keypad: { marginTop: 18, paddingHorizontal: space.gutter },
  ctaWrap: { paddingHorizontal: space.gutter, marginTop: 18 },
  confirmCard: { alignItems: 'center', backgroundColor: colors.card, marginHorizontal: space.gutter, borderRadius: radius.card, padding: 20, marginTop: 10, borderWidth: 1, borderColor: colors.line },
  finger: { alignSelf: 'center', marginTop: 14, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.tintCard, alignItems: 'center', justifyContent: 'center' },
  giftSuccess: { flex: 1, backgroundColor: colors.green, alignItems: 'center', paddingTop: 96, paddingHorizontal: space.gutterLg },
  giftCheck: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(199,240,63,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  gsTitle: { color: colors.paper, fontSize: 24, fontFamily: 'Sora', fontWeight: '700' },
  gsAmount: { color: colors.lime, fontSize: 44, fontFamily: 'Sora', fontWeight: '700', letterSpacing: -1, marginTop: 8 },
  gsSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: 'Manrope', marginTop: 4 },
  gsRows: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.card, paddingHorizontal: 18, marginTop: 28 },
  gsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)' },
  gsLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Manrope' },
  gsValue: { color: '#fff', fontFamily: 'Sora', fontWeight: '600', fontSize: 14 },
  gsBtns: { width: '100%', marginTop: 24 },
  reqCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 20 },
  reqTitle: { textAlign: 'center', marginTop: 18, fontSize: 22, fontFamily: 'Sora', fontWeight: '700', color: colors.ink },
  reqAmount: { textAlign: 'center', marginTop: 6, fontSize: 40, fontFamily: 'Sora', fontWeight: '700', color: colors.ink, letterSpacing: -1 },
  reqSub: { textAlign: 'center', color: colors.sub, fontSize: 14, fontFamily: 'Manrope' },
  reqRows: { marginHorizontal: space.gutter, marginTop: 18, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16 },
  reqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.rowDivider },
  reqLabel: { color: colors.sub, fontSize: 13, fontFamily: 'Manrope' },
  reqValue: { color: colors.ink, fontFamily: 'Sora', fontWeight: '600', fontSize: 14 },
  pendingPill: { backgroundColor: colors.statusPendingBg, borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 12 },
  pendingT: { color: colors.statusPending, fontFamily: 'Sora', fontWeight: '700', fontSize: 12 },
  reqQr: { flex: 1, backgroundColor: colors.greenDark, alignItems: 'center', paddingTop: 60, paddingHorizontal: space.gutterLg },
  rqName: { color: colors.paper, fontSize: 20, fontFamily: 'Sora', fontWeight: '700', marginTop: 56 },
  rqSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Manrope', marginTop: 4, marginBottom: 24 },
  qrFrame: { width: 210, height: 210, backgroundColor: '#fff', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  qrFinders: { ...StyleSheet.absoluteFill },
  finder: { position: 'absolute', width: 34, height: 34, borderColor: colors.ink, borderWidth: 4 },
  fTL: { top: 10, left: 10, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 8 },
  fTR: { top: 10, right: 10, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 8 },
  fBL: { bottom: 10, left: 10, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 8 },
  qrMonogram: { position: 'absolute', width: 44, height: 44, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  reqChip: { backgroundColor: colors.lime, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 16, marginTop: 18 },
  reqChipT: { color: colors.ink, fontFamily: 'Sora', fontWeight: '700', fontSize: 14 },
  qrPulse: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22 },
  qrDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.lime },
  qrPulseT: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Manrope' },
  qrLink: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 16 },
  qrLinkT: { color: colors.brand, fontFamily: 'Manrope', fontWeight: '600', fontSize: 13.5 },
});
