import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
  AsyncStorage
} from 'react-native';
import {NavigationActions} from 'react-navigation';

var PORT = 5000;
var HOST = '0.0.0.0';
var dgram = require('react-native-udp');
var server = dgram.createSocket('udp4');
server.bind(PORT, HOST);
var ipSet = false;
var this2 = 0;
var j=0;
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class selectServer extends React.Component {
  static navigationOptions = {
    header: null,
    headerMode: 'screen',
    title: "Wybierz serwer",
  };

  constructor(props) {
    super(props);

    this.state = {
      dataIP: [],
      dataMessage: [],
      dataSource: ds.cloneWithRows([]),

    };
    this.startUdpClient = this.startUdpClient.bind();
    this2 = this;
}

    startUdpClient(){

        var canInsert=true;

        server.on('listening', function () {
          var address = server.address();
          console.log('UDP Server listening on ' + address.address + ":" + address.port);
        });
        
        server.on('message', function(message, remote)  {
            // alert(remote.address + ':' + remote.port +' - ' + String.fromCharCode.apply(null, message));
            for(var i=0; i<j; i++){
                if(this2.state.dataMessage[i] == String.fromCharCode.apply(null, message)) canInsert=false;
            }
            // alert(message)
            if(canInsert){
                this2.setState({ dataMessage: [...this2.state.dataMessage, String.fromCharCode.apply(null, message)] })
                this2.setState({dataIP: [...this2.state.dataIP, remote.address]})

                j++;
                // alert(String.fromCharCode.apply(null, message))
            }
            this2.setState({dataSource: ds.cloneWithRows(this2.state.dataMessage)})  
            // server.close();
            // this2.startUdpClient();
            
        });

        // server.on('message', function (message, remote) {
        //     alert(remote.address + ':' + remote.port +' - ' + String.fromCharCode.apply(null, message));
        
        // });
          
       
        
    }

    setIP(rowData) {
        len = rowData.length;
        var ip=false;
        var ipText="";
        var serverName="";
        for(var i =0 ; i<len;i++){
          if(rowData[i]===" ") {ip=true
            i++}
          
          if(ip==true) 
            ipText=ipText+rowData[i];
          else 
          serverName=serverName+rowData[i];
        }
        server.close();
        AsyncStorage.setItem('ipAddress',ipText);
        AsyncStorage.setItem('serverName',serverName);
        
        this.props.navigation.dispatch(NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'LoginScreen'})
          ]
        }));
    }

    checkIP = async() => {
      var ip="";
      try{
        ip = await AsyncStorage.getItem('ipAddress');

    }catch(error){
        alert(error);
    }
      if(ip!=null) {       
        this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'LoginScreen'})
        ]
      }));
      server.close();
      }
    }

  render() {


    if(!ipSet){
      this.checkIP();
      ipSet = true;
      this.startUdpClient();
    }


    
    return (
      <View style={styles.container}>
              <ListView
              contentContainerStyle={{alignItems : 'center'}}
        dataSource={this2.state.dataSource}
        renderRow={(rowData) =>  <Text style={styles.button2} onPress={this.setIP.bind(this, rowData)}>{rowData}</Text>}
          
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    
  },
  buttonContainer2: {
    backgroundColor: "#006cff",
    paddingVertical: 10,
    borderRadius: 20,
    width: 150,
    height: 40,
  },
  button: {
    textAlign: "center",
    color: "#FFFFFF",
  },
  button2: {
    color: "#000000",
    fontSize: 18,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
 
  },
 
});
