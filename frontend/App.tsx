import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import LoginScreen from "./src/screens/LoginScreen";
import UserScreen from "./src/screens/UserScreen";
import FriendsScreen from "./src/screens/FriendsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import RootStackParamList from "./RootStackParamList";
import { Auth0Provider } from 'react-native-auth0';
import AddPlaceScreen from "./src/screens/AddPlaceScreen";
import PlaceScreen from "./src/screens/PlaceScreen";
import NearbyScreen from "./src/screens/NearbyScreen";
import {LocationProvider} from "./src/contexts/LocationContext";

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <Auth0Provider domain={"dev-h5zqtrdr8n7sgz84.us.auth0.com"} clientId={"QYzAJiWlnzcgLlozDVuRJEpGvcTJxQXv"}>
            <LocationProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Map" component={MapScreen} />
                        <Stack.Screen name="User" component={UserScreen}/>
                        <Stack.Screen name="Friends" component={FriendsScreen}/>
                        <Stack.Screen name="AddPlace" component={AddPlaceScreen}/>
                        <Stack.Screen name="PlaceScreen" component={PlaceScreen}/>
                        <Stack.Screen name="NearbyScreen" component={NearbyScreen}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </LocationProvider>
        </Auth0Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;
