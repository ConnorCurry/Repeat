import * as React from 'react';
import { Text, View, TouchableOpacity, Dimensions, TouchableHighlight, Keyboard, Button } from 'react-native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../Styles/Style.js';
import { OldSession } from './OldSessionScreen'
import { calendarStyles } from '../Styles/CalendarStyles.js';
import { Calendar } from '../Components/Calendar';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native-gesture-handler';

function CalendarWindow({ route, navigation }) {
    let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
    let current = new Date();
    const [selectedDay, setSelectedDay] = React.useState(current.getDate())
    const [month, setMonth] = React.useState(current.getMonth());
    const [year, setYear] = React.useState(current.getFullYear());
    const loadData = async (sessionDate) => {
        try {
            const jsonValue = await AsyncStorage.getItem(sessionDate)
            let info = JSON.parse(jsonValue)
            setDayInfo(info)
            
        } catch(e) {console.log("Load failed: " + e)}
    }
    const [dayInfo, setDayInfo] = React.useState()
    
    useFocusEffect(
        React.useCallback(() => {
            loadData((month+1) + "-" + selectedDay + "-" + year);
        },[])
    );

    const callbackDay = (day) => {
        setSelectedDay(day);
        loadData((month+1) + "-" + day + "-" + year)
    }
    const callbackMonth = (month) => {
        setMonth(month);
        loadData((month+1) + "-" + selectedDay + "-" + year)
    }
    const callbackYear = (year) => {
        setYear(year);
        loadData((month+1) + "-" + selectedDay + "-" + year)
    }
    const loadSession = (session) => {
        try{
            navigation.navigate('OldSession', {session: session, day: selectedDay, month: month, year: year, index: session.index,})
        } catch(e) {console.log(e)}
    }
    function RenderSessions(params) {
        return(
            <TouchableOpacity style={{borderWidth: 1, marginTop: -1, borderColor: 'lightgray'}} 
            underlayColor={'lightgray'} 
            onPress={() => {try{loadSession(params)} catch(e){console.log(e)}}}>
                <Text allowFontScaling={false} style={{margin: 10, fontSize: screenSize * 2.5, fontWeight: 'bold', marginBottom: 0}}>
                {params.session.instrument[1]}
                </Text>
                <Text allowFontScaling={false} style={{margin: 10, fontSize: screenSize * 2.5, marginTop: 0}}>
                Practiced: {params.session.time}  Goal: {params.session.instrument[2]}
                </Text>
            </TouchableOpacity>
        )
    }
    return(
        <View style={styles.container}>
            <View style={calendarStyles.calendarView}>
                <Calendar callbackDay={callbackDay} callbackMonth={callbackMonth} callbackYear={callbackYear}/>
            </View>
            <View style={calendarStyles.dateDetails}>
                {dayInfo == null ? 
                <Text allowFontScaling={false} style={{color: 'gray', fontSize: screenSize * 2.5, fontStyle: 'italic'}}>
                    No data found for this day
                </Text>
                :
                <FlatList
                    style={{width: '100%'}} 
                    data={dayInfo}
                    renderItem={({item, index}) => <RenderSessions session={item} index={index}/>}
                />
                }
            </View>
        </View>
    )
}
const Stack = createStackNavigator();
export function CalendarScreen({navigation}) {
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
            <Stack.Screen name="Calendar" component={CalendarWindow}
            options={{
                headerTitleAllowFontScaling: false,
                headerStyle: styles.headerStyle,
                headerTintColor: "white",
                headerTitleStyle: {fontFamily: 'Signika_600SemiBold'},
            }}
            />
            <Stack.Screen name="OldSession" component={OldSession} 
            options={{
                headerTitleAllowFontScaling: false,
                headerStyle: {backgroundColor: "mediumpurple", shadowColor: 'mediumpurple', elevation: 0,},
                headerTintColor: 'white',
                headerTitle: 'Practice',
                headerRight: () => (
                    <View>
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