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
          secPassword: '',
          token: '',
          ipAddress: '',
          serverName: '',
  
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


    

    loginText = (typedText) => {
        this.setState({login: typedText});
     }
    passwordText = (typedText) => {
        this.setState({password: typedText});
     }
     secPasswordText = (typedText) => {
        this.setState({secPassword: typedText});
     }
     tokenText = (typedText) => {
        this.setState({token: typedText});
     }



     register = () => {
         if(this.state.login == '' || this.state.password == '' || this.state.secPassword == '' || this.state.token == '') alert("Musisz wypełnić wszystkie pola!")
         else if(this.state.password !== this.state.secPassword) alert("Hasła muszą być takie same!")
         else if(this.state.password.length < 8) alert("Hasło musi posiadać conajmniej 8 znaków")
         else{
            var crypt = crypto.createHash('rmd160').update(this.state.password).digest("hex");
            crypt = crypto.createHash('sha256').update(this.state.password).digest("hex");
            crypt = crypto.createHash('md5').update(this.state.password).digest("hex");

            var address = 'http://' + this.state.ipAddress + '/add_user.php?login='+this.state.login+'&password='+crypt+'&raspberryKey='+this.state.token;
            // alert(address)
            fetch(address,{
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
    
            } )
            
            .then((response) => response.json())
            .then((responseJson) => {
                var res = JSON.stringify(responseJson);  
                var obj = JSON.parse(res);
                if(obj.error == "user exists") alert("Taki użytkownik już istnieje!")
                else if(obj.error == "bad raspberry key") alert("Nieprawidłowy token!")
                else if(obj.result == "success") {alert("Konto zostało utworzone")
                this.props.navigation.goBack();
            }
            else alert("Nie udało się utworzyc konta")
            })
            .catch((error) => {alert(error);})
            .done();
            
            // this.comeBack();
         }
     }
     
     comeBack = () => {
         this.props.navigation.goBack();
     }

    render() {
        if(!ipSet){
            ipSet=true;
            this.setIp();
        }
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}> Utwórz nowe konto: </Text>
                </View>

                <View style={styles.loginContainer}> 

                    <TextInput placeholder="Login" placeholderTextColor="#7b7b7b" onChangeText={this.loginText} style={styles.input} returnKeyType="next" 
                        onSubmitEditing={() => this.passwordInput.focus()}
                        ref={(input) => this.loginInput = input}/>
                    <TextInput placeholder="Hasło" placeholderTextColor="#7b7b7b" onChangeText={this.passwordText} secureTextEntry style={styles.input} returnKeyType="next" 
                        ref={(input) => this.passwordInput = input} onSubmitEditing={() => this.secPasswordInput.focus()}/>

                    <TextInput placeholder="Powtórz hasło" placeholderTextColor="#7b7b7b" onChangeText={this.secPasswordText} secureTextEntry style={styles.input} returnKeyType="next" 
                        ref={(input) => this.secPasswordInput = input} onSubmitEditing={() => this.tokenInput.focus()}/>
                    
                    <TextInput placeholder="Token" placeholderTextColor="#7b7b7b" onChangeText={this.tokenText} style={styles.input} returnKeyType="go" 
                        ref={(input) => this.tokenInput = input} onSubmitEditing={() => {this.register()}}/>

                
                    <TouchableOpacity style={styles.buttonContainer}
                    onPress={this.register}
                    >
                        <Text style={styles.button}>Zarejestruj</Text>
                    </TouchableOpacity>   
                    <View style = {styles.offlineContainer}>
 


                    <TouchableOpacity style={styles.buttonContainer2}
                            onPress={this.comeBack}>
                        <Text style={styles.button2}>Powrót</Text>
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