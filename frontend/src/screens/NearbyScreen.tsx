import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from "react-native";
import RootStackParamList from "../../RootStackParamList";
import {Place, NearestPlace} from "../types/types";
import axios from "axios";
import {useLocation} from "../contexts/LocationContext";
import StarRating from "../components/StarRating";
import BottomBar from "../components/BottomBar";
import {StackNavigationProp} from "@react-navigation/stack";
import apiClient from "../../axiosConfig";

type NearbyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NearbyScreen'>;

interface NearbyScreenProps {
    navigation: NearbyScreenNavigationProp;
}

const NearbyScreen: React.FC<NearbyScreenProps> = ({ navigation }) => {
    const [nearestPlaces, setNearestPlaces] = useState<NearestPlace[]>([]);
    const { userLocation, places } = useLocation();


    if(!userLocation) {
        return (
            <View>
                <Text>We don't have your location!</Text>
            </View>
        )

    }

    useEffect(() => {

        findNearestPlaces();
    }, []);

    const fetchImageUri = async (placeId: number): Promise<string> => {
        try {
            const response = await apiClient.get(`/locations/image/${placeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching photo for place ${placeId}:`, error);
            return '';
        }
    };

    const findNearestPlaces = async () => {
        const origins = `${userLocation.latitude},${userLocation.longitude}`;
        const destinations = places.map(place => `${place.latitude},${place.longitude}`).join('|');

        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;
        console.log(url);
        try {
            const response = await axios.get(url);
            const distances = response.data.rows[0].elements;

            let placesWithDistance = places.map((place, index) => {
                const distance = distances[index]?.distance?.value;
                return {
                    ...place,
                    distance: distance ? distance / 1000: -1,
                    imageUri: '',
                };
            });
            placesWithDistance = await Promise.all(placesWithDistance.map(async (place) => {
                const imageUri = await fetchImageUri(place.id);
                return { ...place, imageUri };
            }));

            const sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 10);
            setNearestPlaces(sortedPlaces);
        } catch (error) {
            console.error('Error fetching distance matrix:', error);
        }
    };

    const handleNavigateToPlaceScreen = (place: Place) => {
        console.log('Navigating to:', place);
        navigation.navigate('PlaceScreen', { place, userLocation: userLocation });
    };

    return (
        <View>
            <ScrollView>
                <View style={styles.container}>
                    {nearestPlaces.map(place => (
                        <View key={place.id} style={styles.placeContainer}>
                            <TouchableOpacity onPress={() => handleNavigateToPlaceScreen(place)}>
                                <Text style={styles.placeName}>{place.name}</Text>
                                {place.imageUri ? (
                                    <Image source={{ uri: place.imageUri }} style={styles.placeImage} />
                                ) : (
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/848/848043.png'}} style={styles.placeImage}/>
                                )}
                                <Text style={styles.description}>{place.description}</Text>
                                <View style={styles.distanceContainer}>
                                    <Text style={styles.distanceText}>Distance:</Text>
                                    <Text>{place.distance.toFixed(1)}km</Text>
                                </View>
                                <View style={styles.ratingContainer}>
                                    <StarRating rating={place.rating} fontSize={16}/>
                                    <Text>({place.ratingCount})</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <BottomBar navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    placeContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    placeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    distanceContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    distanceText: {
        fontWeight: 'bold',
    },
    placeImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    description: {
        marginBottom: 4,
        fontSize: 16,
    }
});
export default NearbyScreen;