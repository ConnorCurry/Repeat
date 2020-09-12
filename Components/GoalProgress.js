import * as React from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export function GoalProgress ({instrument,}) {
    let minutes = 0;
    return (
        <View style={{width: '100%', flex: .08, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 10, alignItems: 'center'}}>
            <Text allowFontScaling={false} style={{fontWeight: 'bold'}}>{instrument[1]} - </Text>
            {/* <View style={{flexDirection: 'row', flex: .8, width: "100%", height:'15%', backgroundColor:'lightgray', borderRadius: 20, flexDirection: 'row'}}>
                <View style={{backgroundColor: "#147efb", alignSelf:'flex-start', flex: minutes/instrument[2], borderRadius: 20, height: '100%'}}><Text> </Text></View>
            </View> */}
            <Text allowFontScaling={false}>Goal: {instrument[2]} mins</Text>
        </View>
    )
}