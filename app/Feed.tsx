import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, radius, typography, space } from '../theme/tokens';
import { Icon } from '../components/Icon';
import { FEED, useAppStore } from '../store/useAppStore';

const H = Dimensions.get('window').height;
const CATPAL: Record<string, string> = {
  Markets: colors.brand,
  Invest: '#f0b81e',
  Deal: colors.lime,
  Seminar: '#5b8def',
};

export function Feed() {
  const liked = useAppStore((s) => s.feedLiked);
  const followed = useAppStore((s) => s.feedFollowed);
  const toggleLike = useAppStore((s) => s.toggleFeedLike);
  const toggleFollow = useAppStore((s) => s.toggleFeedFollow);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        data={FEED}
        keyExtractor={(i) => i.id}
        pagingEnabled
        snapToInterval={H}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { height: H }]}>
            <View style={styles.head}>
              <View style={[styles.chip, { backgroundColor: (CATPAL[item.category] ?? colors.brand) + '22' }]}>
                <Text style={[styles.chipT, { color: CATPAL[item.category] ?? colors.brand }]}>{item.category}</Text>
              </View>
              {item.live && (
                <View style={styles.live}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveT}>LIVE</Text>
                </View>
              )}
              <Text style={styles.time}>{item.time}</Text>
            </View>

            <Text style={styles.stat}>{item.stat}</Text>
            <Text style={styles.statSub}>{item.statSub}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.source}>{item.source}</Text>

            <View style={styles.rail}>
              <TouchableOpacity style={styles.railBtn} onPress={() => toggleLike(item.id)}>
                <Icon name="feedLike" size={26} stroke={liked[item.id] ? '#ff5a5f' : '#fff'} fill={liked[item.id] ? '#ff5a5f' : 'none'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.railBtn}>
                <Icon name="feedComment" size={24} stroke="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.railBtn}>
                <Icon name="feedShare" size={24} stroke="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.railBtn}>
                <Icon name="feedSave" size={24} stroke="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.follow, followed[item.id] && styles.followOn]}
              onPress={() => toggleFollow(item.id)}
            >
              <Text style={[styles.followT, followed[item.id] && styles.followTOn]}>
                {followed[item.id] ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#07100c' },
  card: { padding: space.gutterLg, justifyContent: 'center', gap: 4 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radius.pill },
  chipT: { fontFamily: 'Sora', fontWeight: '700', fontSize: 12 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#b4413a', borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 10 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime },
  liveT: { color: '#fff', fontFamily: 'Sora', fontWeight: '700', fontSize: 11 },
  time: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginLeft: 'auto', fontFamily: 'Manrope' },
  stat: { color: colors.lime, fontSize: 30, fontFamily: 'Sora', fontWeight: '700' },
  statSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Manrope', marginTop: 2 },
  title: { color: '#fff', fontSize: 46, fontFamily: 'Sora', fontWeight: '700', letterSpacing: -1, marginTop: 18, lineHeight: 52 },
  body: { color: 'rgba(255,255,255,0.72)', fontSize: 14.5, fontFamily: 'Manrope', marginTop: 10, lineHeight: 21 },
  source: { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Manrope', marginTop: 14 },
  rail: { flexDirection: 'row', gap: 26, marginTop: 28 },
  railBtn: { padding: 4 },
  follow: { alignSelf: 'flex-start', marginTop: 24, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 22 },
  followOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  followT: { color: '#fff', fontFamily: 'Sora', fontWeight: '700', fontSize: 13 },
  followTOn: { color: colors.ink },
});
