import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AddPlaceButton from "../components/AddPlaceButton";

interface Place {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
}

const MapScreen: React.FC = () => {
    const places: Place[] = [
        { id: 1, latitude: 50.0614300, longitude: 19.9365800, title: "Dog Park 1", description: "A nice place to walk your dog" },
        { id: 2, latitude: 50.0514300, longitude: 19.9465800, title: "Dog Park 2", description: "Another great place for dogs" },
    ];

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 50.0614300,
                longitude: 19.9365800,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            {places.map(place => (
                <Marker
                    key={place.id}
                    coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                    title={place.title}
                    description={place.description}
                />
            ))}
        </MapView>
);
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default MapScreen;
