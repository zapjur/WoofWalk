import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import axios from "axios";
import RootStackParamList from "../../RootStackParamList";

import apiClient from "../../axiosConfig";
import {useAuth0} from "react-native-auth0";





interface EventScreenProps {
    route: RouteProp<RootStackParamList, 'EventScreen'>;
}




const EventScreen: React.FC<EventScreenProps> = ({ route }) => {
    const { place, userLocation } = route.params;
    const [isUserInterested, setIsUserInterested] = useState(false)
    const [distance, setDistance] = useState<string | null>(null);
    const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const navigation = useNavigation();
    const [interestedUsers, setInterestedUsers] = useState<string []>([]);
    const [refresh, setRefresh] = useState(false);
    const {user} = useAuth0();
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

    const handleInterestedInPress = () =>{
        handleIsUserInterested()
        setIsUserInterested(!isUserInterested);
    }
    const handleIsUserInterested = async () => {
        if(user){
            if(!isUserInterested){
                await apiClient.post(`/events/addUser/${place.id}`)
                    .catch(error =>
                console.log(error))

                setRefresh(prev => !prev);
            }
            else{
                await apiClient.post(`/events/deleteUser/${place.id}`)
                    .catch(error =>
                    console.log(error))

                setRefresh(prev => !prev);
            }
            }
        }

    useEffect(() => {
        navigation.setOptions({title: ''});
    }, []);

    useEffect(() => {
        apiClient.get(`/events/isUserInterested/${place.id}`)
            .then(response => setIsUserInterested(response.data))
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        apiClient.get(`/events/getAllUsers/${place.id}`)
            .then(response => setInterestedUsers(response.data))
            .catch(error => console.log(error));

    }, [refresh]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.infoContainer}>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Text style={styles.nameText}>{place.name}</Text>
                        {isUserInterested ? (
                            <TouchableOpacity
                                style={styles.interestedInButton}
                                onPress={() => handleInterestedInPress()}>
                                <View>
                                    <Text>
                                        Interested
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ):(
                            <TouchableOpacity
                                style={styles.notInterestedInButton}
                                onPress={() => handleInterestedInPress()}
                            >
                                <View>
                                    <Text>
                                        Not interested
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

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
                    <Text style={styles.nameText}>Users interested in {place.name}</Text>
                    <ScrollView style={styles.shadowPanel}>
                        <View style={styles.container}>
                            {interestedUsers.length > 0 ? (
                                interestedUsers.map((userEmail, index) => (
                                    <View key={index} style={styles.userContainer}>
                                        <Text style={styles.userText}>{userEmail}</Text>
                                    </View>

                                ))

                            ) : (
                                <Text style={styles.userText}>Be a first interested user!</Text>
                            )}
                        </View>
                    </ScrollView>
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
    userContainer: {

    },
    userText: {
        marginLeft: 20,
        padding: 5
    },
    shadowPanel: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: "100%",
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center',
        marginBottom: 10,
    },
    interestedInButton: {
        backgroundColor: "#96f698",
        width: 130,
        height: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },
    notInterestedInButton: {
        backgroundColor: "#ff8e8e",
        width: 130,
        height: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
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
        justifyContent: 'space-around',
        gap: 10,
        marginBottom: 10,
    },
    infoContainer: {
        padding: 16,
        gap: 10,
    },
    placeImage: {
        width: 300,
        display: "flex",
        alignSelf: "center",
        height: 300,
        borderRadius: 8,
        marginBottom: 8,
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
