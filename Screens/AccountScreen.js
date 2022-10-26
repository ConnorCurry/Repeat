import * as React from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, Alert, Platform, KeyboardAvoidingView, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { KeyboardAwareFlatList, KeyboardAware } from 'react-native-keyboard-aware-scroll-view'
import { Button } from '../Components/Button';
import { styles } from '../Styles/Style.js';
import { practiceStyles} from '../Styles/PracticeScreenStyles';
import { accountStyles } from '../Styles/AccountStyles.js';
import { SettingsScreen } from './SettingsScreen.js';
import { SimpleLineIcons, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import CameraRoll from '@react-native-community/cameraroll'
import { Signika_400Regular } from '@expo-google-fonts/signika';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
const Stack = createStackNavigator();
let userName;

function AccountScreenView( { route, navigation, } ) {
    const [addingInst, setAddingInst] = React.useState(false)
    const [editing, setEditing] = React.useState(false)

    const loadInstrumentData = async () => {
        try{
            const jsonValue = await AsyncStorage.getItem('instrumentArray');
            let value = JSON.parse(jsonValue)
            setInstruments(value)
        }
        catch(e){ setInstruments([])}
    }
    const [instruments, setInstruments] = React.useState(() => loadInstrumentData());

    React.useEffect(() => {
        async function loadUserName() {
            try{
                let value = await AsyncStorage.getItem('userName')
                if (typeof value == "string"){setUserName(value.slice(1, (value.length-1)));}
            } catch(e) {console.log("Error loading userName\n" + e)}
            return(
                console.log('clear')
            )
        }
        loadUserName()
    }, [])
    const [userName, setUserName] = React.useState()

    const saveInstrumentData = async () => {
        try{
            const jsonValue = JSON.stringify(instruments)
            await AsyncStorage.setItem('instrumentArray', jsonValue)
        } catch(e) {
            console.log("Error saving instrument", e)
        }
    }
    const clearInstrumentData = async () => {
        try{
            const jsonValue = JSON.stringify([]);
            await AsyncStorage.setItem("instrumentArray", jsonValue);
            setInstruments([])
        } catch (e) {

        }
    }
    const [renaming, setRenaming] = React.useState("")
    function RenderItem({name, goal, identifier}) {
        const [newName, setNewName] = React.useState("")
        const [newGoal, setNewGoal] = React.useState()
        const deleteInstrument = () => {
            Alert.alert("Delete Instrument", 
            "Are you sure you want to delete '" + name + "'?",
            [
                {text: "Cancel",
                style: 'cancel'},
                {text: "Delete",
                style: 'destructive',
                onPress: () => /* dataChoice() */deleteKeepData()}  /* change this to data choice */ 
            ])
            const dataChoice = () => {
                Alert.alert("Save Data",
                "Would you like to erase your saved practice session data for '" + name + "'?",
                [
                    {text: "Cancel",
                    style: 'cancel'},
                    {text: "Keep Data",
                    onPress: () => deleteKeepData()},
                    {text: "Erase Data",
                    style: 'destructive',
                    onPress: () => deleteEraseData()}
                ])
            }
            const deleteKeepData = () => {
                loadInstrumentData();
                let temp = instruments;
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].key == identifier) {
                        temp.splice(i , 1)
                    }
                }
                setInstruments(temp)
                saveInstrumentData()
                loadInstrumentData()
            }
            const logSessions = async (session, key) => {
                try{
                    session = await AsyncStorage.getItem(key);
                } catch(e) {console.log("Load Failed " + e)}
                if (key == identifier) {
                    try{
                        await AsyncStorage.removeItem(key)
                    } catch(e) {console.log(e)}
                }
            }
            const deleteEraseData = async () => {
                //deleteKeepData()
                let allKeys = await AsyncStorage.getAllKeys()
                console.log(allKeys);
                for (let i=0; i < allKeys.length; i++) {
                    let session;
                    logSessions(session, allKeys[i])
                }
            }
        }
        const renameInstrument = () => {
            if (newName != ""){
                loadInstrumentData()
                let temp = instruments
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].key == identifier) {
                        temp[i].name = newName;
                    }
                }
                setInstruments(temp)
                saveInstrumentData()
                loadInstrumentData()
            }
        }
        const editGoal = () => {
            if (newGoal != null && newGoal != 0 && newGoal != ''){
                loadInstrumentData()
                let temp = instruments
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].key == identifier) {
                        temp[i].goal = newGoal;
                    }
                }
                setInstruments(temp)
                saveInstrumentData()
                loadInstrumentData()
            }
        }
        return(
            <View style={accountStyles.instrumentListView}>
                {renaming == identifier ? 
                <View style={{width: '80%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{backgroundColor: 'lightgray', borderRadius: screenSize}}>
                        <TextInput defaultValue={name} 
                        allowFontScaling={false}
                        returnKeyType={'done'} 
                        onChangeText={(text) => {setNewName(text)}} 
                        style={accountStyles.instrumentRenameText}
                        autoCorrect={false}/>
                    </View>
                    <View style={{width: '60%', flexDirection: 'row', height: '100%'}}>
                        <Text style={{fontSize: screenSize * 3, marginVertical: 10, textAlign: 'center'}} numberOfLines={1} ellipsizeMode={'clip'}>Goal: </Text>
                        <View style={{backgroundColor: 'lightgray', borderRadius: screenSize,}}>
                            <TextInput defaultValue={goal} 
                            allowFontScaling={false}
                            returnKeyType={'done'} 
                            onChangeText={(text) => {setNewGoal(text)}} 
                            style={accountStyles.instrumentRenameText}
                            autoCorrect={false}
                            keyboardType={'decimal-pad'}/>
                        </View>
                    <Text style={{fontSize: screenSize * 3, marginVertical: 10, textAlign: 'center'}} numberOfLines={1} ellipsizeMode={'clip'}>minutes </Text>

                    </View>
                </View> : 
                <View style={{width: editing ? '80%' : '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text allowFontScaling={false} style={[accountStyles.instrumentListText,]} numberOfLines={1} ellipsizeMode={"tail"}>{name}</Text>
                    <Text allowFontScaling={false} style={[accountStyles.instrumentListText, {width: '45%', textAlign: 'right', }]} numberOfLines={1}>
                        Goal: {goal} minutes
                    </Text>
                </View>
                }
                {editing ? <View style={{flexDirection: 'row'}}>
                    {renaming == identifier ? 
                    <TouchableOpacity style={{ alignSelf: 'center'}}
                    onPress={() => {setRenaming(""); renameInstrument(); editGoal(); setEditing(false)}}>
                        <MaterialIcons name="done" size={screenSize * 4} 
                        color="#147efb" 
                        style={{alignSelf: 'center'}} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ alignSelf: 'center'}}
                    onPress={() => {setRenaming(identifier)}}>
                        <MaterialCommunityIcons name="pencil-outline" size={screenSize * 4} 
                        color="#147efb" 
                        style={{alignSelf: 'center'}} />
                    </TouchableOpacity>}

                    <TouchableOpacity style={{ alignSelf: 'center'}}
                    onPress={() => deleteInstrument()} >
                        <MaterialCommunityIcons name="trash-can-outline" size={screenSize * 4} 
                        color="#ff6666" 
                        style={{alignSelf: 'center', marginLeft: 10, marginRight: 10}} 
                        />
                    </TouchableOpacity>
                </View> : null }
            </View>
        )
    }
    function Profile() {
        return(
        <View style={accountStyles.profileView}>
            <Image style={accountStyles.profilePicture} source={require("../assets/DefaultProfile.png")}/>
            <Text allowFontScaling={false} style={accountStyles.nameText}>{userName}</Text>
        </View> 
        )
    }
    const checkGoal = (goal) => {
        if (goal == 0) {
            return false
        } else {
            for (let i = 0; i < goal.length; i++) {
                if (!(goal.charCodeAt(i) >= 48 && goal.charCodeAt(i) <= 57)) {
                    return false
                }
            }
        }
        return true
    }
    function AddInstrument({setInstrument, setGoal}) {
        const [newInstrument, setNewInstrument] = React.useState("")
        const [newGoal, setNewGoal] = React.useState(0)
        const addNewInstrument = () => {
            let temp
            let goalNum = newGoal
            if (checkGoal(newGoal)){
                setAddingInst(false)
                if(instruments != null) {
                    temp = instruments;
                    temp.push({key: newInstrument + Date.now(), name: newInstrument, goal: goalNum})
                } else temp = [{key: newInstrument + Date.now(), name: newInstrument, goal: goalNum}]
                setInstruments(temp);
                saveInstrumentData()
            } else {
                Alert.alert("Invalid Goal", "Goal must be a number larger than 0")
            }
        };
        return(
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                <View style={{width: '100%',}}>
                    <Text allowFontScaling={false} style={accountStyles.instrumentInputText}>Enter an Instrument Name</Text>
                    <View>
                        <TextInput allowFontScaling={false} style={accountStyles.instrumentTextInput} onChangeText={(text) => {setNewInstrument(text);}} returnKeyType={'done'}/>
                    </View>
                    <Text allowFontScaling={false} style={accountStyles.instrumentInputText}>Enter a Daily Goal</Text>
                    <View>
                        <TextInput allowFontScaling={false} style={accountStyles.instrumentTextInput} onChangeText={(text) => {setNewGoal(text);}} keyboardType={'number-pad'} returnKeyType={'done'}/>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly',}}>
                    <TouchableOpacity onPress={() => setAddingInst(false)} style={practiceStyles.stopButton}>
                        <Text allowFontScaling={false} style={practiceStyles.stopText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => addNewInstrument()} style={practiceStyles.pauseButton}>
                        <Text allowFontScaling={false} style={practiceStyles.pauseText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    return (
        <View style={{paddingTop: 0}}>
            <KeyboardAwareFlatList
            ListHeaderComponent={
            <View>
                <View style={accountStyles.profileView}>
                    {addingInst ? <AddInstrument/> : <Profile/>}
                </View>
                <View style={accountStyles.headerView}>
                    <Text allowFontScaling={false} style={accountStyles.headerText}>Instruments</Text>
                    <TouchableOpacity style={{alignSelf: "flex-end"}} onPress={() => {setAddingInst(true); setEditing(false)}}>
                        <AntDesign name="plus" size={screenSize*4} color="#147efb" style={{alignContent: "flex-end", margin: 10}}/>
                    </TouchableOpacity>
                </View>
            </View>}
            keyboardOpeningTime={0}
            style={{borderColor: 'lightgray', paddingBottom: 1}} 
            data={instruments} 
            extraData={instruments}
            renderItem={({item}) => <RenderItem name={item.name} identifier={item.key} goal={item.goal}/>}
            />
            <View style={{marginVertical: 10}}>
                {editing ? <Button title={"Done"} onPress={() => {setEditing(false); setRenaming("")}} 
                color={Platform.OS == 'android' ? 'mediumpurple' : null}/> : <Button title={"Edit"} onPress={() => setEditing(true)} color={Platform.OS == 'android' ? 'mediumpurple' : null}/> }
                </View>
        </View>
    )
}

export function AccountScreen({navigation, callback}) {
    return(
        <Stack.Navigator initialRouteName>
            <Stack.Screen
                name="Account"
                component={AccountScreenView}
                // initialParams={editing}
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Settings')}>
                            <SimpleLineIcons name="settings" size={24} color="white"/>
                        </TouchableOpacity>
                    ),
                    headerTitleAllowFontScaling: false,
                    headerStyle: styles.headerStyle,
                    headerRightContainerStyle: styles.rightHeaderContainer,
                    headerTintColor: 'white',
                    headerTitleStyle: {fontFamily: 'Signika_600SemiBold'}
                }}
            >
                
            </Stack.Screen>
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerTitleAllowFontScaling: false,
                    headerTitle: "",
                    headerBackTitle: "Back",
                    headerStyle: styles.headerStyle,
                    headerTintColor: "white",
                }}
            />
        </Stack.Navigator>

       
    )
}