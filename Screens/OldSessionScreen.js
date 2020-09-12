import * as React from 'react'
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, Dimensions, ActionSheetIOS, Alert, Image, Modal } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-community/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import * as ImagePicker from 'expo-image-picker';
import { Video, Audio } from 'expo-av';
import { styles } from '../Styles/Style'
import { practiceStyles } from '../Styles/PracticeScreenStyles'

let months = ['0', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let days = ['0', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '27th', '28th', '29th', '30th', '31st']
let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
let objectNum = Date.now()
export function OldSession({navigation, route}) {
    const [editing, setEditing] = React.useState(false);
    const {session} = route.params
    const {day} = route.params
    const {month} = route.params
    const {year} = route.params
    const {index} = route.params
    const [practiceObjects, setPracticeObjects] = React.useState(session.session.objects)
    let fullDate = month + 1 + "-" + day + "-" + year
    const [loading, setLoading] = React.useState(false);

    const overwrite = async () => {
        let info;
        try {
            const jsonValue = await AsyncStorage.getItem(fullDate)
            info = JSON.parse(jsonValue)
        } catch(e) {console.log("Load failed: " + e)}
        try {
            let sessionData = {date: fullDate, instrument: session.session.instrument, objects: practiceObjects, time: session.session.time, key: session.session.key}
            info[index] = (sessionData)
            const jsonValue = JSON.stringify(info)
            await AsyncStorage.setItem(fullDate, jsonValue)
        } catch(e) {console.log("Save failed overall\n" + e)}
    }

    const doubleCheck = () => {
        Alert.alert("Delete Session",
            "Are you sure you want to delete the saved data from this session?",
            [
                {text: "Cancel",
                style: 'cancel'},
                {text: "Delete",
                style: 'destructive',
                onPress: () => {deleteSession();}}
            ]
        )
    }
    const deleteSession = async () => {
        let info;
        /* setLoading(true) */
        try {
            const jsonValue = await AsyncStorage.getItem(fullDate)
            info = JSON.parse(jsonValue)
        } catch(e) {console.log("Load failed: " + e)}
        try {
            if (info.length != 1){
                info.splice(index, 1)
                const jsonValue = JSON.stringify(info)
                await AsyncStorage.setItem(fullDate, jsonValue).then(() => {/* setLoading(false); */ navigation.popToTop()})
            } else {
                await AsyncStorage.removeItem(fullDate).then(() => {/* setLoading(false); */ navigation.popToTop()})
            }
        } catch(e) {console.log("Save failed overall\n" + e)}
    }

    function RenderPracticeObjects({item}) {
        const editHeader = (text) => {
            let temp = practiceObjects;
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].key == item.key) {
                    temp[i].header = text;
                    setPracticeObjects(temp)
                }
            }
        }
        const editContent = (text) => {
            let temp = practiceObjects;
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].key == item.key) {
                    temp[i].content = text;
                    setPracticeObjects(temp)
                }
            }
        }
        const deleteNote = () => {
            let temp = practiceObjects;
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].key == item.key) {
                    temp.splice(i, 1)
                    setPracticeObjects(temp)
                    setRerender(rerender + 1)
                }
            }
        }
        const [imageOpen, setImageOpen] = React.useState(false);
        return(
            <View style={{marginHorizontal: 10, marginBottom: 10}}>
                {item.type == "note" ?                   
                <View>
                    <View style={{flexDirection: 'row',}}>
                        <TextInput
                        style={practiceStyles.noteHeader}
                        placeholder={"Add Header"}
                        defaultValue={item.header}
                        autoCorrect={false}
                        allowFontScaling={false}
                        editable={editing}
                        onChangeText={(text) => editHeader(text)}/>
                        {editing ? <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => deleteNote()}>
                            <AntDesign name="close" size={screenSize * 3} color="lightgray" style={{justifyContent: 'center'}}/>
                        </TouchableOpacity> : null}
                    </View>
                    <TextInput
                    style={practiceStyles.noteBody}
                    multiline={true}
                    allowFontScaling={false}
                    placeholder={"Add notes"}
                    defaultValue={item.content}
                    editable={editing}
                    autoCorrect={false}
                    onChangeText={(text) => editContent(text)}/>
                </View>
                :
                <View style={{flexDirection: 'row',}}>
                    {item.type == "image" ? 
                    <View>
                        <TouchableOpacity onPress={() => setImageOpen(true)}>
                            <Image 
                                style={{height: 200, width: Dimensions.get("window").width / 2, borderColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, marginRight: 5}} 
                                source={{uri: item.imageSource}}
                                />
                        </TouchableOpacity>
                        <Modal visible={imageOpen} transparent={true} >
                            <ImageViewer imageUrls={[{url: item.imageSource}]}
                                enableSwipeDown
                                useNativeDriver
                                onCancel={() => setImageOpen(false)}
                                backgroundColor={"rgba(0,0,0,.95)"}
                                renderIndicator={() => {
                                    null
                                }}
                            />
                            <View style={{width: '100%', backgroundColor: "rgba(0,0,0,.95)", paddingBottom: 10}}>
                                <Button title={"Done"} onPress={() => setImageOpen(false)} color="white"/>
                            </View>
                        </Modal>
                    </View>
                    :
                    <Video 
                        source={{uri: item.imageSource}}
                        rate={1.0}
                        volume={1.0}
                        useNativeControls={true}
                        isMuted={false}
                        resizeMode="cover"
                        style={{ width: 200, height: 200, borderColor: 'mediumpurple', borderWidth: 2, borderRadius: 5, }}
                    />
                    }
                    {editing ? <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => deleteNote()}>
                        <AntDesign name="close" size={screenSize * 3} color="lightgray" style={{justifyContent: 'center'}}/>
                    </TouchableOpacity> : null}

                </View>
                }
            </View>
        )
    }
    const [rerender, setRerender] = React.useState(0)
    const addNote = () => {
        let identifier = "Note" + objectNum++
        let temp = practiceObjects
        temp.push({
            key: identifier, 
            type: "note",
            header: null,
            content: null, 
        })
        setPracticeObjects(temp)
        setRerender(rerender + 1)
    }

    const addPhotoVideo = async () => {
        let identifier = "Media" + objectNum++
        let temp = practiceObjects
        let image;
        try {
            image = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
            })
            if (!image.cancelled) {
                temp.push({
                    key: identifier,
                    type: image.type, 
                    imageSource: image.uri
                })
                setPracticeObjects(temp)
                setRerender(rerender + 1)
            }
        } catch(e) {console.log("Error picking image\n" + e)}
    }

    const actionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Add Notes", "Add Audio", "Add Photo or Video"],
                cancelButtonIndex: 0
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    // cancel action
                } else if (buttonIndex === 1) {
                    addNote()
                } else if (buttonIndex === 2) {
                    alert("Add Audio")
                } else if (buttonIndex === 3) {
                    addPhotoVideo()
                }
            }
        );
    }
    function AndroidActionSheet() {
        const { SlideInMenu } = renderers;
        return(
            <Menu renderer={SlideInMenu}>
                <MenuTrigger text='Add...'/>
                <MenuOptions>
                    <MenuOption text='Add Notes' onSelect={() => addNote()} />
                    <MenuOption text='Add Audio' />
                    <MenuOption text='Add Photo or Video' />
                </MenuOptions>
            </Menu>
        )
    }

    return (
        <View style={styles.practiceContainer}>
            <Modal visible={loading} transparent={true}>
                <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, .7)', alignItems: 'center'}}>
                    <Text style={{color: 'white'}}>Loading</Text>
                    <Button title={"close"} onPress={() => setLoading(false)} />
                </View>
            </Modal>

            <View style={styles.practiceHeader}>
                <Text allowFontScaling={false} style={styles.practiceHeaderText}>{months[month + 1]} {days[day]}</Text>
                <View style={{flexDirection: 'row'}}>
                    {session.session.time < 60 ? null
                    :
                    <View>
                        {Math.floor(session.session.time/60) > 1 ?
                        <Text allowFontScaling={false} style={styles.innerPracticeHeaderText}>{Math.floor(session.session.time/60)} hrs</Text>
                        :
                        <Text allowFontScaling={false} style={styles.innerPracticeHeaderText}>{Math.floor(session.session.time/60)} hr</Text>
                        }
                    </View>}
                    <View>
                        {session.session.time % 60 != 1 ?
                        <Text allowFontScaling={false} style={styles.practiceHeaderText}>{session.session.time % 60} mins</Text>
                        :
                        <Text allowFontScaling={false} style={styles.practiceHeaderText}>{session.session.time % 60} min</Text>}
                    </View>
                </View>
            </View>
                <View style={practiceStyles.practicingView}>
                    <View style={{width: '100%', flex: 1, flexDirection: 'row'}}>
                        <KeyboardAwareFlatList data={practiceObjects} 
                        style={{paddingTop: 0, marginTop: 10, width: '100%'}} 
                        renderItem={({item}) => <RenderPracticeObjects item={item} />}
                        enableAutomaticScroll={practiceObjects.length > 2}
                        />

                        {editing ? 
                        <TouchableOpacity style={{margin: 10}} onPress={() => actionSheet()}>
                            {Platform.OS == 'ios' ? 
                            <AntDesign name="plus" size={30} color="#147efb" style={{alignContent: "flex-end"}} onPress={() => actionSheet()}/>
                            :
                            <AndroidActionSheet/>
                            }
                        </TouchableOpacity>
                        :
                        null
                        }
                    </View>
                </View> 
                <View style={{width: '100%', flex: .08, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Text allowFontScaling={false}>{session.session.instrument[1]}</Text>
                    <View style={{flexDirection: 'row', flex: .8, width: "100%", height:'15%', backgroundColor:'lightgray', borderRadius: 20}}>
                        <View style={{backgroundColor: "#147efb", alignSelf:'flex-start', flex: session.session.time/session.session.instrument[2] , borderRadius: 20, height: '100%'}}><Text> </Text></View>
                    </View>
                    <Text allowFontScaling={false}>{session.session.instrument[2]} mins</Text>
                </View>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', marginBottom: 10}}>
                    {editing ? 
                    <TouchableOpacity onPress={() => {setEditing(false); overwrite()}} style={practiceStyles.saveButton}>
                        <Text allowFontScaling={false} style={practiceStyles.pauseText}>Save Changes</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setEditing(true)} style={practiceStyles.pauseButton}>
                        <Text allowFontScaling={false} style={practiceStyles.pauseText}>Edit Session</Text>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity  style={practiceStyles.stopButton} onPress={() => doubleCheck()}>
                        <Text allowFontScaling={false} style={practiceStyles.stopText}>Delete Session</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}