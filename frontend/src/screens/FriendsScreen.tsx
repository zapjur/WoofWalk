import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import React from "react";
import {Text, View, StyleSheet} from "react-native";
import AddFriend from "../components/AddFriend";
import BottomBar from "../components/BottomBar";
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
interface FriendsScreenProp {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp;
}
const FriendsScreen: React.FC<FriendsScreenProp> = ({navigation}) => {
    return(
        <View style={styles.container}>
            <Text>Siema</Text>
            <BottomBar navigation={navigation}/>
            <AddFriend/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex:1
    }
})
export default FriendsScreen;