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
  WebView,
  BackAndroid,
} from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
const WEBVIEW_REF = 'webview';
var ipSet = false;
var refresh = false;
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Stream',
    
  };
  constructor(props) {
    super(props);
    this.state = {
      ipAddress: '',
      www: '',
      url: '',
    }
    this.timer = null;
    this.zwiekszPion = this.zwiekszPion.bind(this);
    this.zwiekszPoz = this.zwiekszPoz.bind(this);
    this.zmniejszPion = this.zmniejszPion.bind(this);
    this.zmniejszPoz = this.zmniejszPoz.bind(this);

    this.przesGora = this.przesGora.bind(this);
    this.przesDol = this.przesDol.bind(this);
    this.przesLewo = this.przesLewo.bind(this);
    this.przesPrawo = this.przesPrawo.bind(this);

    this.zwiekszOdstep = this.zwiekszOdstep.bind(this);
    this.zmniejszOdstep = this.zmniejszOdstep.bind(this);
    

    this.stopTimer = this.stopTimer.bind(this);

    BackAndroid.addEventListener('hardwareBackPress', this.onAndroidBackPress)
  }

  onAndroidBackPress = () => {
    fetch('http://'+this.state.ipAddress+'/stream_off.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
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
    this.setState({www : 'http://'+ ip +'/showPhoto.html'})
    setTimeout(this.refresh, 150);
}


  onPress(item) {
    alert("Wcisnieto przycisk " + item);
  }

  zwiekszPion() {
    fetch('http://'+this.state.ipAddress+'/zwieksz_pionowo.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.zwiekszPion, 150);
  }

  zwiekszPoz() {
    fetch('http://'+this.state.ipAddress+'/zwieksz_poziomo.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.zwiekszPoz, 150);
  }

  zmniejszPion() {
    fetch('http://'+this.state.ipAddress+'/zmniejsz_pionowo.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.zmniejszPion, 150);
  }

  zmniejszPoz() {
    fetch('http://'+this.state.ipAddress+'/zmniejsz_poziomo.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.zmniejszPoz, 150);
  }

  przesGóra() {
    fetch('http://'+this.state.ipAddress+'/zmniejsz_poziomo.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.przesGóra, 150);
  }

  przesGora() {
    fetch('http://'+this.state.ipAddress+'/przesun_gora.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.przesGora, 150);
  }

  przesDol() {
    fetch('http://'+this.state.ipAddress+'/przesun_dol.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.przesDol, 150);
  }

  przesLewo() {
    fetch('http://'+this.state.ipAddress+'/przesun_lewo.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.przesLewo, 150);
  }

  przesPrawo() {
    fetch('http://'+this.state.ipAddress+'/przesun_prawo.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
    this.timer = setTimeout(this.przesPrawo, 150);
  }


  dodajKomorke() {
    fetch('http://'+this.state.ipAddress+'/dodaj_komorke.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
  }

  usunKomorke() {
    fetch('http://'+this.state.ipAddress+'/usun_komorke.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
  }

  testPhoto() {
    fetch('http://'+ this.state.ipAddress + '/zbyszek.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  
  .then((response) => response.json())
  .then((responseJson) => {
    var res = JSON.stringify(responseJson);
    alert(res)


  })
  .catch((error) => {alert(error);})
  .done();
  }

  zwiekszOdstep() {
    fetch('http://'+this.state.ipAddress+'/zwieksz_odstep.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error);})
  .done();
    this.timer = setTimeout(this.zwiekszOdstep, 150);
  }

  zmniejszOdstep() {
    fetch('http://'+this.state.ipAddress+'/zmniejsz_odstep.php',{
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },

  } )
  .catch((error) => {alert(error)})
  .done();
    this.timer = setTimeout(this.zmniejszOdstep, 150);
  }

  stopTimer() {
    clearTimeout(this.timer);
  }
  
  refresh = () => {
    this.setState({url : this.state.www + '?' + Math.random()})

  }

  render() {
    if(!ipSet){
      this.setIp();
      ipSet=true;
    }
    // if(!refresh){

    //   refresh=true;
    // }
    return(
      
      <View style={styles.container}>

              <View style={styles.videoContainer}>
                <WebView
                automaticallyAdjustContentInsets={false}
                  ref={WEBVIEW_REF}
                  javaScriptEnabled = {true}
                  //'+ this.state.ipAddress +'
                  source={{uri: this.state.url}}
                  style={styles.video}
                scrollEnabled={false}
                startInLoadingState={false}
                
          />


          <View style={styles.rowButtonsContainer}>

              <TouchableOpacity style={styles.leftButtonContainer} onPressIn={this.zwiekszPion} onPressOut={this.stopTimer}>
                <Text style={styles.button}>RPion</Text>
              </TouchableOpacity> 


 
              <TouchableOpacity style={styles.centerButtonContainer} onPressIn={this.przesLewo} onPressOut={this.stopTimer}>
                <Text style={styles.button}> {'\<'} </Text>
              </TouchableOpacity> 


              <TouchableOpacity style={styles.rightButtonContainer} onPressIn={this.przesGora} onPressOut={this.stopTimer}>
                <Text style={styles.button}>^</Text>
              </TouchableOpacity> 

              <TouchableOpacity style={styles.rightButtonContainer} onPressIn={this.zmniejszPion} onPressOut={this.stopTimer}>
                <Text style={styles.button}>ZPion</Text>
              </TouchableOpacity> 

          </View>
          
          <View style={styles.rowButtonsContainer}>

              <TouchableOpacity style={styles.leftButtonContainer} onPressIn={this.zwiekszPoz} onPressOut={this.stopTimer}>
                <Text style={styles.button}>RPoz</Text>
              </TouchableOpacity> 


 
              <TouchableOpacity style={styles.centerButtonContainer} onPressIn={this.przesDol} onPressOut={this.stopTimer}>
                <Text style={styles.button}>v</Text>
              </TouchableOpacity> 


              <TouchableOpacity style={styles.rightButtonContainer} onPressIn={this.przesPrawo} onPressOut={this.stopTimer}>
                <Text style={styles.button}>{'\>'}</Text>
              </TouchableOpacity> 

              <TouchableOpacity style={styles.rightButtonContainer} onPressIn={this.zmniejszPoz} onPressOut={this.stopTimer}>
                <Text style={styles.button}>ZPoz</Text>
              </TouchableOpacity> 

          </View>

          <View style={styles.rowButtonsContainer}>

              <TouchableOpacity style={styles.leftButtonContainer} onPress={() => this.dodajKomorke()}>
                <Text style={styles.button}>+</Text>
              </TouchableOpacity> 


 
              <TouchableOpacity style={styles.centerButtonContainer} onPress={() => this.usunKomorke()}>
                <Text style={styles.button}>-</Text>
              </TouchableOpacity> 


              <TouchableOpacity style={styles.rightButtonContainer} onPressIn={this.zmniejszOdstep} onPressOut={this.stopTimer}>
                <Text style={styles.button}>Ods-</Text>
              </TouchableOpacity> 

              <TouchableOpacity style={styles.rightButtonContainer} onPressIn={this.zwiekszOdstep} onPressOut={this.stopTimer}>
                <Text style={styles.button}>Ods+</Text>
              </TouchableOpacity> 

          </View>

          <View style={styles.rowButtonsContainer}>

              <TouchableOpacity style={styles.leftButtonContainer} onPress={() => this.testPhoto()}>
                <Text style={styles.button}>Testuj</Text>
              </TouchableOpacity> 

          </View>

      </View>     
      </View>

  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  video: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: -200,
    height: 200,
    width: 320,
  },
  videoContainer: {
    padding: 130,
    marginTop: 80,

  },
  rowButtonsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 35,
    flexDirection: 'row',  
    
  },
  button: {
    textAlign: "center",
    color: "#FFFFFF",
  },
  leftButtonContainer: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 40,
    marginTop: 20,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonContainer: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 40,
    marginTop: 20,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  rightButtonContainer: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 40,
    marginTop: 20,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
