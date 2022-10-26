import * as React from 'react';
import { StatusBar, View, Animated, Dimensions, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { MenuProvider, Menu } from 'react-native-popup-menu';
// import {useFonts, Signika_400Regular, Signika_300Light, Signika_600SemiBold,} from '@expo-google-fonts/signika'
// import { Audio } from 'expo-av'
// import * as Constants from 'expo'
import { styles } from './Styles/Style.js'
import { CalendarScreen } from './Screens/CalendarScreen.js'
import { PracticeScreen } from './Screens/PracticeScreen.js'
import { AccountScreen } from './Screens/AccountScreen.js'
import { FirstLaunch } from './Components/FirstLaunch.js'
// import { color } from 'react-native-reanimated';


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
    
    // let [fontsLoaded] = useFonts({
    //     Signika_400Regular, Signika_300Light, Signika_600SemiBold,
    // });

    // if (!fontsLoaded) {
    //     return (<Text style={{fontFamily: 'Signika_300Light'}}>"App Loading"</Text>)
    // }

    return (
        <MenuProvider>
        <NavigationContainer>
            <StatusBar barStyle={'light-content'}/>
            <Tab.Navigator 
            style={styles.tabBar}
            initialRouteName="Practice"
            screenOptions={{
                "tabBarActiveTintColor": "mediumpurple",
                "tabBarInactiveTintColor": "gray",
                "tabBarActiveBackgroundColor": "lightgray",
                "tabBarAllowFontScaling": true,
                "tabBarShowLabel": false,
                "tabBarLabelStyle": {
                    "fontSize": 15,
                    "flex": 1
                },
                "tabBarItemStyle": {
                    "justifyContent": "center"
                },
                "tabBarStyle": [
                    {
                    "display": "flex"
                    },
                    null
                ],
                lazy: true
            }}
            >
            <Tab.Screen 
                name="CalendarContainer" 
                component={CalendarScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => <MaterialCommunityIcons focused={focused} name='calendar' size={25} color={focused ? 'mediumpurple' : 'lightgray'}/>,}}
                />
            <Tab.Screen 
                name="Practice" 
                component={PracticeScreen}
                options={{
                    headerStyle: styles.headerStyle,
                    headerTintColor: 'white',
                    tabBarIcon: ({focused}) => <MaterialCommunityIcons focused={focused} name='music-clef-treble' size={50} color={focused ? 'mediumpurple' : 'lightgray'}/>,}}
                />
            <Tab.Screen 
                name="AccountContainer"
                component={AccountScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => <Feather focused={focused} name='user' size={25} color={focused ? 'mediumpurple' : 'lightgray'}/>,}}
                />
            </Tab.Navigator>
        </NavigationContainer>
        {firstCheck ? <FirstLaunch/> : null}
        </MenuProvider>
    );
}


