import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import apiClient from "../../axiosConfig";
import { useAuth0 } from "react-native-auth0";
import BottomBar from "../components/BottomBar";
import AddPlaceButton from "../components/AddPlaceButton";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from "../components/StarRating";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Place, RootStackParamList } from "../types/types";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

interface MapScreenProps {
    navigation: MapScreenNavigationProp;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
    const { user, error } = useAuth0();
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        apiClient.get('/locations')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setPlaces(response.data);
                } else {
                    console.error('Invalid data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        getUserLocation();
    }, []);

    useEffect(() => {
        createUser()
    }, []);

    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLoc = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        };
        setUserLocation(userLoc);
        setMapRegion({
            ...userLoc,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        });
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                ...userLoc,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }, 1000);
        }
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

    const handleNavigateToLocation = (place: Place) => {
        navigation.navigate('PlaceScreen', { place });
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 50.0614300,
                    longitude: 19.9365800,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                region={mapRegion}
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        pinColor="blue"
                    />
                )}
                {places.map(place => (
                    <Marker
                        key={place.id}
                        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                        title={place.name}
                        description={place.description}
                    >
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.calloutTitle}>{place.name}</Text>
                                    <TouchableOpacity onPress={() => handleNavigateToLocation(place)}>
                                        <MaterialIcon name="open-in-full" size={16} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <Text>{place.description}</Text>
                                <View style={styles.ratingContainer}>
                                    <StarRating rating={place.rating} />
                                    <Text>
                                        ({place.ratingCount})
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
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    locationButton: {
        position: 'absolute',
        bottom: 85,
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
    nameContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    }
});

export default MapScreen;
