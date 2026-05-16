import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../services/firebaseConfig';
import { MOOD_EMOJI_MAP, MOOD_COLOR_MAP } from '../theme/theme';

const MOOD_LABELS = { 1: 'Buồn', 2: 'Ổn', 3: 'Vui', 4: 'Hạnh phúc', 5: 'Tuyệt vời' };
const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const BAR_COLORS = ['#D0E1D4','#E0DBEF','#D0E1D4','#FDD5BD','#E0DBEF','#D0E1D4','#FDD5BD'];

const getFireColor = (d) => {
  if (d >= 200) return '#00BCD4';
  if (d >= 100) return '#FFC107';
  if (d >= 30) return '#9C27B0';
  if (d >= 7) return '#03A9F4';
  return '#FF5722';
};
const findMode = (sc) => {
  const f = {}; sc.forEach(s => { f[s] = (f[s]||0)+1; });
  return Number(Object.entries(f).reduce((a,b) => b[1]>a[1]?b:a, [3,0])[0]);
};
const calcStreak = (logs) => {
  if (!logs.length) return 0;
  const days = [...new Set(logs.map(l => {
    const d = new Date(l.timestamp); d.setHours(0,0,0,0); return d.getTime();
  }))].sort((a,b) => b-a);
  const now = new Date(); now.setHours(0,0,0,0);
  if (now.getTime() - days[0] > 86400000) return 0;
  let s = 1;
  for (let i = 0; i < days.length-1; i++) { if (days[i]-days[i+1]===86400000) s++; else break; }
  return s;
};
const buildWeek = (logs) => {
  const today = new Date();
  return Array.from({length:7},(_,i) => {
    const d = new Date(today); d.setDate(today.getDate()-(6-i)); d.setHours(0,0,0,0);
    const h = logs.filter(l => { const x=new Date(l.timestamp); x.setHours(0,0,0,0); return x.getTime()===d.getTime(); });
    return { day: DAY_NAMES[d.getDay()], moodId: h.length ? h[h.length-1].moodScore : null };
  });
};

const StatsScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // useFocusEffect thay vì useEffect - tự động reload mỗi khi tab được focus
  useFocusEffect(
    useCallback(() => {
      let ok = true;
      setLoading(true);
      setErr(null);
      (async () => {
        try {
          const uid = auth.currentUser?.uid;
          if (!uid) throw new Error('Chưa đăng nhập');
          const q = query(collection(db,'MoodLogs'), where('userId','==',uid), orderBy('timestamp','asc'));
          const snap = await getDocs(q);
          const logs = snap.docs.map(d => ({...d.data(), timestamp: d.data().timestamp?.toDate?.()||new Date()}));
          if (!ok) return;
          const sc = logs.map(l => l.moodScore);
          const mode = sc.length ? findMode(sc) : 3;
          setStats({ total: logs.length, mood: {emoji:MOOD_EMOJI_MAP[mode], label:MOOD_LABELS[mode]}, streak: calcStreak(logs), week: buildWeek(logs) });
        } catch (e) { if (ok) setErr(e.message); }
        finally { if (ok) setLoading(false); }
      })();
      return () => { ok = false; };
    }, [])
  );

  if (loading) return <View style={st.ctr}><ActivityIndicator size="large" color="#FF5722"/><Text style={st.sub}>Đang tải...</Text></View>;
  if (err) return <View style={st.ctr}><Text style={{fontSize:48}}>😥</Text><Text style={st.sub}>{err}</Text></View>;

  const streak = stats?.streak || 0;
  return (
    <SafeAreaView style={st.safe}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
        <Text style={st.h1}>Thống kê 📊</Text>
        <View style={st.row}>
          <View style={[st.card,{backgroundColor:'#FFE8D6',flex:1,marginRight:8}]}>
            <Text style={st.lbl}>Tổng ghi chép</Text>
            <Text style={st.big}>{stats?.total||0}</Text>
          </View>
          <View style={[st.card,{backgroundColor:'#DDF3FF',flex:1,marginLeft:8}]}>
            <Text style={st.lbl}>Chuỗi liên tục</Text>
            <Text style={st.big}>{streak} ngày</Text>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:2}}>
              <Text style={st.sub}>liên tiếp </Text>
              <Ionicons name="flame" size={20} color={getFireColor(streak)}/>
            </View>
          </View>
        </View>
        <View style={[st.card,{backgroundColor:'#EAE4FF',flexDirection:'row',alignItems:'center',gap:16}]}>
          <View style={st.ring}><Text style={{fontSize:34}}>{stats?.mood?.emoji}</Text></View>
          <View style={{flex:1}}>
            <Text style={st.sub}>Cảm xúc thường gặp nhất</Text>
            <Text style={[st.big,{marginTop:4}]}>{stats?.mood?.label}</Text>
          </View>
        </View>
        <Text style={st.h2}>Tuần này</Text>
        <View style={[st.card,{backgroundColor:'#DCF2E0'}]}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            {stats?.week?.map((d,i) => (
              <View key={i} style={{alignItems:'center',gap:6}}>
                <View style={[st.dot,{backgroundColor:MOOD_COLOR_MAP[d.moodId]||'#E0E0E0'}]}>
                  <Text style={{fontSize:18}}>{MOOD_EMOJI_MAP[d.moodId]||'😐'}</Text>
                </View>
                <Text style={st.dayTxt}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={st.h2}>Tổng quan tháng</Text>
        <View style={[st.card,{backgroundColor:'#FFF5D1'}]}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',height:80}}>
            {[0.6,0.8,0.45,0.9,0.7,0.55,0.85].map((h,i) => (
              <View key={i} style={{flex:1,alignItems:'center'}}>
                <View style={{height:h*70,width:20,borderRadius:10,backgroundColor:BAR_COLORS[i]}}/>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const st = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#FFF5F7'},
  ctr:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#FFF5F7'},
  scroll:{padding:20,paddingBottom:110},
  h1:{fontSize:26,color:'#333',fontWeight:'bold',marginTop:8,marginBottom:24},
  h2:{fontSize:18,fontWeight:'700',color:'#333',marginTop:20,marginBottom:12},
  row:{flexDirection:'row',justifyContent:'space-between',marginBottom:0},
  card:{borderRadius:24,padding:20,marginBottom:16,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.05,shadowRadius:10,elevation:2},
  lbl:{fontSize:14,color:'#666',fontWeight:'500',marginBottom:4},
  big:{fontSize:32,fontWeight:'bold',color:'#333'},
  sub:{fontSize:13,color:'#888',marginTop:4},
  ring:{width:60,height:60,borderRadius:30,backgroundColor:'rgba(255,255,255,0.55)',justifyContent:'center',alignItems:'center'},
  dot:{width:38,height:38,borderRadius:19,justifyContent:'center',alignItems:'center'},
  dayTxt:{fontSize:12,color:'#555',fontWeight:'500'},
});

export default StatsScreen;