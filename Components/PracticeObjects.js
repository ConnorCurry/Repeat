import * as React from 'react'
import { View, TextInput, Button, ActionSheetIOS, Platform, Image, Modal, TouchableOpacity, Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { practiceStyles } from '../Styles/PracticeScreenStyles.js';

let screenSize = (Dimensions.get("window").width * Dimensions.get('window').height) / 49000;
let objectNum = 0;

export function PracticeObjects({setPracticeObjects, practiceObjects, setRerender, rerender}) {
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
              options: ["Cancel", "Add Notes", "Add Photo or Video"],
              cancelButtonIndex: 0
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                  // cancel action
                } else if (buttonIndex === 1) {
                    addNote()
                } else if (buttonIndex === 2) {
                    addPhotoVideo()
                    console.log("Add photo or video")
                }
            }
        );
    }
    function AndroidActionSheet() {
        const { SlideInMenu } = renderers;
        return(
            <Menu renderer={SlideInMenu}>
                <MenuTrigger text='Add...'
                    customStyles={{
                        triggerText: {color: 'white', fontWeight: 'bold'}, 
                        triggerWrapper: {backgroundColor:'mediumpurple', paddingHorizontal: 10, borderRadius: 100, paddingVertical: 5,}
                    }}
                />
                <MenuOptions optionsContainerStyle={{backgroundColor: 'rgb(245,245,245)', borderTopColor: 'lightgray', borderTopWidth: 1}}>
                    <MenuOption 
                        style={{padding: 10}} 
                        text='Add Notes' 
                        onSelect={() => addNote()} 
                        customStyles={{optionText:{fontSize: screenSize * 3}}}
                        />
                    <MenuOption 
                        text='Add Photo or Video' 
                        onSelect={() => addPhotoVideo()}
                        style={{padding: 10}}
                        customStyles={{optionText:{fontSize: screenSize * 3}}}
                        />
                    <MenuOption 
                        text='Cancel' 
                        style={{padding: 10}}
                        customStyles={{optionText:{fontSize: screenSize * 3, color: 'red'}}}
                        />
                </MenuOptions>
            </Menu>
        )
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
        const [imageOpen, setImageOpen] = React.useState(false)
        return(
            
            <View style={{marginBottom: 10}}>
                {item.type == "note" ?                   
                <View>
                    <View style={{flexDirection: 'row',}}>
                        <TextInput
                        style={practiceStyles.noteHeader}
                        placeholder={"Add Header"}
                        defaultValue={item.header}
                        autoCorrect={false}
                        allowFontScaling={false}
                        onChangeText={(text) => editHeader(text)}/>
                        <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => deleteNote()}>
                            <AntDesign name="close" size={screenSize * 3} color="lightgray" style={{justifyContent: 'center'}}/>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                    style={practiceStyles.noteBody}
                    multiline={true}
                    allowFontScaling={false}
                    placeholder={"Add notes"}
                    defaultValue={item.content}
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
                    <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => deleteNote()}>
                        <AntDesign name="close" size={screenSize * 3} color="lightgray" style={{justifyContent: 'center'}}/>
                    </TouchableOpacity>

                </View>
                }
            </View>
        )
    }
    return (
        <View style={{justifyContent:"space-between", flex: 1, width: "100%",}}>
            <View style={{width: "100%", alignItems: "space-around", flexDirection: "row",}}>
                <KeyboardAwareFlatList data={practiceObjects} 
                    style={{paddingTop: 0, margin: 10}} 
                    renderItem={({item}) => <RenderPracticeObjects  item={item}/>} 
                    extraData={practiceObjects}
                    enableOnAndroid={true}
                    enableAutomaticScroll={practiceObjects.length > 2}/>
                <View style={{alignSelf: "flex-start"}}>
                <TouchableOpacity style={{margin: 10}}>
                    {Platform.OS == 'ios' ? 
                    <AntDesign name="plus" size={30} color="#147efb" style={{alignContent: "flex-end"}} onPress={() => actionSheet()}/>
                    :
                    <AndroidActionSheet/>
                    }   
                </TouchableOpacity>
                </View>
            
            </View>
        </View>
    )
}