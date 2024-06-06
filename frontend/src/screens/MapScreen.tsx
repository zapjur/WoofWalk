import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Rating } from 'react-native-ratings';
import apiClient from "../../axiosConfig";
import { useAuth0 } from "react-native-auth0";
import BottomBar from "../components/BottomBar";
import AddPlaceButton from "../components/AddPlaceButton";
import RootStackParamList from "../../RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";

interface Location {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    description: string;
    rating: number;
}

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
interface MapScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
    const [locations, setLocations] = useState<Location[]>([]);
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
    }, []);

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

    const handleRatingCompleted = async (rating:number, locationId:number) => {
        const userEmail = user?.email;
        try {
            const response = await apiClient.post(`/locations/${locationId}/rate`, { rating, userEmail });
            Alert.alert("Dziękujemy!", "Twoja ocena została zapisana.");
        }catch (error: unknown) {
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
            >
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
                                <Rating
                                    type='star'
                                    startingValue={location.rating}
                                    imageSize={24}
                                    onFinishRating={(rating:number) => handleRatingCompleted(rating, location.id)}
                                    style={styles.rating}
                                />
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
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
    }
});

export default MapScreen;
