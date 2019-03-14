import React, {Component } from 'react';
import {StyleSheet, View, Image, Text, TextInput, TouchableOpacity, AsyncStorage, ToastAndroid, Keyboard} from 'react-native';
import RootNavigation from '../navigation/RootNavigation';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Prompt from 'react-native-prompt';
import '../shim.js'
import crypto from 'react-native-crypto';
var SQLite = require('react-native-sqlite-storage');
var ipSet = false;
export default class Login extends Component{
    static navigationOptions = {
        title: 'Logowanie',
        header: null,
        headerLeft: null,
        left: null,
      };
    constructor(props) {
        super(props);
        this.state = {
          login: '',
          password: '',
          messageAccept: '',
          messageFailed: '',
          data: [],
          firstTime: true,
          lastItem: '',
          lastDay: '',
          lastTime: '',
          ipAddress: '',
          serverName: '',
          promptVisible: false,
        }
        
    }

    setIp = async() => {
        var ip = "";
        var sn="";
        try{
            ip = await AsyncStorage.getItem('ipAddress');
            sn = await AsyncStorage.getItem('serverName');
        }catch(error){
            alert(error);
        }
        this.setState({ipAddress : ip, serverName: sn})
    }

    dbCreate = async() =>{

                AsyncStorage.setItem('FTime'+this.state.serverName,'no');

                fetch('http://'+ this.state.ipAddress + '/select_all.php',{
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
                    var obj = JSON.parse(res);
                  console.log("działa json.parse i stringify");
        
                    //"+this.state.serverName+ "
                    var db = SQLite.openDatabase({name: "database"+this.state.serverName+ ".db"});
                    try{
                    db.transaction((tx) => {
                        tx.executeSql('CREATE TABLE date( id INT PRIMARY KEY, day DATE UNIQUE)',[] , (tx, results) => {
                            console.log("Utworzono tabelę date");
                          });

                          tx.executeSql('CREATE TABLE ex_table( day_id INT, time TIME, value INT, PRIMARY KEY( day_id, time ), CONSTRAINT fk_date FOREIGN KEY ( day_id ) REFERENCES date( id ))',[] , (tx, results) => {
                            console.log("Utworzono tabelę ex_Table");
                          });

                        for(let i = 0; i< obj.length ; i++){
                        tx.executeSql('INSERT OR IGNORE INTO date VALUES (?,?)',[obj[i].id, obj[i].day] , (tx, results) => {
                            console.log("Dane tabeli 'date' zaimportowane.");
                          });
                        }
        
        
                        for(let i = 0; i< obj.length ; i++){
                            tx.executeSql('INSERT INTO ex_table VALUES (?,?,?)',[obj[i].day_id, obj[i].time, obj[i].value] , (tx, results) => {
                                console.log("Dane tabeli 'ex_table' zaimportowane." + i );
                              });
                            }
                            AsyncStorage.setItem('lastDay',obj[obj.length-1].day_id+"");
                            AsyncStorage.setItem('lastTime',obj[obj.length-1].time);
                            console.log("Zaimportowano lastDay " + obj[obj.length-1].day_id+ " lastTime: "+obj[obj.length-1].time);
                      });
                    }
                    catch(err){
                        alert(err)
                    }
        
        
        
                })
                .catch((error) => {alert(error);})
                .done();
        
                

               
            

    }
        errorCB(err){
            console.log("Error");
        }
        openCB(){
            console.log("Opened");
        }
        successCB(){
            console.log("Success");
        }
        



    

    loginText = (typedText) => {
        this.setState({login: typedText});
     }
    passwordText = (typedText) => {
        this.setState({password: typedText});
     }

    lastItemUpdate = async() => {
        var lastDay = await AsyncStorage.getItem('lastDay');
        var lastTime = await AsyncStorage.getItem('lastTime');
        this.setState({lastDay : lastDay});
        this.setState({lastTime : lastTime});
        this.dataUpdate();
    }


