import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  Keyboard,
  AsyncStorage,
  Alert
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Prompt from 'react-native-prompt';
import { LineChart, YAxis, XAxis } from 'react-native-svg-charts'
import Calendar from 'react-native-calendar-select';
var SQLite = require('react-native-sqlite-storage');

var update =false;
var updated = false;

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      realData: [],
      label: [],
      realLabel: [],
      pickerValue: '1',
      firstDayPicker: '',
      firstDayPickerId: '',
      lastDayPicker: '',
      lastDayPickerId: '',
      length: 0,
      text: 'Brak danych',
      message: '',
      promptVisible: false,
      serverName: '',
      days: [],
      daysId: [],
      actualCounterState: '',
      firstDate: '',
      startDate: '2018-05-08',  
      endDate: '2018-05-14',
      startd: '',
      endd: '',
      cost1 : 0,
      cost2: 0,
      lastDay: '',
      lastTime:'',
      ipAddress: '',
      serverName: '',
      fday: '',
      lday: '',
    }
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.changeUpdated = this.changeUpdated.bind(this);
    this.makeChart = this.makeChart.bind(this);
    this.makeChartCD = this.makeChartCD.bind(this);
    this.chartStepTwo = this.chartStepTwo.bind(this);
    this.debugChart = this.debugChart.bind(this);
    this.refreshChart = this.refreshChart.bind(this);
    this.anomalia = this.anomalia.bind(this);
    this.delay = this.delay.bind(this);
  }

  static navigationOptions = {
    title: 'Wykres',
    header: null,


  };

  getDates = async() => {

    
    var cost = ""
    var sn = "";
    try{
       cost = await AsyncStorage.getItem('cost');
       sn = await AsyncStorage.getItem('serverName');




    }catch(error){
      alert(error);
  }
  if(cost==null) this.setState({message: '10.76'})
  else this.setState({message: cost})
  this.setState({serverName : sn})
  var db = SQLite.openDatabase({name: "database"+this.state.serverName+ ".db"});
  db.transaction((tx) => {
  tx.executeSql('SELECT * FROM date', [], (tx, results) => {
   var help = results.rows.item(0);
   this.setState({firstDate : help.day})
  })
 })
  let today = new Date();
  tyear = today.getFullYear();
  tmonth = today.getMonth()+1;
  tday = today.getDate();

  let past7 = new Date();
  past7.setDate(past7.getDate() -6);
  
  pyear = past7.getFullYear();
  pmonth = past7.getMonth()+1;
  pday = past7.getDate();

  if(tmonth < 10) tmonth = "0"+tmonth;
  if(pmonth < 10) pmonth = "0"+pmonth;
  if(tday < 10) tday = "0"+tday;
  if(pday < 10) pday = "0"+pday;
  
  // alert(tyear + "-"+tmonth+"-"+tday+'\n'+pyear + '-'+ pmonth+'-'+pday)
  
  this.setState({endDate : tyear + "-"+tmonth+"-"+tday, startDate: pyear + '-'+ pmonth+'-'+pday})
  setTimeout(this.makeChart, 150);
  }


  confirmDate({startDate, endDate, startMoment, endMoment}) {
    tyear = endDate.getFullYear();
    tmonth = endDate.getMonth()+1;
    tday = endDate.getDate();


    pyear = startDate.getFullYear();
    pmonth = startDate.getMonth()+1;
    pday = startDate.getDate();
    
    if(tmonth < 10) tmonth = "0"+tmonth;
    if(pmonth < 10) pmonth = "0"+pmonth;
    if(tday < 10) tday = "0"+tday;
    if(pday < 10) pday = "0"+pday;
    this.setState({endDate : tyear + "-"+tmonth+"-"+tday, startDate: pyear + '-'+ pmonth+'-'+pday})
    setTimeout(this.makeChart, 150);
  }
  openCalendar() {
    this.calendar && this.calendar.open();
  }

  changeUpdated(){
    updated = true;
    this.forceUpdate();
  }


  makeChart() {
    this.setState({ data: [], realData: [], label: [], realLabel: []})
    var db = SQLite.openDatabase({name: "database"+this.state.serverName+ ".db"});
    var startd = 0;
    var endd = 0;
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM date', [], (tx, results) => {
          var len = results.rows.length;
          for(var i = 0 ; i<len;i++){
            item = results.rows.item(i);
            if(this.state.startDate == item.day) {startd = i+1;
              this.setState({startd : startd})
            }

            if(this.state.startDate <= item.day && this.state.endDate >= item.day){
              let help = item.day
              if(this.state.startDate == item.day){
                this.setState({fday : help[8]+help[9]+"."+help[5]+help[6]})
              }
              if(this.state.endDate == item.day){
                this.setState({lday : help[8]+help[9]+"."+help[5]+help[6]})
              }
              var help2 = help[8]+help[9]+"."+help[5]+help[6]
              if(this.state.realLabel.length == 0 ) this.setState({realLabel : [help2]})
              else this.setState({realLabel : [...this.state.realLabel, help2]})
            }
            if(this.state.endDate == item.day) {endd = i+1;
              this.setState({endd:endd})
            }
          

            this.setState({label: [...this.state.label, item.day]})

          }

        });
      });
      setTimeout(this.makeChartCD, 1500);
    }

    makeChartCD() {
      // alert(this.state.startd + " " + this.state.endd)
      var firstItem = false;
      var cost =0;
      var cost2=0;
      var cost3 = 0;
      var db = SQLite.openDatabase({name: "database"+this.state.serverName+ ".db"});
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM ex_table', [], (tx, results) => {
          var len = results.rows.length;
          var help = results.rows.item(len-1);
          // alert(help.value + " " + help.day_id)
          this.setState({actualCounterState : help.value})

          for(var i=0;i<len;i++){
            var item = results.rows.item(i);
            // alert(item.day_id + " >= " + this.state.startd +"   "+ item.day_id + " <= " + this.state.endd)
            if(item.day_id >= this.state.startd && item.day_id <=this.state.endd) {
              if(!firstItem){
                this.setState({cost1 : item.value})
                firstItem=true;
              }
                this.setState({cost2 : item.value})
                
              // alert(item.value)
              this.setState({data : [...this.state.data, item.value]})
            }
          }

        });

        
    });
    this.setState({text : cost})
    setTimeout(this.chartStepTwo, 1000);

  }

  chartStepTwo() {
    var len = this.state.data.length
    let counter = len/15 +1
    counter = parseInt(counter);
    // var help = len%counter;
    for(var i = 0 ; i < len-counter-counter ; i = i+counter){
      this.setState({realData : [...this.state.realData, this.state.data[i+counter]-this.state.data[i]]})
      // alert(this.state.data[i])
    }
    setTimeout(() => {this.delay(len,counter)}, 1500);

    this.setState({text : this.state.cost2 - this.state.cost1})

    
    setTimeout(this.debugChart, 1600);
  }

  delay(len,counter) {
    this.setState({realData : [...this.state.realData, this.state.data[len-1]-this.state.data[len-counter-1]]})
    setTimeout(this.changeUpdated, 1000);
  }

  debugChart() {
    // alert(this.state.realData)
  }

  setDays = async() => {
    var ip = "";
        var sn="";
        try{
            ip = await AsyncStorage.getItem('ipAddress');
            sn = await AsyncStorage.getItem('serverName');
        }catch(error){
            alert(error);
        }
    this.setState({ipAddress : ip, serverName: sn})
    var lastDay = await AsyncStorage.getItem('lastDay');
    var lastTime = await AsyncStorage.getItem('lastTime');
    this.setState({lastDay : lastDay});
    this.setState({lastTime : lastTime});
    setTimeout(this.changeUpdated, 250);
    
  }
  refreshChart = () => {
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
            // alert(res);
            var obj = JSON.parse(res)
            if(obj.error == 'you are not logged in') alert("Nie jesteś zalogowany")
            else{
            
            try{
            AsyncStorage.setItem('lastDay',obj[obj.length-1].day_id);
            AsyncStorage.setItem('lastTime',obj[obj.length-1].time);
            }
            catch(err){
              alert(error)
            }

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
                    tx.executeSql("INSERT INTO ex_table VALUES (?,?,?)",[obj[i].day_id, '\'' + obj[i].time+'\'', obj[i].value] , (tx, results) => {
                        console.log("Dane tabeli 'ex_table' zaimportowane." + obj[i].day_id+ obj[i].time+ obj[i].value);
                      });
                    }

              });


            }



            setTimeout(this.makeChart, 1500);
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
      
      Alert.alert('Alarm', 'Wykryto anomalię',   [
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

checkCounter = () => {
  this.props.navigation.navigate('CounterUpdate')
}

  render() {
  let customI18n = {
    'w': ['', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'],
    'weekday': ['', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
    'month' : ['','Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
    'text': {
      'start': 'Początek',
      'end': 'Koniec',
      'date': 'Data',
      'save': 'Potwierdź',
      'clear': 'Reset'
    },
    'date': 'DD / MM'  // date format
  };
  const contentInset = { top: 20, bottom: 20 }
    if(!update){
      this.getDates();
      this.setDays();
      setTimeout(this.changeUpdated, 1000);
      this.anomalia();
      update = true;
    }

    return (
      <View style={{ alignItems: 'center' }}>
      
      <TouchableOpacity style={styles.buttonContainer}
        onPress={this.openCalendar}>
          <Text style={styles.button}>Zmień daty</Text>
      </TouchableOpacity> 

      {updated ?       <Calendar
        i18n="en"
        ref={(calendar) => {this.calendar = calendar;}}
        customI18n={customI18n}
        format="YYYY-MM-DD"
        minDate={this.state.firstDate}
        maxDate={this.state.endDate}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        onConfirm={this.confirmDate}
      /> : null}
  
  <View style={ { height: 200, flexDirection: 'row'} }>
                <YAxis
                  data={this.state.realData}
                  contentInset={ contentInset }
                  svg={{
                      fill: 'grey',
                      fontSize: 10,
                  }}
                  formatLabel={ value => `${value}m3` }
                />
                <View style= { {width: 300} }>
                <LineChart
                    style={ { flex: 1, marginLeft: 16 } }
                    data={this.state.realData}
                    svg={{ stroke: "#000000"  }}
                    contentInset={ contentInset }
                
                />
                </View>
        </View>
        <View style={{ height: 200, padding: 10, bottom: 20, width: 300, left: 20}}>
            <XAxis
                style={{ marginHorizontal: -10 }}
                data={ this.state.realLabel }
                formatLabel={ value => this.state.realLabel[value] }
                contentInset={{ left: 10, right: 10 }}
                svg={{ fontSize: 10 }}
            />
        </View>
        <View style={styles.textContainer}>
        <Text>Okres rozliczeniowy: {this.state.fday} : {this.state.lday} </Text>
        <Text> Zużycie mediów: {this.state.text} [jednostka]</Text> 
        <Text> Koszt wynosi: {this.state.text * parseFloat(this.state.message)}zł  </Text>
        <TouchableOpacity style={styles.buttonContainer}
                   onPress={() => this.setState({ promptVisible: true })} >
                        <Text style={styles.button}>Zmień cenę mediów</Text>

                        

        </TouchableOpacity> 
        <Text> Aktualny stan licznika: {this.state.actualCounterState}</Text>
        <Prompt
        keyboardType='numeric'
    title="Zmień cenę mediów"
    placeholder="Start typing"
    defaultValue= {this.state.message}
    visible={ this.state.promptVisible }
    onCancel={ () => this.setState({
      promptVisible: false,
    }) }
    onSubmit={ (value) => {AsyncStorage.setItem('cost',value)
    this.setState({
      promptVisible: false,
      message : value,
    })
  }
      
    }/>
        </View>
        <TouchableOpacity style={styles.buttonContainer2}
                    onPress={this.refreshChart}
                    >
                        <Text style={styles.button}>Odśwież wykres</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer2}
          onPress={this.checkCounter}>
            <Text style={styles.button}>Sprawdź wartość</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
    flex: 2,
    marginTop: -150,
  },
  getStartedText: {
    fontSize: 17,
    color: '#3A3A3A',
    lineHeight: 24,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    height: 40,
    width: 150,
  },
  buttonContainer2: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 30,
    height: 40,
    width: 150,
    top: 100,
  },
  button: {
    textAlign: "center",
    color: "#FFFFFF",
  },
  PickersContainer: {
    flexDirection: "row",
  },
});
