import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
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
                <MaterialIcon name="map" size={30} color="#007bff" />
                <Text style={styles.buttonText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNearbyButtonPress}>
                <MaterialCommunityIcon name="google-nearby" size={30} color="#007bff" />
                <Text style={styles.buttonText}>Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChatButtonPress}>
                <MaterialIcon name="chat" size={30} color="#007bff" />
                <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleFriendsButtonPress}>
                <MaterialIcon name="group" size={30} color="#007bff" />
                <Text style={styles.buttonText}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUserProfileButtonPress}>
                <MaterialIcon name="person" size={30} color="#007bff" />
                <Text style={styles.buttonText}>Profile</Text>
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
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
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
