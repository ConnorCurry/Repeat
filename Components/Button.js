import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export function Button(props){
    return(
        <TouchableOpacity onPress={props.onPress} style={{alignContent: 'center', alignItems: 'center', margin: 5}}>
            <Text allowFontScaling={false} 
            style={{color: (props.color==null ? '#147efb' : props.color),
                fontSize: (props.size == null ? 20 : props.size)
            }}>
            
                {props.title}</Text>
        </TouchableOpacity>
    )
}