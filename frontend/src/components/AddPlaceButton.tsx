import React from "react";
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddPlaceButton: React.FC = () => {
    return (
        <TouchableOpacity style={styles.button}>
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
        backgroundColor: '#007bff',
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

export default AddPlaceButton;
