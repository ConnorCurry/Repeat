import * as React from 'react';
import { Text, View, TouchableOpacity, ActionSheetIOS, Alert, Dimensions, Platform, Image, Keyboard, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../Components/Button';
import { styles } from '../Styles/Style.js';
import { practiceStyles } from '../Styles/PracticeScreenStyles.js';
import { Timer } from "../Components/Timer.js";
import { GoalProgress } from '../Components/GoalProgress.js';
import { PracticeObjects } from '../Components/PracticeObjects';
import { useFocusEffect } from '@react-navigation/native';

let months = ['0', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let day = ['0', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '27th', '28th', '29th', '30th', '31st']
let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;

function practiceWindow() {
    const [sessionDate, setSessionDate] = React.useState();
    const [timerControl, setTimerControl] = React.useState('none')
    const [currentInstrument, setCurrentInstrument] = React.useState(["PianoTest", "Test", 30]);
    const [dateKey, setDateKey] = React.useState(Date.now() + "key")
    let timePracticed;
    const timeCallBack = (newTime) => {
        overwrite(newTime)
        timePracticed = newTime;
    }
    const getFullDate = () => {
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        date = day[date];
        month = months[month];
        let temp = (month + " " + date);
        return temp;
    }
    const [date, setDate] = React.useState(getFullDate);
    const [practicing, setPracticing] = React.useState(false);
    const [practiceObjects, setPracticeObjects] = React.useState([]);
    const saveNew = async (startDate) => {
        let info;
        try {
            const jsonValue = await AsyncStorage.getItem(startDate)
            info = JSON.parse(jsonValue)
        } catch(e) {console.log("Load failed: " + e)}
        try {
            let sessionData = {date: sessionDate, instrument: currentInstrument, objects: practiceObjects, time: 0, key: dateKey}
            if (info != null) {
                info.push(sessionData)
            } else info = [sessionData]
            const jsonValue = JSON.stringify(info)
            await AsyncStorage.setItem(startDate, jsonValue)
        } catch(e) {console.log("Save failed overall\n" + e)}
    }
    const overwrite = async (minutesElapsed) => {
        let info;
        try {
            const jsonValue = await AsyncStorage.getItem(sessionDate)
            info = JSON.parse(jsonValue)
        } catch(e) {console.log("Load failed: " + e)}
        try {
            let sessionData = {date: sessionDate, instrument: currentInstrument, objects: practiceObjects, time: minutesElapsed, key: dateKey}
            if (info != null) {
                let index = info.length - 1 
                info[index] = (sessionData)
            } else info = [sessionData]
            const jsonValue = JSON.stringify(info)
            await AsyncStorage.setItem(sessionDate, jsonValue)
        } catch(e) {console.log("Save failed overall\n" + e)}
    }

    /* Pracitcing Screen, shown while practicing ---------------------------------------------------------------- */
    const PracticingScreen = () => {
        const stopTimer = () => {
            setPracticing(false);
            setTimerControl("stop");
            overwrite()
        }
        const pauseTimer = () => {
            setTimerControl("pause");
            overwrite()
        }
        const resumeTimer = () => {
            setTimerControl("resume")
        }
        const [rerender, setRerender] = React.useState(0)
        return(
            <View style={{justifyContent:"space-between", flex: 1, width: "100%"}}>
                <PracticeObjects setPracticeObjects={setPracticeObjects} practiceObjects={practiceObjects} setRerender={setRerender} rerender={rerender}/>
                <GoalProgress instrument={currentInstrument}/>
                <View style={practiceStyles.stopPauseView}>
                    <TouchableOpacity onPress={() => stopTimer()} style={practiceStyles.stopButton}>
                        <Text allowFontScaling={false} style={practiceStyles.stopText}>Stop Practicing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pauseTimer()} style={practiceStyles.pauseButton}>
                        <Text allowFontScaling={false} style={practiceStyles.pauseText}>Pause</Text>
                    </TouchableOpacity>
                </View>
            
                {timerControl == "pause" ?
                    <TouchableOpacity style={practiceStyles.pauseOverlay} activeOpacity={.9} onPress={() => {resumeTimer()}}>
                        <Text allowFontScaling={false} style={practiceStyles.pauseOverlayText}>Paused</Text>
                        <MaterialIcons name='pause' size={screenSize * 5} color= 'rgba(255,255,255,.7)' />
                        <Text allowFontScaling={false} style={practiceStyles.pauseOverlayResumeText}>Tap to resume</Text>
                    </TouchableOpacity> : null}
                    {rerender ? null : null}
            </View>
        )
    }

    /* Starting Screen before practicing----------------------------------------------------------------------------- */
    const PracticeStartScreen = () => {
        const [instrumentArray, setInstrumentArray] = React.useState([])
        const [selectedInstrument, setSelectedInstrument] = React.useState()
        const startTimer = async () => {
            let startDate = new Date
            setTimerControl('start')
            setPracticing(true)
            let start = ((startDate.getMonth() + 1) + "-" + startDate.getDate() + "-" + startDate.getFullYear())
            setSessionDate(start)
            setDateKey(Date.now())
            await setPracticeObjects([])
            saveNew(start)
        }
        useFocusEffect(() => {
            const loadInstrumentsLaunch = async () => {
                try{
                    const jsonValue = await AsyncStorage.getItem('instrumentArray');
                    let instruments = JSON.parse(jsonValue);
                    let temp = []
                    instruments.forEach((item) => {
                        temp.push({label: item.name, value: [item.key, item.name, item.goal]})
                    })
                    setInstrumentArray(temp)
                } catch (e) {
                    console.log("Error loading instruments: ", e)
                }
            }
            if (!practicing){
                loadInstrumentsLaunch()
            }
        }, [])
        const loadInstruments = async () => {
            try{
                const jsonValue = await AsyncStorage.getItem('instrumentArray');
                let instruments = JSON.parse(jsonValue);
                let temp = []
                instruments.forEach((item) => {
                    temp.push({label: item.name, value: [item.key, item.name, item.goal]})
                })
                setInstrumentArray(temp)
            } catch (e) {
                console.log("Error loading instruments: ", e)
            }
        }
        const [pickerIndex, setPickerIndex] = React.useState(0);
        return (
            <View style={practiceStyles.practicingView}>
                <View>
                    <Text allowFontScaling={false} style={practiceStyles.text}>Instrument:</Text>
                    <RNPickerSelect
                        placeholder={{label: "Pick an instrument", value: "Select an Instrument"}}
                        onOpen={() => loadInstruments()}
                        useNativeAndroidPickerStyle={false}
                        onValueChange={(value, label) => {setSelectedInstrument(value); setPickerIndex(label)}}
                        items={instrumentArray}
                        Icon={() => {return null;}}
                        style={{inputAndroid: practiceStyles.instrumentPickText, 
                            inputIOS: practiceStyles.instrumentPickText, 
                            placeholder: practiceStyles.instrumentPickText,
                            chevron: {opacity:0}
                            }}
                    />
                </View>
                <TouchableOpacity onPress={() => {if(pickerIndex != 0) {startTimer(); setCurrentInstrument(selectedInstrument)} else{Alert.alert("No Instrument Selected", "Please select an instrument to practice with")}}} style={practiceStyles.startPracticingButton}>
                    <Text allowFontScaling={false} style={practiceStyles.startButtonText}>Start{"\n"}+</Text>
                </TouchableOpacity>
                <View>
                    <Text allowFontScaling={false} style={practiceStyles.text}>Press Start to{"\n"}begin practicing</Text>
                </View>
            </View>
        )
    }

    return(
        <View style={styles.practiceContainer}>
            <View style={styles.practiceHeader}>
                <Text allowFontScaling={false} style={styles.practiceHeaderText}>{date}</Text>
                <Timer starter={timerControl} time={timeCallBack} currentInstrument={currentInstrument}/>
            </View>
            <View style={practiceStyles.practicingView}>
                {practicing ? <PracticingScreen/> : <PracticeStartScreen/>}
            </View>
        </View>
    )
}

const Stack = createStackNavigator();
export function PracticeScreen({navigation}) {
    const [keyboardShowing, setKeyboardShowing] = React.useState(false);
    React.useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        // cleanup function
        return () => {
          Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
          Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
      }, []);
    const _keyboardDidShow = () => {
        setKeyboardShowing(true)
    }
    const _keyboardDidHide = () => {
        setKeyboardShowing(false)
    }
    return(
        <Stack.Navigator>
            <Stack.Screen name="Practice" component={practiceWindow}
            options={{
                headerTitleAllowFontScaling: false,
                headerStyle: {backgroundColor: "mediumpurple", shadowColor: 'mediumpurple', elevation: 0,},
                headerTintColor: "white",
                headerTitleStyle: {fontFamily: 'Signika_600SemiBold'},
                headerRight: () => (
                    <View style={{marginRight: 5}}>
                        {keyboardShowing ? 
                        <Button title={"Done"} onPress={() => Keyboard.dismiss()} color={"white"} />
                        : 
                        null}
                    </View>
                ),
            }}
            />
        </Stack.Navigator>
    )
}