import React, {createContext, useState, useEffect, useContext, ReactNode} from 'react';
import * as Location from 'expo-location';
import apiClient from "../../axiosConfig";
import { Place, userLocation } from "../constants/types";
import {Alert} from "react-native";

interface LocationContextProps {
    userLocation: userLocation | null;
    places: Place[];
    getUserLocation: () => void;
    fetchPlaces: () => void;
    refreshKey: number;
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const LocationContext = createContext<LocationContextProps>({
    userLocation: null,
    places: [],
    getUserLocation: () => {},
    fetchPlaces: () => {},
    refreshKey: 0,
    setRefreshKey: () => {},
});

interface LocationProviderProps {
    children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchPlaces();
        getUserLocation();
    }, []);

    const fetchPlaces = async () => {
        apiClient.get('/locations')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setPlaces(response.data);
                } else {
                    console.error('Invalid data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    useEffect(() => {
        fetchPlaces();
    }, [refreshKey]);

    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userLoc = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        setUserLocation(userLoc);
    };

    return (
        <LocationContext.Provider value={{ userLocation, places, getUserLocation, fetchPlaces, refreshKey, setRefreshKey }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
