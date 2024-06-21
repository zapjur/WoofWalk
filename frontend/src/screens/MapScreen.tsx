import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import apiClient from "../../axiosConfig";
import { useAuth0 } from "react-native-auth0";
import BottomBar from "../components/BottomBar";
import AddPlaceButton from "../components/AddPlaceButton";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from "../components/StarRating";
import { Place } from "../constants/types";
import RootStackParamList from "../../RootStackParamList";
import { useLocation } from "../contexts/LocationContext";
import { icons } from "../constants/types";
import ModalSelector from "react-native-modal-selector";
import {categories} from "../constants/types";
import ClusteredMapView from "react-native-map-clustering";



type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

interface MapScreenProps {
    navigation: MapScreenNavigationProp;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
    const { userLocation, places, getUserLocation } = useLocation();
    const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
    const { user } = useAuth0();
    const [opinionAdded, setOpinionAdded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [sortingBy, setSortingBy] = useState('');

    const mapRef = useRef<MapView>(null);
    const data = [
        { key: -1, label: 'ALL', value: '' },
        ...categories,
    ];

    useEffect(() => {

        createUser().catch(error => console.log(error));
        if (userLocation) {
            const region = {
                ...userLocation,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setMapRegion(region);
            if (mapRef.current) {
                mapRef.current.animateToRegion(region, 1000);
            }
        }
    }, [userLocation]);

    const createUser = async () => {
        try {
            if (user) {
                const userData = {
                    email: user.email,
                    nickname: user.nickname
                };
                await apiClient.post("/user/createUser", userData);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const iconMap = useMemo(() => {
        const map: { [key: string]: string } = {};
        icons.forEach(icon => {
            map[icon.label.toUpperCase()] = icon.value;
        });
        return map;
    }, []);

    const getIcon = (key: string) => iconMap[key.toUpperCase()];


    const handleNavigateToPlace = (place: Place) => {
        if(place.category.toUpperCase() !== 'EVENT'){
            navigation.navigate('PlaceScreen', {
                place,
                userLocation,
            });
        }
        else{
            navigation.navigate('EventScreen', {
                place,
                userLocation,
            })
        }
    };

    const renderMarkers = useMemo(() => {
        let sortedPlaces = places;
        if(sortingBy != ''){
            sortedPlaces = places.filter(place => place.category.toUpperCase() == sortingBy.toUpperCase());
        }
        setOpinionAdded(false);
        return sortedPlaces.map(place => (
            <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.name}
                description={place.description}
            >
                <Image
                    source={{ uri: getIcon(place.category) }}
                    style={{ width: 40, height: 40 }}
                />
                <Callout tooltip onPress={() => handleNavigateToPlace(place)}>
                    <View style={styles.calloutContainer}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.calloutTitle}>{place.name}</Text>
                        </View>
                        <Text>{place.description}</Text>
                        {place.category.toUpperCase() !== "EVENT" && (
                            <View style={styles.ratingContainer}>
                                <StarRating rating={place.rating} fontSize={24} />
                                <Text>
                                    ({place.ratingCount})
                                </Text>
                            </View>
                        )}
                        {place.category.toUpperCase() == "EVENT" && (
                            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <Text style={{fontWeight: "bold"}}>
                                    Date:
                                </Text>
                                <Text style={{marginLeft: 5}}>
                                    { place.date}
                                </Text>
                            </View>
                        )}
                    </View>
                </Callout>
            </Marker>
        ));
    }, [places, sortingBy, opinionAdded]);

    return (
        <View style={styles.container}>
            <ClusteredMapView
                ref = {mapRef}
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
                {renderMarkers}
            </ClusteredMapView>
            <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
                <Icon name="location-arrow" size={24} color="white" />
            </TouchableOpacity>
            <AddPlaceButton />
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
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    sortContainer: {
        position:"absolute",
        right: 10,
        top: 80,
        padding: 5,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(206,204,224,0.7)"
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
    container: {
        flex: 1
    },
    calloutContainer: {
        width: 200,
        maxWidth: 200,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
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
        backgroundColor: '#60dc62',
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
    },
    buttonPageScreen: {
        width: 20,
        height: 20,
        zIndex: 10,
    },
    sort: {

    },
    sortIcon: {
        width: 42,
        height: 42,
    },

});

export default MapScreen;
