import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import RootStackParamList from "../../RootStackParamList";
import {Place, NearestPlace} from "../types/types";
import axios from "axios";
import {useLocation} from "../contexts/LocationContext";
import StarRating from "../components/StarRating";
import BottomBar from "../components/BottomBar";
import {StackNavigationProp} from "@react-navigation/stack";

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

    const findNearestPlaces = async () => {
        const origins = `${userLocation.latitude},${userLocation.longitude}`;
        const destinations = places.map(place => `${place.latitude},${place.longitude}`).join('|');

        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            const distances = response.data.rows[0].elements;

            const placesWithDistance = places.map((place, index) => ({
                ...place,
                distance: distances[index].distance.value / 1000,
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
                                <Text>{place.description}</Text>
                                <Text>Distance: {place.distance.toFixed(1)}km</Text>
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
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 8,
    }
});
export default NearbyScreen;