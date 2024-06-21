import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RootStackParamList from "../../RootStackParamList";
import {StackNavigationProp} from "@react-navigation/stack";
import { useLocation } from "../contexts/LocationContext";

type BottomBarNavigationProp = StackNavigationProp<RootStackParamList>;


interface BottomBarProps {
    navigation: BottomBarNavigationProp;
}

const BottomBar: React.FC<BottomBarProps> = ({ navigation }) => {
    const { setRefreshKey } = useLocation();

    const handleUserProfileButtonPress = () =>{
        navigation.navigate('User');
    }
    const handleMapButtonPress = () =>{
        setRefreshKey(oldKey => oldKey + 1);
        navigation.navigate('Map');
    }
    const handleFriendsButtonPress = () =>{
        navigation.navigate('Friends');
    }

    const handleChatButtonPress = () =>{
        navigation.navigate('ChatList');
    }

    const handleNearbyButtonPress = () =>{
        navigation.navigate('NearbyScreen');
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.button} onPress={handleMapButtonPress}>
                <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/854/854929.png"}} style={styles.image}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNearbyButtonPress}>
                <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/4020/4020798.png"}} style={styles.image}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChatButtonPress}>
                <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/2665/2665393.png"}} style={styles.image}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleFriendsButtonPress}>
                <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/7186/7186643.png"}} style={styles.image}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUserProfileButtonPress}>
                <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/1864/1864509.png"}} style={styles.image}></Image>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
    },
    image: {
        width: 38,
        height: 38,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    buttonText: {
        color: '#007bff',
        fontSize: 12,
    },
});

export default BottomBar;
