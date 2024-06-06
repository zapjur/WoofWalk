import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import apiClient from "../../axiosConfig";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import RootStackParamList from "../../RootStackParamList";

const AddPlaceScreen: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [region, setRegion] = useState<Region>({
        latitude: 50.0614300,
        longitude: 19.9365800,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const mapRef = useRef<MapView>(null);

    const handleAddPlace = async () => {
        if (!name || !description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const center = region;

       console.log(name, description, center.latitude, center.longitude);

        try {
            const response = await apiClient.post('/locations', {
                name,
                description,
                latitude: center.latitude,
                longitude: center.longitude,
            });

            navigation.navigate('Map');

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
            />
            <View style={styles.markerFixed}>
                <View style={styles.marker} />
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter place name"
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter place description"
                    multiline
                />
                <TouchableOpacity style={styles.button} onPress={handleAddPlace}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    markerFixed: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -12,
        marginTop: -24,
    },
    marker: {
        height: 24,
        width: 24,
        backgroundColor: 'red',
        borderColor: 'white',
        borderWidth: 3,
        borderRadius: 12,
        transform: [{ translateY: -12 }],
    },
    form: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AddPlaceScreen;
