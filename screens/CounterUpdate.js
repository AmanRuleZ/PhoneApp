import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  AsyncStorage,
  Keyboard,
  Alert,
  BackAndroid,
} from 'react-native';
import StreamScreen from './StreamScreen';
import { StackNavigator, NavigationActions } from 'react-navigation';

var ipSet = false;

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'CounterUpdate',
    header: null,
    headerLeft: null,
    left: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      counter: '',
      ipAddress : '',
    }
    this.anomalia = this.anomalia.bind(this);
    this.setData = this.setData.bind(this);
    BackAndroid.addEventListener('hardwareBackPress', this.onAndroidBackPress)
}

onAndroidBackPress = () => {
ipSet = false;
}

  setIp = async() => {
    var ip = ""
    try{
        ip = await AsyncStorage.getItem('ipAddress');
    }catch(error){
        alert(error);
    }
    this.setState({ipAddress : ip})
    setTimeout(this.anomalia, 150)
    setTimeout(this.setData,150);
}

setData() {
    fetch('http://'+this.state.ipAddress+'/counter.php',{

        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },

    } )
    
    .then((response) => response.json())
    .then((responseJson) => {

        var res = JSON.stringify(responseJson);  
        var obj = JSON.parse(res)
        // alert(res)
        if(obj.error == 'you are not logged in') alert("Nie jesteś zalogowany")
        else{ 
            // alert(obj.value)
            this.setState({counter : obj.result});
            setTimeout(this.setData, 1000);
        }
        
    })
    .catch((error) => {/*alert(error);*/})
    .done();
}

anomalia() {
    var address = 'http://'+this.state.ipAddress+'/buzzer_status.php';
    fetch(address,{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
  
  } )
  
  .then((responseJson) => {
    // alert(responseJson)
    var res = JSON.stringify(responseJson);
    // alert(res)  
    var obj = JSON.parse(res)
    if(obj.result == '1' || obj.result == '1\n') {
      
      Alert.alert('Alarm', 'Coś się dzieję z licznikiem',   [
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
    if(obj.result == '2' || obj.result == '2\n') {      Alert.alert('Alarm', 'Coś działo się z licznikiem',   [
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
        this.setIp();
        ipSet=true;
      }
    return(
    <View style = {styles.container}>
        <Text style = {styles.text}>
        Wartość licznika:
        </Text>
        <Text style = {styles.text2}>
        {this.state.counter}
        </Text>
    </View>

  );
}
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#FFF',
  alignItems: 'center',
  justifyContent: 'flex-start'
},
text: {
  fontSize: 50,
},
text2: {
    fontSize: 130,
}
});
