import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Place, RootStackParamList } from "../types/types";

interface PlaceScreenProps {
    route: RouteProp<RootStackParamList, 'PlaceScreen'>;
}

const PlaceScreen: React.FC<PlaceScreenProps> = ({ route }) => {
    const { place } = route.params;

    return (
        <View style={styles.container}>
            <Text>Place</Text>
            <Text>{place.id}</Text>
            <Text>{place.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PlaceScreen;
