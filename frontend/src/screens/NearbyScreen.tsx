import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from "react-native";
import RootStackParamList from "../../RootStackParamList";
import {Place, NearestPlace} from "../constants/types";
import axios from "axios";
import {useLocation} from "../contexts/LocationContext";
import StarRating from "../components/StarRating";
import BottomBar from "../components/BottomBar";
import {StackNavigationProp} from "@react-navigation/stack";
import apiClient from "../../axiosConfig";
import { categories } from "../constants/types";
import ModalSelector from "react-native-modal-selector";

type NearbyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NearbyScreen'>;

interface NearbyScreenProps {
    navigation: NearbyScreenNavigationProp;
}

const NearbyScreen: React.FC<NearbyScreenProps> = ({ navigation }) => {
    const [nearestPlaces, setNearestPlaces] = useState<NearestPlace[]>([]);
    const { userLocation, places } = useLocation();
    const [sortingBy, setSortingBy] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const data = [
        ...categories,
        { key: -1, label: 'CLEAR', value: '' },
    ];
    if(!userLocation) {
        return (
            <View>
                <Text>We don't have your location!</Text>
            </View>
        )

    }

    useEffect(() => {
        findNearestPlaces();
    }, [sortingBy]);


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
        let filteredPlaces = places;
        if(sortingBy !== ''){
            filteredPlaces = places.filter(place =>
                place.category.toString().toUpperCase() === sortingBy.toString().toUpperCase());
        }
        const destinations = filteredPlaces
            .map(place => `${place.latitude},${place.longitude}`)
            .join('|');

        if(filteredPlaces.length !== 0){
            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;
            try {
                const response = await axios.get(url);
                const distances = response.data.rows[0].elements;

                let placesWithDistance = filteredPlaces.map((place, index) => {
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

                const sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance);
                setNearestPlaces(sortedPlaces);
            } catch (error) {
                console.error('Error fetching distance matrix:', error);
            }
        }
        else{
            setNearestPlaces([]);
        }
    };

    const handleNavigateToPlaceScreen = (place: Place) => {

        if(place.category.toUpperCase() !== 'EVENT'){
            navigation.navigate('PlaceScreen', { place, userLocation: userLocation });
        }
        else {
            navigation.navigate('EventScreen', {place, userLocation: userLocation})
        }

    };

    return (
        <View style={styles.outerContainer}>
            {nearestPlaces.length > 0 ? (
                <>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                        <View style={styles.container}>
                            {nearestPlaces.map(place => (
                                <View key={place.id} style={styles.placeContainer}>
                                    <TouchableOpacity onPress={() => handleNavigateToPlaceScreen(place)}>
                                        <Text style={styles.placeName}>{place.name}</Text>
                                        {place.imageUri ? (
                                            <Image source={{ uri: place.imageUri }} style={styles.placeImage} />
                                        ) : place.category.toUpperCase() !== 'EVENT' ? (
                                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3875/3875433.png'}} style={styles.placeImageNone}/>
                                        ) : (
                                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1968/1968779.png'}} style={styles.placeImageNone}/>
                                        )}
                                        <Text style={styles.description}>{place.description}</Text>
                                        <View style={styles.distanceContainer}>
                                            <Text style={styles.distanceText}>Category:</Text>
                                            <Text>{place.category.charAt(0) + place.category.slice(1).toLowerCase()}</Text>
                                        </View>
                                        <View style={styles.distanceContainer}>
                                            <Text style={styles.distanceText}>Distance:</Text>
                                            <Text>{place.distance.toFixed(1)}km</Text>
                                        </View>
                                        {place.category.toUpperCase() !== "EVENT" && (
                                            <View style={styles.ratingContainer}>
                                                <StarRating rating={place.rating} fontSize={16}/>
                                                <Text>({place.ratingCount})</Text>
                                            </View>
                                        )}
                                        {place.category.toUpperCase() == "EVENT" && (
                                            <View style={styles.distanceContainer}>
                                                <Text style={styles.distanceText}>Date:</Text>
                                                <Text>{place.date}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </>
            ) : (
                <View style={styles.container}>
                    <Text>No data available.</Text>
                </View>
            )}
            <ModalSelector
                visible={modalVisible}
                data={data}
                onModalClose={() => setModalVisible(false)}
                onChange={(option) => setSortingBy(option.value)}
            />
            <View style={styles.sortContainer}>
                {sortingBy != '' && (
                    <View style={styles.sortingByContainer}>
                        <Text>Sorted by: {sortingBy}</Text>
                    </View>
                )}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.sort}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/9630/9630141.png' }}
                        style={styles.sortIcon}
                    />
                </TouchableOpacity>
            </View>
            <BottomBar navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        marginTop: 50,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginTop: 5,
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 16,
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
    placeImageNone: {
        width: 200,
        display: "flex",
        alignSelf: "center",
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    description: {
        marginBottom: 4,
        fontSize: 16,
    },
    scrollView: {
        marginTop: 35,
        paddingBottom: 80,
    },
    sort: {

    },
    sortIcon: {
        width: 42,
        height: 42,
    },
    sortContainer: {
        position:"absolute",
        right: 16.5,
        padding: 5,
        top: 30,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(206,204,224,0.5)"
    },
    sortingByContainer: {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 35,
        marginRight: 5,
        padding: 5,
        borderRadius: 10,
    },
});
export default NearbyScreen;