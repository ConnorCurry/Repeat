import * as React from "react";
import { Animated, Text, View, Dimensions, Platform, Alert } from "react-native";
import * as Permissions from 'expo-permissions'
import { Button } from '../Components/Button'
import Swiper from 'react-native-swiper'
import { firstLaunchStyles } from '../Styles/FirstLaunchStyles'
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
export function FirstLaunch() {
    const slide = React.useRef(new Animated.Value(Dimensions.get("screen").height)).current;
    const slideIn = () => {
        Animated.timing(slide, {
        toValue: 0,
        duration: 800
        }).start();
    };
    React.useEffect(slideIn) 
    const slideOut = () => {
        Animated.timing(slide, {
        toValue: Dimensions.get("screen").height,
        duration: 800
        }).start();
    };
    const permissionsCheck = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
        await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        await Permissions.askAsync(Permissions.CAMERA)
    }
    const notificationCheck = async () => {
        await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS)
    }
    
    const SwiperStack = () => {
        const [userName, setUserName] = React.useState(null);
        const [instrumentName, setInstrumentName] = React.useState(null);
        const [instrumentGoal, setInstrumentGoal] = React.useState(null);
        const checkGoal = (goal) => {
            if (goal == 0) {
                return false
            } else {
                for (let i = 0; i < goal.length; i++) {
                    if (!(goal.charCodeAt(i) >= 48 && goal.charCodeAt(i) <= 57)) {
                        return false
                    }
                }
            }
            return true
        }
        const saveInfo = async () => {
        let value
        try{
            const jsonValue = await AsyncStorage.getItem('instrumentArray');
            value = JSON.parse(jsonValue);
        } catch(e) {console.log("Error retrieving previous array\n" + e)}
        if(value != null) {
            value.push({key: instrumentName + Date.now(), name: instrumentName, goal: instrumentGoal})
        } else value = [{key: instrumentName + Date.now(), name: instrumentName, goal: instrumentGoal}]
        try{
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('instrumentArray', jsonValue)
        } catch(e) {console.log("Error saving new array\n" + e)}
        try{
            const jsonValue = JSON.stringify(userName);
            await AsyncStorage.setItem('userName', jsonValue)
        } catch(e) {console.log("Error saving userName\n" + e)}
        }
        const done = () => {
        if (userName != null && instrumentName != null && instrumentGoal != null && checkGoal(instrumentGoal)) {
            saveInfo()
            slideOut()
        }
        else {
            Alert.alert("Empty fields", "Please fill in the Name, Instrument and Instrument Goal fields (Instrument Goal must be a number larger than 0)")
        }
        }
        return (
        <Swiper loop={false} activeDotColor={'#2b2140'}>
            <View style={firstLaunchStyles.contentContainer} testID="Welcome">
            <Text style={firstLaunchStyles.headerText} allowFontScaling={false}>Welcome to {"\n"}Repeat</Text>
            <Text style={firstLaunchStyles.contentText} allowFontScaling={false}>
                Let's get you set up! We'll help you personalize your app and add 
                instruments and goals so that you can get straight to practicing!
            </Text>
            <Button title="Dismiss" onPress={slideOut} color={'#2b2140'}/>
            </View>
            <View style={firstLaunchStyles.contentContainer} testID="Title">
            <Text style={firstLaunchStyles.headerText} allowFontScaling={false}>Enter your name</Text>
            <TextInput style={[firstLaunchStyles.nameInput,]} 
                returnKeyType={'done'}
                allowFontScaling={false}
                placeholder={"Type Here"}
                placeholderTextColor={"rgba(255, 255, 255, .5)"}
                autoCapitalize={'words'}
                onChangeText={(text) => {setUserName(text)}}/>
            <Text allowFontScaling={false}> </Text>
            </View>
            <View style={firstLaunchStyles.contentContainer} testID="Instrument">
            <Text style={firstLaunchStyles.headerText} allowFontScaling={false}>Add Your First Instrument</Text>
            <View style={{flex: .4, justifyContent: 'space-between', paddingBottom: screenSize * 35}}>
                <Text allowFontScaling={false} style={[firstLaunchStyles.headerText, {marginBottom: 10}]}>Enter an Instrument</Text>
                <TextInput style={[firstLaunchStyles.nameInput,]} 
                returnKeyType={'done'}
                allowFontScaling={false}
                placeholder={"Instrument"}
                placeholderTextColor={"rgba(255, 255, 255, .5)"}
                autoCapitalize={'words'}
                onChangeText={(text) => setInstrumentName(text)}/>
                <Text allowFontScaling={false} style={firstLaunchStyles.headerText}>Enter your daily goal in minutes</Text>
                <TextInput style={[firstLaunchStyles.nameInput,]} 
                allowFontScaling={false}
                returnKeyType={'done'}
                placeholder={"Daily Goal"}
                placeholderTextColor={"rgba(255, 255, 255, .5)"}
                autoCapitalize={'words'}
                keyboardType={'numeric'}
                onChangeText={(text) => setInstrumentGoal(text)}/>
            </View>
            <Text allowFontScaling={false}> </Text>
            </View>
            <View style={firstLaunchStyles.contentContainer} testID="Permissions">
            <Text style={firstLaunchStyles.headerText} allowFontScaling={false}>Permission</Text>
            <Text style={firstLaunchStyles.contentText} allowFontScaling={false}>Repeat will request access to your photos
                and videos as well as camera and microphone so that you can add all types of content 
                to you practice sessions. If you do not want to allow access, you will still be able
                use repeat to take notes with text. This can always be changed in the settings app.</Text>
            <Button title={"Permissions"} onPress={() => permissionsCheck()} color={'#2b2140'}/>
            </View>
            <View style={firstLaunchStyles.contentContainer}>
            <Text style={firstLaunchStyles.headerText} allowFontScaling={false}>Notifications</Text>
            <Text style={firstLaunchStyles.contentText} allowFontScaling={false}>
                You will also be asked about notifications. If allowed, notifications can be
                configured to set up reminders for you to practice on the interval that you choose.
                This can also be changed later in the settings app, as well as in the settings menu
                within Repeat.
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '80%'}} allowFontScaling={false}>
                {Platform.OS == 'ios' ? <Button title={"Notifications"} onPress={() => notificationCheck()} color={'#2b2140'} /> : null}
                <Button title={"Done"} onPress={() => done()} color={'#2b2140'} />
            </View>
            </View>
        </Swiper>
        )
    }

    return (
        <Animated.View
            style={[firstLaunchStyles.container,
            {
                transform: [{ translateY: slide }]
            }]}>
            <SwiperStack/>
        </Animated.View>

    );
}