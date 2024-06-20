import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import RootStackParamList from "../../RootStackParamList";

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AddPlace')}
        >
            <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({

    button: {
        position: 'absolute',
        width: 200,
        bottom: 90,
        left: '50%',
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
