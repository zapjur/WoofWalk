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
    const [interestedUsers, setInterestedUsers] = useState<String []>([]);
    const [refresh, setRefresh] = useState(false);
    const {user} = useAuth0();
    const [profilePictures, setProfilePictures] = useState<[String, string][]>([]);
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
            calculateDistance().catch(error => console.log(error));
        }
    }, [userLocation, place.id]);

    const handleInterestedInPress = () =>{
        handleIsUserInterested().catch(error => console.log(error));
        setIsUserInterested(!isUserInterested);
    }
    const handleIsUserInterested = async () => {
        if(user){
            try {
                if (!isUserInterested) {
                    await apiClient.post(`/events/addUser/${place.id}`);
                } else {
                    await apiClient.post(`/events/deleteUser/${place.id}`);
                }
                setRefresh(prev => !prev);
            }
            catch (error) {
                console.error('Error handling user interest:', error);
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
            .then(response =>{
                setInterestedUsers(response.data);
                getProfilePicture(response.data).catch(error => console.log(error));
            })
            .catch(error => console.log(error));

    }, [refresh]);

    const getProfilePicture = async (Users: String[]) => {
        if (user) {
            Users.map(userEmail => {
                apiClient.get("/user/profilePicture/download", {
                    params: { email: userEmail },
                    responseType: 'blob'
                }).then(response => {

                    if(response.status === 204){
                        setProfilePictures(prevProfilePictures => [
                            ...prevProfilePictures,
                            [userEmail, "https://cdn-icons-png.flaticon.com/128/848/848043.png"]
                        ]);
                    } else{
                        const blob = response.data;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            try {
                                if (reader.result) {
                                    setProfilePictures(prevProfilePictures => [
                                        ...prevProfilePictures,
                                        [userEmail, reader.result as string]
                                    ]);
                                }
                            } catch (error) {

                                console.error('Error setting profile picture:', error);
                            }
                        };
                        reader.readAsDataURL(blob);
                    }
                }).catch(error => {
                    console.error('Error downloading profile picture:', error);
                });
            });
        }
    }
    const findValue = (email : String) => {
        const found = profilePictures.find(entry => entry[0] === email);
        return found ? found[1] : 'https://cdn-icons-png.flaticon.com/128/848/848043.png'
    }

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
                            <Text style={styles.detailsText}>Date</Text>
                            <Text>{place.date}</Text>
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
                    <ScrollView >
                        <View style={styles.container}>
                            {interestedUsers.length > 0 ? (
                                interestedUsers.map((email, index) => (
                                    <View style={styles.shadowPanel}>
                                        <View key={index} style={styles.userContainer}>
                                            <Image
                                                source={{uri: findValue(email)}}
                                                style={styles.profilePicture}>
                                            </Image>
                                            <Text style={styles.userText}>{email}</Text>
                                        </View>
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 5,
        marginTop: 5,
    },
    userText: {
        marginLeft: 20,
        padding: 5,
        fontSize: 18,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 45,
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
