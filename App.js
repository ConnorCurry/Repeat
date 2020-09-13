import * as React from 'react';
import { StatusBar, View, Animated, Dimensions, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { MenuProvider, Menu } from 'react-native-popup-menu';
import { Audio } from 'expo-av'
import * as Constants from 'expo'
import { styles } from './Styles/Style.js'
import { CalendarScreen } from './Screens/CalendarScreen.js'
import { PracticeScreen } from './Screens/PracticeScreen.js'
import { AccountScreen } from './Screens/AccountScreen.js'
import { FirstLaunch } from './Components/FirstLaunch.js'

//edited from my pc

const Tab = createBottomTabNavigator();

export default function App() {
    const [firstCheck, setFirstCheck] = React.useState()
    const checkFirstLaunch = async () => {
        /* console.log("Audio mode: " + await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,     
        staysActiveInBackground: false,                                                                                                                                                                              
        interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        })) */
        let value;
        try {
            value = await AsyncStorage.getItem('@launchCount')
        } catch(e) {console.log(e)} 
        if (value == null) {
            try {
                await AsyncStorage.setItem('@launchCount', '1')
            } catch(e) {console.log(e)}
            setFirstCheck(true)
        }
    }
    React.useEffect(() => {checkFirstLaunch();}, []);
    
    

    return (
        <MenuProvider>
        <NavigationContainer>
            <StatusBar barStyle={'light-content'}/>
            <Tab.Navigator 
            style={styles.tabBar}
            initialRouteName="Practice"
            lazy={true}
            tabBarOptions={{
                activeBackgroundColor: "lightgray",
                activeTintColor: "mediumpurple",
                inactiveTintColor: "gray",
                labelStyle: styles.tabLabelStyle,
                tabStyle: styles.tabStyle,
                style: styles.tabBar,
                allowFontScaling: true,
                showLabel: false,
            }}
            >
            <Tab.Screen 
                name="Calendar" 
                component={CalendarScreen}
                options={{
                tabBarIcon: ({focused}) => <MaterialCommunityIcons focused={focused} name='calendar' size={25} color={focused ? 'mediumpurple' : 'lightgray'}/>,}}
                />
            <Tab.Screen 
                name="Practice" 
                component={PracticeScreen}
                options={{
                tabBarIcon: ({focused}) => <MaterialCommunityIcons focused={focused} name='music-clef-treble' size={50} color={focused ? 'mediumpurple' : 'lightgray'}/>,}}
                />
            <Tab.Screen 
                name="Account"
                component={AccountScreen}
                options={{
                tabBarIcon: ({focused}) => <Feather focused={focused} name='user' size={25} color={focused ? 'mediumpurple' : 'lightgray'}/>,}}
                
                />
            </Tab.Navigator>
        </NavigationContainer>
        {firstCheck ? <FirstLaunch/> : null}
        </MenuProvider>
    );
}

