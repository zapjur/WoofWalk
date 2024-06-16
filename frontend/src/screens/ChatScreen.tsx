import {Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BottomBar from "../components/BottomBar";
import React, {useState} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import DirectMessageModal from "../components/DirectMessageModal";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>
interface ChatScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp & ChatScreenNavigationProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) =>{
    const [modalVisible, setModalVisible] = useState(false);
    return(
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.text}>
                    DM's
                </Text>
            </ScrollView>
            <TouchableOpacity
                style={styles.directMessage}
                onPress={() => setModalVisible(!modalVisible)}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/128/786/786205.png' }}
                    style={styles.directMessageIcon}
                />
            </TouchableOpacity>
            <BottomBar navigation={navigation} />
            <DirectMessageModal
                modalVisible = {modalVisible}
                setModalVisible = {setModalVisible}/>
        </View>
    )
}
const styles = StyleSheet.create({
   container: {
       flex: 1,
   },
   directMessage: {
       position: "absolute",
       right: 20,
       bottom: 110,
   },
    directMessageIcon: {
        width: 50,
        height: 50,
    },
    text: {
        fontSize: 30,
    },

    });
export default ChatScreen;