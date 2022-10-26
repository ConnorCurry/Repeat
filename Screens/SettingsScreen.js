import * as React from 'react';
import { Text, ScrollView, View, Alert, DevSettings } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../Styles/Style.js'
import { TouchableHighlight } from 'react-native-gesture-handler';

export function SettingsScreen({navigation}) {
    const clearData = async () => {
        let keys
        try{
            keys = await AsyncStorage.getAllKeys()
        } catch(e) {console.log('Failed to fetch all keys')}
        try {
            await AsyncStorage.multiRemove(keys)
        } catch(e) {console.log('Failed to clear', e)}
    }
    const resetLaunchCount = async () => {
        try {
            await AsyncStorage.removeItem('@launchCount')
        } catch(e) {console.log(e)}
    }
    const doubleCheck = () => {
        Alert.alert(
            "Clear all data",
            "Are you sure you want to clear all data? Cleared data cannot be restored.",
            [
                {text: "Cancel",
                style: "cancel"},
                {text: "Clear Data",
                style: "destructive",
                onPress: () => clearData()}
            ]
        )
        
    }

    return(
        <View>
            <View style={styles.settings}>
                <Text allowFontScaling={false} style={{fontSize: 30, fontWeight: 'bold'}}>Settings</Text>
            </View>
            <ScrollView scrollToOverflowEnabled={true}>
                <TouchableHighlight style={styles.settings} onPress={() => doubleCheck()} underlayColor={"rgb(200,200,200)"} > 
                    <Text allowFontScaling={false} style={styles.settingsText}>
                        Clear all stored data
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.settings} onPress={() => resetLaunchCount()} underlayColor={"rgb(200,200,200)"} > 
                    <Text allowFontScaling={false} style={styles.settingsText}>
                        Reset First Launch
                    </Text>
                </TouchableHighlight>
            </ScrollView>
        </View>
    )
}