import { Signika_400Regular, Signika_600SemiBold } from '@expo-google-fonts/signika';
import { StyleSheet, Dimensions } from 'react-native';
import { screensEnabled } from 'react-native-screens';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tabBar: {
        flex: .08,
        
    },

    tabStyle: {
        justifyContent: 'center'
    },

    tabLabelStyle: {
        fontSize: 15,
        flex: 1,
    },

    settings: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: 'lightgray',
        backgroundColor: 'white',
        borderTopWidth: 0,
    },

    settingsText: {
        fontSize: 17,
    },

    rightHeaderContainer: {
        marginRight: 10,
    },

    headerStyle: {
        backgroundColor: "mediumpurple",
        shadowColor: 'mediumpurple',
    },

    practiceHeader: {
        flexDirection: 'row',
        height: screenSize * 6,
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'flex-end',
        backgroundColor: 'mediumpurple',
    },
    
    practiceContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },

    practiceHeaderText: {
        fontSize: (screenSize * 4.5),
        justifyContent: 'flex-end',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        color: 'white',
        fontFamily: 'Signika_400Regular',
    },

    innerPracticeHeaderText: {
        fontSize: (screenSize * 4.5),
        justifyContent: 'flex-end',
        marginBottom: 5,
        color: 'white',
        marginHorizontal: -5
    },

});