     dataUpdate = () => {
        var len = 0;
        var sel = "";
        
        
        
        var select = 'http://'+ this.state.ipAddress + '/select.php?day_id=' + this.state.lastDay + "&timeStart="+this.state.lastTime;
        // alert(select)
        fetch(select,{

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

            AsyncStorage.setItem('lastDay',obj[obj.length-1].day_id+"");
            AsyncStorage.setItem('lastTime',obj[obj.length-1].time);
            console.log("Zaimportowano lastDay " + obj[obj.length-1].day_id+ " lastTime: "+obj[obj.length-1].time);
            //"+this.state.serverName+ "
            var db = SQLite.openDatabase({name: "database"+this.state.serverName+ ".db"});
            db.transaction((tx) => {
                for(let i = 0; i< obj.length ; i++){
                tx.executeSql('INSERT OR IGNORE INTO date VALUES (?,?)',[obj[i].id, obj[i].day] , (tx, results) => {
                    console.log("Dane tabeli 'date' zaimportowane.");
                  });
                }


                for(let i = 0; i< obj.length ; i++){
                    tx.executeSql('INSERT INTO ex_table VALUES (?,?,?)',[obj[i].day_id, obj[i].time, obj[i].value] , (tx, results) => {
                        console.log("Dane tabeli 'ex_table' zaimportowane.");
                      });
                    }

              });


        




        })
        .catch((error) => {/*alert(error);*/})
        .done();

        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'RootNavigation'})
            ]
          }));
     }

    checkTime = async() =>{
        var ft = "";
        try{
            ft = await AsyncStorage.getItem('FTime'+this.state.serverName);
        }catch(error){
            alert(error);
        }
        
        if(ft != null){
            this.lastItemUpdate();
            
        }else{
            this.setState({promptVisible : true})
            this.dbCreate()
        }



        
        
        ToastAndroid.show("Zalogowano pomyślnie",ToastAndroid.SHORT);
        // this.props.navigation.navigate('RootNavigation')
        AsyncStorage.setItem('online','yes');
    }

    onPress = () => {
        var crypt = crypto.createHash('rmd160').update(this.state.password).digest("hex");
        crypt = crypto.createHash('sha256').update(this.state.password).digest("hex");
        crypt = crypto.createHash('md5').update(this.state.password).digest("hex");
        //'+ this.state.ipAddress + '
        var address = 'http://'+ this.state.ipAddress + '/login.php?login='+this.state.login+'&password='+crypt;
        // alert(address);
        fetch(address,{
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

        } )
        
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.result == "success"){
                this.checkTime();

            }
            var res = JSON.stringify(responseJson);  
            var obj = JSON.parse(res);
            if(obj.error == "you are already logged in"){

                fetch('http://'+this.state.ipAddress+'/logout.php',{
                    method: 'POST',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
        
                } )
                .done();
                setTimeout(this.onPress, 150);
            }
            if(obj.error == "wrong login or password") alert("Wprowadziłeś zły login lub hasło")
           
            
        })
        .catch((error) => {

        })
        .done();
        
          Keyboard.dismiss();
        
    }

    offline = () => {
        ToastAndroid.show("Jesteś offline. Twoja baza danych może być niezaktualizowana.",ToastAndroid.SHORT);
        AsyncStorage.setItem('online','no');
        this.props.navigation.navigate('RootNavigation')

    }


    changeServer = () => {
        ipSet = false;
        this.props.navigation.navigate('selectServer2')

    }
    register = () => {
        this.props.navigation.navigate('Register')
    }

 

    render() {
        if(!ipSet){
            ipSet=true;
            this.setIp();
        }
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image 
                    style={styles.logo}
                    source={require('../assets/images/icon.png')}
                    />
                    <Text style={styles.logoText}> Zaloguj się do aplikacji: </Text>
                </View>

                <View style={styles.loginContainer}> 

                    <TextInput placeholder="Login" placeholderTextColor="#7b7b7b" onChangeText={this.loginText} style={styles.input} returnKeyType="next" 
                        onSubmitEditing={() => this.passwordInput.focus()}
                        ref={(input) => this.loginInput = input}/>
                    <TextInput placeholder="Hasło" placeholderTextColor="#7b7b7b" onChangeText={this.passwordText}secureTextEntry style={styles.input} returnKeyType="go" 
                        ref={(input) => this.passwordInput = input} onSubmitEditing={() => {this.onPress()}}/>
                
                    <TouchableOpacity style={styles.buttonContainer}
                    onPress={this.onPress}
                    >
                        <Text style={styles.button}>Zaloguj</Text>
                    </TouchableOpacity>   
                    <View style = {styles.offlineContainer}>
                        <Text style = {styles.logoText}>Wersja offline: </Text>
                        <TouchableOpacity style={styles.buttonContainer2}
                            onPress={this.offline}>
                        <Text style={styles.button2}>OK</Text>
                        </TouchableOpacity> 

                                                <TouchableOpacity style={styles.buttonContainer2}
                            onPress={this.changeServer}>
                        <Text style={styles.button2}>Zmień serwer</Text>
                        </TouchableOpacity> 

                    </View>
                    <View style = {{top : 20}} >
                    <TouchableOpacity style={styles.buttonContainer}
                            onPress={this.register}>
                        <Text style={styles.button2}>Zarejestruj</Text>
                        </TouchableOpacity> 
                    </View>
                    <Prompt
    title="Wprowadź pierwszą wartość licznika"
    placeholder="Start typing"
    defaultValue= ''
    visible={ this.state.promptVisible }
    onCancel={ () => alert("Musisz wprowadzić wartość licznika!") }
    onSubmit={ (value) => {
        // alert('http://'+ this.state.ipAddress + '/add_row.php?value='+value)
      fetch('http://'+ this.state.ipAddress + '/add_row.php?value='+value,{
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
  
    } )
    this.setState({promptVisible : false})
    
    this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'RootNavigation'})
        ]
      }));
  }
      
    }/>
                </View>

            </View>

        );
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
        marginTop: 20,
    },
    logoText: {
        color: '#000000',
        textAlign: 'center',
        width: 220,
        fontSize: 18,
    },
    input: {
        alignItems: 'center',
        height: 40,
        backgroundColor: "#CACACA",
        marginBottom: 20,
        color: "#000",
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    buttonContainer: {
        backgroundColor: "#000000",
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: -10,
    },
    button: {
        textAlign: "center",
        color: "#FFFFFF",
    },
    textColorAccept: {
        fontSize: 20,
        color: "green",
        textAlign: 'center',
        marginTop: 30
    },
    textColorFailed: {
        fontSize: 20,
        color: "red",
        textAlign: 'center',
        marginTop: -25,
    },
    loginContainer: {
        marginBottom: 290,
        padding: 30,
    },
    offlineContainer: {
        width: 100,
        flexDirection: 'row', 
        marginTop: 100,
    },
    buttonContainer2: {
        backgroundColor: "#000000",
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: -10,
        width: 50,
    },
    button2: {
        textAlign: "center",
        color: "#FFFFFF",
    },
});