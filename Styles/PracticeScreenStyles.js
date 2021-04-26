import { Signika_300Light, Signika_400Regular, Signika_600SemiBold } from '@expo-google-fonts/signika';
import { StyleSheet, Dimensions } from 'react-native';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
export const practiceStyles = StyleSheet.create({
    startPracticingButton: {
        height: screenSize * 30,
        backgroundColor: 'mediumpurple',
        width: screenSize * 30,
        borderRadius: screenSize * 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    practicingView: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        
    },

    startButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: screenSize * 8,
        textAlign: 'center',
        fontFamily: 'Signika_600SemiBold'
    },

    text: {
        fontSize: screenSize * 3,
        textAlign: 'center',
        fontFamily: 'Signika_400Regular',
    }, 

    instrumentPickText: {
        marginTop: 10,
        color: '#147efb',
        textAlign: 'center',
        fontSize: screenSize * 3,
        width: '100%',
        fontFamily: 'Signika_400Regular',
    },

    stopPauseView: {
        flexDirection: "row-reverse",
        justifyContent: "space-evenly",
        marginBottom: 10
    },

    stopButton: {
        backgroundColor: "#ff6666",
        width: "40%",
        alignItems: 'center',
        height: screenSize * 6,
        borderRadius: screenSize * 6,
        justifyContent: 'center',
    },
    
    stopText: {
        color: "white",
        fontWeight: "bold",
    },

    pauseButton: {
        backgroundColor: "#147efb",
        width: "40%",
        alignItems: 'center',
        height: screenSize * 6,
        borderRadius: screenSize * 6,
        justifyContent: 'center',
    },

    saveButton: {
        backgroundColor: "#53d769",
        width: "40%",
        alignItems: 'center',
        height: screenSize * 6,
        borderRadius: screenSize * 6,
        justifyContent: 'center',
    },
    
    pauseText: {
        color: "white",
        fontWeight: "bold",
    },

    noteHeader: {
        fontWeight: "bold",
        fontSize: screenSize * 4,
    },
    noteBody: {
        fontSize: screenSize * 3,
        color: 'gray',
    },
    pauseOverlay: {
        position: "absolute", 
        left: 0, 
        top: 0, 
        flex: 1, 
        backgroundColor: 'rgba(43,33,64,.65)', 
        zIndex:1, 
        width: "100%", 
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    pauseOverlayText: {
        fontSize: screenSize * 5,
        color: 'rgba(255,255,255,.7)',
    },
    pauseOverlayResumeText: {
        fontSize: screenSize * 3,
        color: 'rgba(255,255,255,.7)',
        marginTop: 20
    }

}) 