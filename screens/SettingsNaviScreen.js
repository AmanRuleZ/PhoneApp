import React from 'react';

import StreamScreen from './StreamScreen';
import SettingsScreen from './SettingsScreen';
import { StackNavigator } from 'react-navigation';



const Navigation = StackNavigator({
  SettingsScreen: {screen: SettingsScreen},
  StreamScreen: {screen: StreamScreen},
},{ 
  headerMode: 'none',
}
)

export default class SettingsNaviScreen extends React.Component {
  static navigationOptions = {
    title: 'Ustawienia',
    header: null,
    headerLeft: null,
    left: null,
  };
  render() {
    return(
        <Navigation/>

    );
}
}
