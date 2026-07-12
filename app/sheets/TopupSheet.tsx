import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, typography, space } from '../../theme/tokens';
import { CTA } from '../../components/CTA';
import { METHODS, useAppStore } from '../../store/useAppStore';
import { formatKobo, kobo } from '../../lib/money';

const CHIPS = [500, 1000, 2000, 5000];

export function TopupSheet({ onDone }: { onDone: () => void }) {
  const [amount, setAmount] = useState(kobo(2000));
  const [method, setMethod] = useState(METHODS[0].label);
  const confirmTopUp = useAppStore((s) => s.confirmTopUp);
  const flashToast = useAppStore((s) => s.flashToast);

  return (
    <View>
      <View style={styles.amountBox}>
        <Text style={styles.amount}>{formatKobo(amount)}</Text>
      </View>
      <View style={styles.chips}>
        {CHIPS.map((c) => {
          const on = amount === kobo(c);
          return (
            <TouchableOpacity key={c} style={[styles.chip, on && styles.chipOn]} onPress={() => setAmount(kobo(c))}>
              <Text style={[styles.chipT, on && styles.chipTOn]}>₦{c.toLocaleString()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.methodLabel}>Pay with</Text>
      <View style={{ gap: 10, marginTop: 6 }}>
        {METHODS.map((m) => {
          const on = method === m.label;
          return (
            <TouchableOpacity key={m.key} style={[styles.method, on && styles.methodOn]} onPress={() => setMethod(m.label)}>
              <View style={styles.badge}>
                <Text style={styles.badgeT}>{m.badge}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>{m.label}</Text>
                <Text style={styles.methodHint}>{m.hint}</Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>
                {on && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ marginTop: 22 }}>
        <CTA
          label="Confirm top-up"
          onPress={() => {
            confirmTopUp(amount, method);
            flashToast('Wallet topped up');
            onDone();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amountBox: { alignItems: 'center', marginVertical: 6 },
  amount: { ...typography.amount, fontSize: 44 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 6 },
  chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.fieldEdge, backgroundColor: colors.card },
  chipOn: { borderColor: colors.brand, backgroundColor: colors.tintCard },
  chipT: { color: colors.ink, fontFamily: 'Sora', fontWeight: '700' },
  chipTOn: { color: colors.brand },
  methodLabel: { ...typography.label, marginTop: 22, marginBottom: 2 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.line, borderRadius: 14, padding: 12 },
  methodOn: { borderColor: colors.green, backgroundColor: colors.tintCard },
  badge: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.greenDeep, alignItems: 'center', justifyContent: 'center' },
  badgeT: { color: colors.lime, fontFamily: 'Sora', fontWeight: '700' },
  methodName: { ...typography.label, fontSize: 15, color: colors.ink },
  methodHint: { ...typography.body, fontSize: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.fieldEdge, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.green },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green },
});
