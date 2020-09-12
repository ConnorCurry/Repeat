import { StyleSheet, Dimensions } from 'react-native';
import { screensEnabled } from 'react-native-screens';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
export const calendarStyles = StyleSheet.create({
    calendarView: {
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        flex: .7,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    dateDetails: {
        flex: .3,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthText: {
        fontSize: screenSize * 4
    },
    weekdays: {
        width: screenSize * 7, 
        height: screenSize * 7, 
        textAlign: 'center', 
        textAlignVertical: 'center',
        fontWeight: "800",
        fontSize: screenSize * 3.3,
        color: 'mediumpurple',
        marginBottom: -10
    },
    dates: {
        width: screenSize * 6, 
        height: screenSize * 6, 
        textAlign: 'center', 
        textAlignVertical: 'center',
    },
})