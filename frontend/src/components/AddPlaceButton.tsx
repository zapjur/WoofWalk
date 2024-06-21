import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import RootStackParamList from "../../RootStackParamList";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddPlace')}
            >
                <MaterialIcon name="add" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Add a new location</Text>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    button: {
        position: 'absolute',
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: 240,
        bottom: 87,
        left: '46%',
        transform: [{ translateX: -100 }],
        backgroundColor: '#60dc62',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        zIndex: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HomeScreen;
