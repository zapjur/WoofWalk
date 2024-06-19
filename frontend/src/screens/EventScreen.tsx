import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Dimensions } from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";

import axios from "axios";

import RootStackParamList from "../../RootStackParamList";


const { width } = Dimensions.get('window');

interface EventScreenProps {
    route: RouteProp<RootStackParamList, 'EventScreen'>;
}



const EventScreen: React.FC<EventScreenProps> = ({ route }) => {
    const { place, userLocation } = route.params;
    const [distance, setDistance] = useState<string | null>(null);
    const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const navigation = useNavigation();
    useEffect(() => {

        if (userLocation) {
            const calculateDistance = async () => {
                try {
                    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                        params: {
                            origins: `${userLocation.latitude},${userLocation.longitude}`,
                            destinations: `${place.latitude},${place.longitude}`,
                            key: googleMapsApiKey,
                        },
                    });
                    const distanceText = response.data.rows[0].elements[0]?.distance?.text || "Distance not available";
                    setDistance(distanceText);
                } catch (error) {
                    console.error('Error calculating distance:', error);
                }
            };
            calculateDistance();
        }
    }, [userLocation, place.id]);

    useEffect(() => {
        navigation.setOptions({title: ''});
    }, []);



    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{place.name}</Text>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1968/1968779.png' }}
                        style={styles.placeImage}
                    />
                    <View style={styles.detailsContainer}>
                        <View style={styles.detail}>
                            <Text style={styles.detailsText}>Distance</Text>
                            <Text>{distance}</Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailsText}>Category</Text>
                            <Text>{place.category.charAt(0)+place.category.slice(1).toLowerCase()}</Text>
                        </View>
                    </View>
                    <Text style={styles.nameText}>About {place.name}</Text>
                    <Text style={styles.descriptionText}>{place.description}</Text>
                    <View style={styles.separator} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    nameText: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 16,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        gap: 10,
        marginBottom: 10,
    },
    infoContainer: {
        padding: 16,
        gap: 10,
    },
    placeImage: {
        width: width - 32,
        height: 400,
        borderRadius: 10,
        marginBottom: 10,
    },
    imageScrollView: {
        width: '100%',
        height: 400,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailsText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    detail: {
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 50,
        backgroundColor: 'blue',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
    },
    opinionContainer: {
        flexDirection: 'column',
        gap: 10,
        paddingVertical: 10,
    },
    opinionSeparator: {
        height: 1,
        backgroundColor: '#edede9',
    },
    separator: {
        height: 5,
        backgroundColor: '#edede9',
        borderRadius: 5,
    },
});

export default EventScreen;
