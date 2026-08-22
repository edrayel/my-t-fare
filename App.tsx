import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import { DriverHome } from './app/driver/Home';
import { DriverGenerate } from './app/driver/Generate';
import { DriverVerify } from './app/driver/Verify';
import { DriverSoftPOS } from './app/driver/SoftPOS';
import { DriverWithdraw } from './app/driver/Withdraw';
import { DriverHistory } from './app/driver/History';
import { DriverProfile } from './app/driver/Profile';
import { DriverBottomNav } from './components/DriverBottomNav';
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
const DriverTabs = createBottomTabNavigator();

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

function DriverTabNavigator() {
  return (
    <DriverTabs.Navigator
      initialRouteName="driverHome"
      screenOptions={{ headerShown: false, animation: 'none' }}
      tabBar={(props) => <DriverBottomNav {...props} />}
    >
      <DriverTabs.Screen name="driverHome" component={DriverHome} />
      <DriverTabs.Screen name="driverHistory" component={DriverHistory} />
      <DriverTabs.Screen name="driverProfile" component={DriverProfile} />
    </DriverTabs.Navigator>
  );
}

export default function App() {
  const authed = useAppStore((s) => s.authed);
  const mode = useAppStore((s) => s.mode);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <RootStack.Navigator
            key={authed ? mode : 'guest'}
            initialRouteName={authed ? (mode === 'driver' ? '(driverTabs)' : '(tabs)') : 'landing'}
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
          <RootStack.Screen name="(driverTabs)" component={DriverTabNavigator} />

          {/* v3 passenger screens */}
          <RootStack.Screen name="campusMap" component={CampusMap} />
          <RootStack.Screen name="normalTransit" component={NormalTransit} />
          <RootStack.Screen name="spending" component={Spending} />

          {/* Driver screens */}
          <RootStack.Screen name="driverGenerate" component={DriverGenerate} />
          <RootStack.Screen name="driverVerify" component={DriverVerify} />
          <RootStack.Screen name="driverSoftPOS" component={DriverSoftPOS} />
          <RootStack.Screen name="driverWithdraw" component={DriverWithdraw} />
          <RootStack.Screen name="driverHistory" component={DriverHistory} />
          <RootStack.Screen name="driverProfile" component={DriverProfile} />

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
    </SafeAreaProvider>
  );
}
