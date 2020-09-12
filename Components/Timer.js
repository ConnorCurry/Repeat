import * as React from "react";
import { Text, View, } from "react-native";
import {styles} from "../Styles/Style"

export function Timer({starter, time}) {
    const [minutes, setMinutes] = React.useState(0);
    const [intervalID, setIntervalID] = React.useState();
    const [preTime, setPreTime] = React.useState(0);
    const startTimer = React.useEffect(() => {
        if (starter == "start") {
            let min = minutes;
            let startTime = new Date().getTime()
            setIntervalID(setInterval(() => {
                min = Math.round((new Date().getTime() - startTime) / 60000); //set to 60000
                setMinutes(min)
                time(min)
            }, 5000)
            )
        }
    },[starter])
    
    const stopTimer = React.useEffect(() => {
        if (starter == "stop") {
            try{clearInterval(intervalID); 
                time(minutes)
                clearTimer()   
            }
            catch(e){console.log("no timer started")}
        }
    }, [starter])

    const pauseTimer = React.useEffect(() => {
        if (starter == "pause") {
            clearInterval(intervalID)
            setPreTime(minutes)
            time(minutes)
        }
    },[starter])

    const resumeTimer = React.useEffect(() => {
        let saveInt = 0
        if (starter == 'resume') {
            let min = minutes;
            let startTime = new Date().getTime()
            setIntervalID(setInterval(() => {
                min = Math.round((new Date().getTime() - startTime) / 60000); //set to 60000
                min += preTime
                setMinutes(min)
                time(min)
            }, 5000)
            )
        }
    } ,[starter])
    
    const clearTimer = () => {
        setMinutes(0);
    }
    return(
        <View style={{flexDirection: 'row'}}>
            {minutes < 60 ? null
            :
            <View>
                {Math.floor(minutes/60) > 1 ?
                <Text allowFontScaling={false} style={styles.innerPracticeHeaderText}>{Math.floor(minutes/60)} hrs</Text>
                :
                <Text allowFontScaling={false} style={styles.innerPracticeHeaderText}>{Math.floor(minutes/60)} hr</Text>
                }
            </View>}
            <View>
                {minutes % 60 != 1 ?
                <Text allowFontScaling={false} style={styles.practiceHeaderText}>{minutes % 60} mins</Text>
                :
                <Text allowFontScaling={false} style={styles.practiceHeaderText}>{minutes % 60} min</Text>}
            </View>
        </View>
    )
}