import * as React from 'react';
import { Text, View, Button, TouchableOpacity, Dimensions } from 'react-native';
import { calendarStyles } from '../Styles/CalendarStyles';
import { AntDesign } from '@expo/vector-icons'

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
let current = new Date()
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let todayMonth = current.getMonth();
let todayYear = current.getFullYear();

export function Calendar({callbackDay, callbackMonth, callbackYear}) {
    const [month, setMonth] = React.useState(todayMonth);
    const [year, setYear] = React.useState(todayYear);
    const [selectedDay, setSelectedDay] = React.useState(current.getDate())
    const prevMonth = () => {
        let temp;
        if (month != 0) {
            temp = month - 1;
        } else {
            temp = 11
            prevYear()
        }
        setMonth(temp);
        callbackMonth(temp);
    }
    const nextMonth = () => {
        let temp;
        if (month != 11) {
            temp = month + 1;
        } else {
            temp = 0;
            nextYear();
        }
        setMonth(temp);
        callbackMonth(temp);
    }
    const prevYear = () => {
        let temp = year - 1;
        setYear(temp);
        callbackYear(temp);
    }
    const nextYear = () => {
        let temp = year + 1;
        setYear(temp);
        callbackYear(temp);
    }
    const setDay = (day) => {
        setSelectedDay(day);
        callbackDay(day);
    }
    const getFirstDay = () => {
        let firstDay = new Date(year,month,1).getDay()
        return firstDay
    }
    const getMaxDays = () => {
        let maxDays = nDays[month]
        if (month == 1) {
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                maxDays += 1;
            }
        }
        return(maxDays)
    }
    const generateCalendarArray = () => {
        let calendarArray = [[],[],[],[],[],[]]
        return(calendarArray)
    }
    const BuildCalendar = () => {
        let calendarArray = generateCalendarArray()
        let maxDays = getMaxDays()
        let firstDay = getFirstDay()
        let counter = 1;
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                if (row == 0 && col >= firstDay) {
                    calendarArray[row][col] = counter++;
                } else if (row > 0 && counter <= maxDays) {
                    calendarArray[row][col] = counter++;
                } else if (row == 0 && col < firstDay) {
                    calendarArray[row][col] = -1;
                }
            }
        }
        return(calendarArray)
    }
    function CalendarBody () {
        let calendarArray = BuildCalendar();
        return(
            <View style={{marginTop: 5}}>
                {calendarArray.map((row) => {
                    let x = row.map((item) => {
                        if (item != -1) {
                            return(
                                <TouchableOpacity style={{backgroundColor: (selectedDay != item) ? 'white' : 'mediumpurple', 
                                    borderRadius: screenSize * 6, 
                                    fontWeight: (item != current.getDate() || month != current.getMonth() || year != current.getFullYear()) ? "normal" : "bold",
                                    justifyContent: 'center',
                                    textAlignVertical: 'center',                                    
                                    width: screenSize * 7, 
                                    height: screenSize * 7,}}
                                    onPress={() => setDay(item)}
                                    >
                                    <Text allowFontScaling={false} style={{fontWeight: (item != current.getDate() || month != current.getMonth() || year != current.getFullYear()) ? "normal" : "800",
                                        color: (selectedDay == item) ? "white" : "black", 
                                        fontSize: screenSize * 3.3,
                                        textAlign: 'center', 
                                        textAlignVertical: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center'
                                    }}>{item != -1 ? item : ' '}</Text>
                                </TouchableOpacity>
                            )
                        } else {
                            return (
                                <View style={{width: screenSize * 7, height: screenSize * 7}}>
                                    <Text></Text>
                                </View>
                            )
                        }
                    })
                    return(
                        <View style={{flexDirection: 'row', alignContent: 'space-between'}}>{x}</View>
                    )
                })}
            </View>
        )
    }
    return (
        <View style={{width: '100%', alignItems: 'center', flex: 1, marginTop: 20, }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width:"90%"}}>
                <TouchableOpacity onPress={() => prevMonth()}><AntDesign name={'left'} size={screenSize * 4.5} color="#147efb" style={{alignContent: "center", justifyContent:"center"}}/></TouchableOpacity>
                <Text allowFontScaling={false} style={calendarStyles.monthText}>{months[month]} {year}</Text>
                <TouchableOpacity onPress={() => nextMonth()}><AntDesign name={'right'} size={screenSize * 4.5} color="#147efb" style={{alignContent: "center", justifyContent:"center"}}/></TouchableOpacity>
            </View>
            <View style={{marginTop: screenSize * 2}}>
                <View style={{flexDirection: 'row', borderBottomColor: 'lightgray', borderBottomWidth: 1}}>
                    <Text allowFontScaling={false} style={calendarStyles.weekdays}>S</Text>
                    <Text allowFontScaling={false} style={calendarStyles.weekdays}>M</Text>
                    <Text allowFontScaling={false} style={calendarStyles.weekdays}>T</Text>
                    <Text allowFontScaling={false} style={calendarStyles.weekdays}>W</Text>
                    <Text allowFontScaling={false} style={calendarStyles.weekdays}>T</Text>
                    <Text allowFontScaling={false} style={calendarStyles.weekdays}>F</Text>
                    <Text allowFontScaling={false} style={calendarStyles.weekdays}>S</Text>
                </View>
                <CalendarBody/>
            </View>
        </View>
    )
}