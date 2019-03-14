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
  Alert
} from 'react-native';
import StreamScreen from './StreamScreen';
import { StackNavigator, NavigationActions } from 'react-navigation';

var ipSet = false;
var d=0;
var h=0;
var m=30;
var s=0;
var updated=false;
var checked=false;
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Ustawienia',
    header: null,
    headerLeft: null,
    left: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      dd: 0,
      hh: 0,
      mm: 0,
      ss: 0,
      showD: 0,
      showH: 0,
      showM: 0,
      showS: 0,
      textButton: 'Kalibracja wizjera',
      buttonDisable: false,
      ipAddress : '',
      ii: 0,
    }
    this.anomalia = this.anomalia.bind(this);
    this.setData = this.setData.bind(this);
  }

  setIp = async() => {
    var ip = ""
    try{
        ip = await AsyncStorage.getItem('ipAddress');
    }catch(error){
        alert(error);
    }
    this.setState({ipAddress : ip})
}
  
changeDays = (typedText) => {
  this.setState({dd: typedText});
}
changeHours = (typedText) => {
  this.setState({hh: typedText});
}
changeMinutes = (typedText) => {
  this.setState({mm: typedText});
}
changeSeconds = (typedText) => {
  this.setState({ss: typedText});
}

onPress = () => {

if(this.state.buttonDisable){
  alert("Nie możesz zmienić interwału jeśli nie jesteś zalogowany!")
} else{ 
this.saveData();
setTimeout(this.setData,150);
}
Keyboard.dismiss();
}

saveData(){
  let day = this.state.dd;
  let hour = this.state.hh;
  let minute = this.state.mm;
  let second = this.state.ss;
  if(this.state.dd == '') this.setState({dd : 0});
  if(this.state.hh == '') this.setState({hh : 0});
  if(this.state.mm == '') this.setState({mm : 0});
  if(this.state.ss == '') this.setState({ss : 0});
  AsyncStorage.setItem('day',day);
  AsyncStorage.setItem('minute',minute);
  AsyncStorage.setItem('hour',hour);
  AsyncStorage.setItem('second',second);
  
  var time = parseInt(second)+60*parseInt(minute)+3600*parseInt(hour)+86400*parseInt(day);

  fetch('http://'+this.state.ipAddress+'/zmien_interwal.php?value='+time,{
    method: 'POST',
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },

} )

setTimeout(this.setData,150);
}

setData = async () => {
  try{
      d = await AsyncStorage.getItem('day');
      h = await AsyncStorage.getItem('hour');
      m = await AsyncStorage.getItem('minute');
      s = await AsyncStorage.getItem('second');
      this.setState({showD : d, showH: h, showM : m, showS : s})
      
  }catch(error){
      alert(error);
  }
    

  fetch('http://'+this.state.ipAddress+'/get_interwal.php',{

    method: 'POST',
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },

} )

.then((response) => response.json())
.then((responseJson) => {
   this.setState({data: responseJson.array});
//    alert("Dziala \n" + responseJson.array);
    var res = JSON.stringify(responseJson);  
    var obj = JSON.parse(res)
    if(obj.error !== 'you are not logged in') 
    {
      var help = '';
      for(var i = 0 ; i < res.length; i++){
        if(res[i] !== "\"") help=help+res[i]
      }  
      
      help = parseInt(help);
      var day = help/86400;
      day=parseInt(day);
      help = help% 86400;
      var hour = help/3600;
      hour=parseInt(hour);
      help = help%3600;
      var minute = help/60;
      minute = parseInt(minute);
      help=help%60;
      var sec = help; 
      this.setState({showD : day, showH: hour, showM : minute, showS : sec})
      this.forceUpdate();

    }

})
.catch((error) => {/*alert(error);*/})
.done();


}

goToStream = () => {
  fetch('http://'+this.state.ipAddress+'/stream_on.php',{
    method: 'POST',
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },

})

