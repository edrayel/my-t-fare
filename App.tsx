import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppStore } from './store/useAppStore';
import { Toast } from './components/Toast';
import { BioOverlay } from './components/BioOverlay';
import { BottomNav } from './components/BottomNav';

import { Onboarding, RoleSelect, SignIn, SignUp } from './app/Auth';
import { Landing } from './app/Landing';
import { Home } from './app/Home';
import { Trips } from './app/Trips';
import { Card } from './app/Card';
import { Feed } from './app/Feed';
import { Profile } from './app/Profile';
import { Scan } from './app/Scan';
import { Processing } from './app/Processing';
import { Success } from './app/Success';
import { Receipt } from './app/Receipt';
import { CampusMap } from './app/CampusMap';
import { NormalTransit } from './app/NormalTransit';
import { Spending } from './app/Spending';
import {
  GiftPick,
  GiftAmount,
  GiftConfirm,
  GiftSuccess,
  RequestSuccess,
  RequestQR,
} from './app/Gift';

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tabs.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false, animation: 'none' }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="home" component={Home} />
      <Tabs.Screen name="trips" component={Trips} />
      <Tabs.Screen name="card" component={Card} />
      <Tabs.Screen name="feed" component={Feed} />
      <Tabs.Screen name="profile" component={Profile} />
    </Tabs.Navigator>
  );
}

export default function App() {
  const authed = useAppStore((s) => s.authed);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName={authed ? '(tabs)' : 'landing'}
          screenOptions={{ headerShown: false, animation: 'slide_from_right', gestureEnabled: true }}
        >
          {/* Auth (pre-login) */}
          <RootStack.Screen name="landing" component={Landing} />
          <RootStack.Screen name="onboarding" component={Onboarding} />
          <RootStack.Screen name="role" component={RoleSelect} />
          <RootStack.Screen name="signin" component={SignIn} />
          <RootStack.Screen name="signup" component={SignUp} />

          {/* Main app */}
          <RootStack.Screen name="(tabs)" component={TabNavigator} />

          {/* v3 passenger screens */}
          <RootStack.Screen name="campusMap" component={CampusMap} />
          <RootStack.Screen name="normalTransit" component={NormalTransit} />
          <RootStack.Screen name="spending" component={Spending} />

          {/* Modal / flow screens (over tabs, not tabs themselves) */}
          <RootStack.Screen name="scan" component={Scan} options={{ animation: 'fade' }} />
          <RootStack.Screen name="processing" component={Processing} />
          <RootStack.Screen name="success" component={Success} />
          <RootStack.Screen name="receipt" component={Receipt} />

          {/* Gift & Request (P2P) */}
          <RootStack.Screen name="giftPick" component={GiftPick} />
          <RootStack.Screen name="giftAmount" component={GiftAmount} />
          <RootStack.Screen name="giftConfirm" component={GiftConfirm} />
          <RootStack.Screen name="giftSuccess" component={GiftSuccess} />
          <RootStack.Screen name="requestSuccess" component={RequestSuccess} />
          <RootStack.Screen name="requestQR" component={RequestQR} />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast />
      <BioOverlay />
    </GestureHandlerRootView>
  );
}
