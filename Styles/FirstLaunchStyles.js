import { StyleSheet, Dimensions, Platform } from 'react-native';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
export const firstLaunchStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        backgroundColor: 'mediumpurple',
        zIndex: 1,
        width: '100%',
        height: '100%',
      },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems:'center',
    },
    headerText: {
        fontSize: 28,
        textAlign: "center",
        margin: 10,
        color:'white',
        fontWeight: 'bold',
    },
    contentText: {
        fontSize: screenSize * 3,
        textAlign: 'center', 
        marginHorizontal: 30,
        color: 'white',
    },
    nameInput: {
        borderBottomColor: '#2b2140',
        borderBottomWidth: 2,
        height: screenSize * 4.5,
        fontSize: screenSize * 3.5,
        textAlign: "center",
        paddingVertical: 2,
        color: '#2b2140',
        marginBottom: 20,

    },
})