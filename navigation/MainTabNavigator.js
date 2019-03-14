import React from 'react';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import ChartScreen from '../screens/ChartScreen';
import SettingsScreen from '../screens/SettingsNaviScreen';
import ChartNavi from './ChartNavi';
import CounterUpdate from '../screens/CounterUpdate'
import Login from '../screens/Login'

export default TabNavigator(
  {
    Home: {
      screen: HomeScreen, 
    },

    Chart: {
      screen: ChartNavi,
    },
    Settings: {
      screen: SettingsScreen,
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-home${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }
        else if (routeName === 'Chart') {
          iconName = `ios-podium${focused ? '' : '-outline'}`;
        }

       
        return <Ionicons name={iconName} size={25} color={'#000000'} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#000000',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
  }
);
