import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, type LayoutChangeEvent } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Icon } from '../components/Icon';
import { Gradient } from '../components/Gradient';
import { FEED, useAppStore, type FeedItem } from '../store/useAppStore';
import { fmtCount } from '../lib/money';

const TOP = 54;

export function Feed() {
  const liked = useAppStore((s) => s.feedLiked);
  const followed = useAppStore((s) => s.feedFollowed);
  const toggleLike = useAppStore((s) => s.toggleFeedLike);
  const toggleFollow = useAppStore((s) => s.toggleFeedFollow);
  const [h, setH] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setH(e.nativeEvent.layout.height);
  }, []);

  return (
    <View style={styles.screen} onLayout={onLayout}>
      <StatusBar style="light" />
      {h > 0 && (
        <FlatList
          data={FEED}
          keyExtractor={(i) => i.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({ length: h, offset: h * index, index })}
          renderItem={({ item }) => (
            <Card
              item={item}
              height={h}
              liked={!!liked[item.id]}
              followed={!!followed[item.id]}
              onLike={() => toggleLike(item.id)}
              onFollow={() => toggleFollow(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

function Card({
  item,
  height,
  liked,
  followed,
  onLike,
  onFollow,
}: {
  item: FeedItem;
  height: number;
  liked: boolean;
  followed: boolean;
  onLike: () => void;
  onFollow: () => void;
}) {
  return (
    <View style={[styles.card, { height }]}>
      <Gradient colors={item.bg} angle={165} />
      <View style={styles.blob} />

      <View style={styles.top}>
        <View style={[styles.chip, { backgroundColor: item.chip }]}>
          <Text style={[styles.chipT, { color: item.chipFg }]}>{item.category}</Text>
        </View>
        {item.live && (
          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text style={styles.liveT}>LIVE</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <View style={styles.statWrap}>
        <Text style={styles.stat}>{item.stat}</Text>
        <Text style={styles.statSub}>{item.statSub}</Text>
      </View>

      <View style={styles.rail}>
        <TouchableOpacity style={styles.railBtn} activeOpacity={0.8} onPress={onLike}>
          <Icon name="feedLike" size={29} sw={1.8} stroke={liked ? '#ff5a7a' : '#fff'} fill={liked ? '#ff5a7a' : 'none'} />
          <Text style={styles.railT}>{fmtCount(item.likes + (liked ? 1 : 0))}</Text>
        </TouchableOpacity>
        <View style={styles.railBtn}>
          <Icon name="feedComment" size={28} sw={1.8} stroke="#fff" />
          <Text style={styles.railT}>84</Text>
        </View>
        <View style={styles.railBtn}>
          <Icon name="feedShare" size={28} sw={1.8} stroke="#fff" />
          <Text style={styles.railT}>Share</Text>
        </View>
        <View style={styles.railBtn}>
          <Icon name="feedSave" size={28} sw={1.8} stroke="#fff" />
          <Text style={styles.railT}>Save</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <View style={styles.srcRow}>
          <Text style={styles.src}>{item.source}</Text>
          <TouchableOpacity
            style={[styles.followPill, followed && styles.followPillOn]}
            activeOpacity={0.8}
            onPress={onFollow}
          >
            <Text style={[styles.followT, followed && styles.followTOn]}>{followed ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#07100c' },
  card: { paddingHorizontal: 18, paddingTop: TOP + 16, paddingBottom: 26, overflow: 'hidden' },
  blob: { position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.05)' },
  top: { position: 'absolute', top: TOP, left: 18, right: 18, flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 2 },
  chip: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8 },
  chipT: { fontFamily: 'Sora', fontWeight: '800', fontSize: 11, letterSpacing: 0.4 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,90,90,0.22)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ff5a5a' },
  liveT: { color: '#fff', fontFamily: 'Sora', fontWeight: '700', fontSize: 11 },
  time: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Manrope', fontWeight: '600' },
  statWrap: { marginTop: 48, marginBottom: 'auto' },
  stat: { fontFamily: 'Sora', fontWeight: '800', fontSize: 46, color: '#fff', letterSpacing: -1.5, lineHeight: 48 },
  statSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: '600', fontFamily: 'Manrope', marginTop: 8 },
  rail: { position: 'absolute', right: 14, bottom: 150, alignItems: 'center', gap: 20, zIndex: 2 },
  railBtn: { alignItems: 'center', gap: 4 },
  railT: { fontSize: 11, fontWeight: '700', color: '#fff', fontFamily: 'Manrope' },
  bottom: { paddingRight: 56 },
  title: { fontFamily: 'Sora', fontWeight: '700', fontSize: 21, color: '#fff', lineHeight: 25, letterSpacing: -0.3 },
  body: { fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: '500', fontFamily: 'Manrope', lineHeight: 20, marginTop: 8 },
  srcRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  src: { fontSize: 12.5, color: 'rgba(255,255,255,0.85)', fontWeight: '600', fontFamily: 'Manrope' },
  followPill: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999 },
  followPillOn: { backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.9)' },
  followT: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '700', fontFamily: 'Manrope' },
  followTOn: { color: '#0a2117' },
});
