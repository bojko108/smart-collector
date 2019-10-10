import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Colors from '../constants/Colors';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddFeatureScreen from '../screens/AddFeatureScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {}
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    AddFeature: AddFeatureScreen
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Features',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={'md-pin'} />
};

HomeStack.path = '';

const MapStack = createStackNavigator(
  {
    Links: MapScreen
  },
  config
);

MapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={'md-map'} />
};

MapStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={'md-settings'} />
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    MapStack,
    SettingsStack
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.background,
      activeBackgroundColor: Colors.tintColor,
      inactiveTintColor: Colors.light,
      inactiveBackgroundColor: Colors.background
    }
  }
);

tabNavigator.path = '';

export default tabNavigator;
