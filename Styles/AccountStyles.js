import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { screensEnabled } from 'react-native-screens';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
export const accountStyles = StyleSheet.create({
    profilePicture: {
        width: screenSize * 27,
        height: screenSize * 27,
        borderRadius: screenSize * 27,
        alignSelf: 'center',
    },
    profileView: {
        height: screenSize * 40,
        backgroundColor: '#2b2140',
        alignContent: 'center',
        justifyContent: 'space-evenly'
    },
    nameText: {
        alignSelf: 'center',
        fontSize: screenSize * 4,
        color: 'white',
    },
    headerText: {
        fontSize: screenSize * 3,
        color: 'gray',
        textAlignVertical: 'bottom',
        margin: 10
    },
    infoView: {
        margin: 10,
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    instrumentListView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: "lightgray",
        marginBottom: -1,
    },
    instrumentListText: {
        fontSize: screenSize * 3,
        margin: 10,
        width: '35%',
    },
    instrumentRenameText: {
        fontSize: screenSize * 3,
        margin: 10,
        backgroundColor: 'lightgray',
        borderRadius: screenSize * 3,
    },
    instrumentInputText: {
        fontSize: screenSize * 3,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    instrumentTextInput: {
        backgroundColor: 'white', 
        width: '50%', 
        alignSelf: 'center', 
        margin: 10, 
        borderRadius: 5,
        height: screenSize * 4.5,
        fontSize: screenSize * 3,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
    }
})