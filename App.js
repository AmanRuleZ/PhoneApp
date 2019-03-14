import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from './screens/Login';
import RootNavigation from './navigation/RootNavigation';
import selectServer from './screens/selectServer';
import selectServer2 from './screens/selectServer2';
import Register from './screens/RegisterScreen';



const Navigation = StackNavigator({
  selectServer: {screen: selectServer},
  LoginScreen: {screen: Login},
  Register: {screen: Register},
  RootNavigation: {screen: RootNavigation},
  selectServer2: {screen: selectServer2},
},{ 
  headerMode: 'none',
}
)
export default class App extends React.Component {

  static navigationOptions = {
    header: { visible:false },
    headerMode: 'screen',
    headerLeft: null,
  };

  render() {
    return (
      <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}

      <Navigation />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