.then((response) => response.json())
.then((responseJson) => {
  // alert(responseJson)
  var res = JSON.stringify(responseJson);
  // alert(res)  
  var obj = JSON.parse(res)
  if(obj.error == 'you are not logged in'){
    alert("Nie jesteś zalogowany!")
  }
  
  if(obj.result == 'success'){
    ipSet=false;
updated=false;
checked=false;
this.props.navigation.navigate('StreamScreen');
    }
  }   
)
.catch((error) => {

})
.done();


        

}

checkOnline= async() => {
  
  try{
    online = await AsyncStorage.getItem('online');
}catch(error){
    alert(error);
}
  if(online=='yes'){
    this.setState({textButton : 'Kalibracja wizjera', buttonDisable : false})
  }
  else if(online=='no'){
    this.setState({textButton : 'Jesteś offline. Kalibracja niemożliwa', buttonDisable : true})
  }
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
      this.setIp();
      ipSet=true;
    }
    if(updated==false){
      this.setData();
      updated=true;
    }
    if(!checked){
      this.checkOnline();
      this.anomalia();
      checked=true;
    }
    return(
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonContainer}  onPress={ () =>  {
          this.goToStream()
      }} //this.state.buttonDisable
      disabled= {this.state.buttonDisable}>
          <Text style={styles.button}>{this.state.textButton}</Text>
        </TouchableOpacity>  
        
        <Text>Aktualny interwał czasowy: </Text>

        {/* <View style={styles.inputContainer}> */}
          <Text> {this.state.showD}d:{this.state.showH}h:{this.state.showM}m:{this.state.showS}s </Text>
        {/* </View> */}
        
        <Text style={styles.textInput}> Zmień interwał czasowy: </Text>
        <View style={styles.inputContainer}>
          
          <TextInput placeholder="dd" placeholderTextColor="#7b7b7b" keyboardType="numeric" onChangeText={this.changeDays} style={styles.input} 
            onSubmitEditing={() => this.hourInput.focus()}/>
          <Text style={styles.textInput}>:</Text>
          <TextInput placeholder="hh" placeholderTextColor="#7b7b7b" keyboardType="numeric" onChangeText={this.changeHours} style={styles.input} 
            onSubmitEditing={() => this.minuteInput.focus()}
            ref={(input) => this.hourInput = input}/>
          <Text style={styles.textInput}>:</Text>
          <TextInput placeholder="mm" placeholderTextColor="#7b7b7b" keyboardType="numeric" onChangeText={this.changeMinutes} style={styles.input} 
            onSubmitEditing={() => this.secondInput.focus()}
            ref={(input) => this.minuteInput = input}/>
          <Text style={styles.textInput}>:</Text>
          <TextInput placeholder="ss" placeholderTextColor="#7b7b7b" keyboardType="numeric" onChangeText={this.changeSeconds} style={styles.input} 
            onSubmitEditing={() => this.onPress()}
            ref={(input) => this.secondInput = input}/>  
          <TouchableOpacity style={styles.buttonContainer2} onPress={this.onPress}>
            <Text style={styles.button2}>OK</Text>
          </TouchableOpacity> 
          

        </View>
        <View>
          <Text>Rozliczenie</Text>
          </View>
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
buttonContainer: {
  backgroundColor: "#000000",
  paddingVertical: 10,
  borderRadius: 20,
  marginTop: 20,
  width: 200,
},
buttonContainer2: {
  backgroundColor: "#000000",
  alignItems: 'center',
  paddingVertical: 10,
  borderRadius: 20,
  width: 50,
  height: 40,
},
button: {
  textAlign: "center",
  color: "#FFFFFF",
},
button2: {
  textAlign: "center",
  marginTop: 7,
  color: "#FFFFFF",
  bottom: 5,
},
input: {
  alignItems: 'center',
  height: 40,
  width: 40,
  backgroundColor: "#CACACA",
  marginBottom: 20,
  color: "#000",
  paddingHorizontal: 10,
  borderRadius: 5,
},
inputContainer: {
  flexGrow: 1,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginVertical: 50,
  flexDirection: 'row',
  height: 50,
},
textInput: {
  top: 5,
},
buttonView:{
  flexGrow: 1,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',  
},
});
