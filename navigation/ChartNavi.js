import React from 'react';

import ChartScreen from '../screens/ChartScreen';
import CounterUpdate from '../screens/CounterUpdate';
import { StackNavigator } from 'react-navigation';



const Navigation = StackNavigator({
  ChartScreen: {screen: ChartScreen},
  CounterUpdate: {screen: CounterUpdate},
},{ 
  headerMode: 'none',
}
)

export default class SettingsNaviScreen extends React.Component {
  static navigationOptions = {
    title: 'Wykres',
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
