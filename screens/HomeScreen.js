import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert
} from 'react-native';
import { Icon, Ionicons } from 'react-native-vector-icons';

var ipSet = false;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    headerMode: 'screen',
    title: "Informacje",

  };
  constructor(props) {
    super(props);
    this.state = {
      ipAddress: '',
      serverName: '',
      promptVisible: false,
    }
    this.anomalia = this.anomalia.bind(this);
}

setIp = async() => {
  var ip = ""
  try{
      ip = await AsyncStorage.getItem('ipAddress');
  }catch(error){
      alert(error);
  }
  this.setState({ipAddress : ip})
  setTimeout(this.anomalia, 5000);
}

buzzOff = () => {
  fetch('http://'+this.state.ipAddress+'/buzzer_off.php',{
          method: 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
      
      } )
}

  anomalia = () => {
    var address = 'http://'+this.state.ipAddress+'/buzzer_status.php';
    fetch(address,{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  
  .then((response) => response.json())
  .then((responseJson) => {
    // alert(responseJson)
    var res = JSON.stringify(responseJson);
    // alert(res)  
    var obj = JSON.parse(res)
    if(obj.result == '1' || obj.result == '1\n') {
      Alert.alert('Alarm', 'Wykryto anomalie',   [
        {},
        {text: 'OK', onPress: () =>     fetch('http://'+this.state.ipAddress+'/buzzer_off.php',{
          method: 'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
      
      } )},
      {},
      ],
      { cancelable: false }
    )

    }
    if(obj.result == '2' || obj.result == '2\n') {      Alert.alert('Alarm', 'Wykryto anomalie',   [
      {},
      {text: 'OK', onPress: () =>     fetch('http://'+this.state.ipAddress+'/buzzer_off.php',{
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    
    } )},
    {},
    ],
    { cancelable: false }
  )
    }
    
      
  })
  .catch((error) => {

  })
  .done();

setTimeout(this.anomalia, 5000);
  }

  render() {
    if(!ipSet){
      ipSet = true;
      this.setIp();
    }
    return (
      <View style={styles.container}>
                      <View style={styles.logoContainer}>
                    <Image 
                    style={styles.logo}
                    source={require('../assets/images/icon.png')}
                    />
                </View>
        <View style={styles.contentContainer}>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}
            <Text style={styles.getStartedText}>MMA</Text>
            <Text style={styles.getStartedText}>Monitoring Mierników Analogowych</Text>
          </View> 

          <View style={styles.helpContainer}>
          <Text style={styles.getStartedText}>Made by:</Text>
              <Text style={styles.namesText}>Dawid Witakowski (kierownik / PHP)</Text>
              <Text style={styles.namesText}>Amadeusz Trzebiatowski (sekretarz / React Native)</Text>
              <Text style={styles.namesText}>Mirosław Madej (Python)</Text>
              <Text style={styles.namesText}>Przemysław Lewandowski (C)</Text>
          </View>
        </View>

      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {

      return (
        <Text style={styles.developmentModeText}>
          Pracujesz w trybie dewelopera. Aplikacja będzie działała wolniej.
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
        </Text>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  logo: {
    width: 100,
    height: 100,
},
logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-start',
    bottom: -20,
},
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    bottom: 270,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: '#393939',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  namesText: {
    fontSize: 14,
    color: '#393939',
  },
});
