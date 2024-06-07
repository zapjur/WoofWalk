import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { Rating } from 'react-native-ratings';
import * as Location from 'expo-location';
import apiClient from "../../axiosConfig";
import { useAuth0 } from "react-native-auth0";
import BottomBar from "../components/BottomBar";
import AddPlaceButton from "../components/AddPlaceButton";
import RootStackParamList from "../../RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';

interface Location {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    description: string;
    rating: number;
    ratingCount: number;
}

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
interface MapScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const { user, error } = useAuth0();

    useEffect(() => {
        apiClient.get('/locations')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setLocations(response.data);
                } else {
                    console.error('Invalid data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        createUser();
        getUserLocation();
    }, []);

    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        });
    };

    const createUser = async () => {
        try {
            if (user) {
                const userData = {
                    email: user.email,
                    nickname: user.nickname
                };
                const response = await apiClient.post("/user/createUser", userData);
            }
        }
        catch (e) {
            console.log(e);
        }
    };

    const handleRatingCompleted = async (rating: number, locationId: number) => {
        const userEmail = user?.email;
        try {
            const response = await apiClient.post(`/locations/${locationId}/rate`, { rating, userEmail });
            Alert.alert("Dziękujemy!", "Twoja ocena została zapisana.");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    Alert.alert("Błąd", error.response.data);
                } else {
                    Alert.alert("Error", "Failed to add place: " + error.message);
                }
            } else if (error instanceof Error) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Error", "An unknown error occurred");
            }
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 50.0614300,
                    longitude: 19.9365800,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                region={
                    userLocation
                        ? {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }
                        : undefined
                }
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        pinColor="blue"
                    />
                )}
                {locations.map(location => (
                    <Marker
                        key={location.id}
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title={location.name}
                        description={location.description}
                    >
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{location.name}</Text>
                                <Text>{location.description}</Text>
                                <View style={styles.ratingContainer}>
                                    <Rating
                                        type='star'
                                        startingValue={location.rating}
                                        imageSize={24}
                                        onFinishRating={(rating: number) => handleRatingCompleted(rating, location.id)}
                                        style={styles.rating}
                                    />
                                    <Text>
                                        ({location.ratingCount})
                                    </Text>
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
                <Icon name="location-arrow" size={24} color="white" />
            </TouchableOpacity>
            <AddPlaceButton />
            <BottomBar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1
    },
    calloutContainer: {
        width: 200,
        maxWidth: 200,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    calloutTitle: {
        fontWeight: 'bold',
    },
    rating: {
        marginTop: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007bff',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4,
    },
});

export default MapScreen;
