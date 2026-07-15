import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, typography, space } from '../../theme/tokens';
import { Icon } from '../../components/Icon';
import { CTA } from '../../components/CTA';
import { INLINE } from '../../theme/paths';
import { CAMPUS, useAppStore, type CampusKey } from '../../store/useAppStore';

export function CampusSheet({ onDone }: { onDone: () => void }) {
  const campus = useAppStore((s) => s.campus);
  const setCampus = useAppStore((s) => s.setCampus);
  const flashToast = useAppStore((s) => s.flashToast);

  const pick = (k: CampusKey) => {
    setCampus(k);
    onDone();
  };

  const detect = () => {
    setCampus('UNILAG');
    flashToast('Location detected · UNILAG');
    onDone();
  };

  return (
    <View>
      <Text style={[typography.body, styles.lead]}>
        We load live fares for wherever you ride.
      </Text>
      <TouchableOpacity style={styles.detect} onPress={detect}>
        <View style={styles.detectIcon}>
          <Icon name={'autoDetect' as keyof typeof INLINE} size={20} stroke={colors.lime} sw={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.detectT}>Auto-detect my location</Text>
          <Text style={styles.detectSub}>Use GPS to find the nearest campus</Text>
        </View>
      </TouchableOpacity>

      <View style={{ marginTop: 8, gap: 10 }}>
        {(Object.keys(CAMPUS) as CampusKey[]).map((k) => {
          const c = CAMPUS[k];
          const on = campus === k;
          return (
            <TouchableOpacity key={k} style={[styles.row, on && styles.rowOn]} onPress={() => pick(k)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{c.label}</Text>
                <Text style={styles.rowCity}>{c.city}</Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>
                {on && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ marginTop: 18 }}>
        <CTA label="Done" variant="dark" onPress={onDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: { ...typography.body, marginBottom: 12 },
  detect: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: colors.green, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: colors.tintCard },
  detectIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  detectT: { fontFamily: 'Sora', fontWeight: '700', fontSize: 14, color: colors.ink },
  detectSub: { ...typography.body, fontSize: 12, marginTop: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.line, borderRadius: 14, padding: 14 },
  rowOn: { borderColor: colors.green, backgroundColor: colors.tintCard },
  rowLabel: { ...typography.label, fontSize: 15, color: colors.ink },
  rowCity: { ...typography.body, fontSize: 12.5 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.fieldEdge, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.green },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green },
});
