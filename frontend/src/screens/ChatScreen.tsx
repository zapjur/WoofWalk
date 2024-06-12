import {StyleSheet, Text, View} from "react-native";
import BottomBar from "../components/BottomBar";
import React from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>
interface ChatScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp & ChatScreenNavigationProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) =>{
    return(
        <View style={styles.container}>
            <Text>
                Hello
            </Text>
            <BottomBar navigation={navigation} />
        </View>
    )
}
const styles = StyleSheet.create({
   container: {
       flex: 1,
   }
});
export default ChatScreen;