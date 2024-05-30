import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import apiClient from "../../axiosConfig";
import {useAuth0} from "react-native-auth0";
import BottomBar from "../components/BottomBar";
import AddPlaceButton from "../components/AddPlaceButton";
import RootStackParamList from "../../RootStackParamList";
import {StackNavigationProp} from "@react-navigation/stack";

interface Location {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    description: string;
    rating: number;
}
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

interface MapScreenProps {
    navigation: MapScreenNavigationProp;
}
const MapScreen: React.FC<MapScreenProps> = ({navigation}) => {
    const [locations, setLocations] = useState<Location[]>([]);
    const {user, error} = useAuth0();
    console.log(user?.name);
    useEffect(() => {
        apiClient.get('/locations')
            .then(response => {
                console.log('Response data:', response.data);
                if (Array.isArray(response.data)) {
                    setLocations(response.data);
                } else {
                    console.error('Invalid data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

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
                    />
                ))}
            </MapView>
            <AddPlaceButton/>
            <BottomBar navigation={navigation}/>
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
    }
});

export default MapScreen;