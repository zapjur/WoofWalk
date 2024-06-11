import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Place, RootStackParamList } from "../types/types";
import StarRating from "../components/StarRating";
import apiClient from "../../axiosConfig";
import axios from "axios";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

interface PlaceScreenProps {
    route: RouteProp<RootStackParamList, 'PlaceScreen'>;
}

const PlaceScreen: React.FC<PlaceScreenProps> = ({ route }) => {
    const { place, userLocation } = route.params;
    const [image, setImage] = useState("none");
    const [distance, setDistance] = useState<string | null>(null);

    const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        apiClient.get("/user/profilePicture/download", {
            params: {
                email: "pz@gmail.com",
            },
            responseType: 'blob'
        }).then(response => {
            const blob = response.data;
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImage(reader.result as string);
                }
            };
            reader.readAsDataURL(blob);
        });

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
    }, [userLocation, place.latitude, place.longitude]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{place.name}</Text>
                    <Image
                        source={{ uri: image !== "none" ? image : 'https://cdn-icons-png.flaticon.com/128/848/848043.png' }}
                        style={styles.placeImage}
                    />
                    <View style={styles.detailsContainer}>
                        <View style={styles.detail}>
                            <Text style={styles.detailsText}>Rating</Text>
                            <View style={styles.ratingContainer}>
                                <StarRating rating={place.rating} />
                                <Text>({place.ratingCount})</Text>
                            </View>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailsText}>Distance</Text>
                            <Text>{distance}</Text>
                        </View>
                    </View>
                    <Text style={styles.nameText}>About {place.name}</Text>
                    <Text style={styles.descriptionText}>{place.description}</Text>
                    <Text style={styles.nameText}>Opinions</Text>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.addButton}>
                <MaterialIcon name="add" size={24} color="white" />
            </TouchableOpacity>
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
        padding: 20,
        gap: 10,
    },
    placeImage: {
        width: '100%',
        minHeight: 400,
        maxHeight: 400,
        borderRadius: 10,
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
        bottom: 20,
        backgroundColor: 'blue',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    }
});

export default PlaceScreen;
