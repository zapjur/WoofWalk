import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, TextInput, Button, Alert, Dimensions } from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import { LocationDetails } from "../constants/types";
import StarRating from "../components/StarRating";
import apiClient from "../../axiosConfig";
import axios from "axios";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import { useAuth0 } from "react-native-auth0";
import RootStackParamList from "../../RootStackParamList";
import {useLocation} from "../contexts/LocationContext";


const { width } = Dimensions.get('window');

interface PlaceScreenProps {
    route: RouteProp<RootStackParamList, 'PlaceScreen'>;
}



const PlaceScreen: React.FC<PlaceScreenProps> = ({ route }) => {
    const { place, userLocation } = route.params;
    const [distance, setDistance] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [opinion, setOpinion] = useState('');
    const [rating, setRating] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
    const [refreshOpinions, setRefreshOpinions] = useState(false);
    const { setRefreshKey } = useLocation();
    const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const userEmail = useAuth0().user?.email;
    const navigation = useNavigation();
    useEffect(() => {
        apiClient.get(`/locations/details/${place.id}`)
            .then(response => {
                setLocationDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching location details:', error);
            });

        apiClient.get(`/locations/ratingCount/${place.id}`).
            then(response => {
                place.ratingCount = response.data;
        }).catch(error => {
            console.error('Error fetching rating count:', error);
        });

        apiClient.get(`/locations/rating/${place.id}`).
        then(response => {
            place.rating = response.data;
        }).catch(error => {
            console.error('Error fetching rating:', error);
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

            calculateDistance().catch(error => console.log(error));
        }
    }, [userLocation, place.id, refreshOpinions]);

    useEffect(() => {
        navigation.setOptions({title: ''});
    }, []);

    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            setImages([...images, ...selectedImages]);
        }
    };

    const submitReview = async () => {
        if (!rating) {
            Alert.alert('Rating is required');
            return;
        }
        if(!userEmail) {
            Alert.alert('Please log in to submit a review');
            return;
        }
        if(rating !== '1' && rating !== '2' && rating !== '3' && rating !== '4' && rating !== '5'){
            Alert.alert("Invalid rating", "Please provide valid rating");
            return;
        }
        const formData = new FormData();
        formData.append('userEmail', userEmail);
        formData.append('rating', rating);
        if (opinion) {
            formData.append('opinion', opinion);
        }
        if (images.length > 0) {
            images.forEach((imageUri) => {
                const fileName = imageUri.split('/').pop();
                const fileType = fileName?.split('.').pop();
                formData.append('images', {
                    uri: imageUri,
                    name: fileName,
                    type: `image/${fileType}`,
                } as any);
            });
        }

        try {
            const response = await apiClient.post(`/locations/${place.id}/reviews`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                Alert.alert('Review submitted successfully');
                setModalVisible(false);
                setOpinion('');
                setRating('');
                setImages([]);
                setRefreshOpinions(true);
                setRefreshKey(oldKey => oldKey + 1);

            } else {
                Alert.alert('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error submitting review');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{place.name}</Text>
                    {locationDetails && locationDetails.images.length > 0 ? (
                        <ScrollView horizontal={true} pagingEnabled={true} style={styles.imageScrollView}>
                            {locationDetails.images.map((imageUri, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: imageUri }}
                                    style={styles.placeImage}
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3875/3875433.png' }}
                            style={styles.placeImage}
                        />
                    )}
                    <View style={styles.detailsContainer}>
                        <View style={styles.detail}>
                            <Text style={styles.detailsText}>Distance</Text>
                            <Text>{distance}</Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailsText}>Rating</Text>
                            <View style={styles.ratingContainer}>
                                <StarRating rating={place.rating} fontSize={20} />
                                <Text>({place.ratingCount})</Text>
                            </View>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.detailsText}>Category</Text>
                            <Text>{place.category.charAt(0)+place.category.slice(1).toLowerCase()}</Text>
                        </View>
                    </View>
                    <Text style={styles.nameText}>About {place.name}</Text>
                    <Text style={styles.descriptionText}>{place.description}</Text>
                    <View style={styles.separator} />
                    <Text style={styles.nameText}>Opinions</Text>
                    {locationDetails && locationDetails.ratings.map((rating, index) => (
                        <View key={index}>
                            <View style={styles.opinionContainer}>
                                <Text>{rating.userEmail}</Text>
                                <StarRating rating={rating.rating} fontSize={20} />
                                <Text>{rating.opinion}</Text>
                            </View>
                            {index < locationDetails.ratings.length - 1 && (
                                <View style={styles.opinionSeparator} />
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <MaterialIcon name="add" size={24} color="white" />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Opinion</Text>
                        <TextInput
                            style={styles.input}
                            value={rating}
                            onChangeText={setRating}
                            placeholder="Give a rating out of 5"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={opinion}
                            onChangeText={setOpinion}
                            placeholder="Write your opinion"
                        />
                        <Button title="Select Images" onPress={selectImage} />
                        <View style={styles.imagePreviewContainer}>
                            {images.map((img, index) => (
                                <Image key={index} source={{ uri: img }} style={styles.imagePreview} />
                            ))}
                        </View>
                        <Button title="Submit" onPress={submitReview} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
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

export default PlaceScreen;
