import React from 'react';


import MapScreen from './src/screens/MapScreen';
import LoginScreen from "./src/screens/LoginScreen";
import UserScreen from "./src/screens/UserScreen";
import FriendsScreen from "./src/screens/FriendsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import RootStackParamList from "./RootStackParamList";
import { Auth0Provider } from 'react-native-auth0';
import AddPlaceScreen from "./src/screens/AddPlaceScreen";
import ChatScreen from "./src/screens/ChatScreen";
import DirectMessageScreen from "./src/screens/DirectMessageScreen";

import PlaceScreen from "./src/screens/PlaceScreen";
import NearbyScreen from "./src/screens/NearbyScreen";
import {LocationProvider} from "./src/contexts/LocationContext";
import EventScreen from "./src/screens/EventScreen";

const Stack = createStackNavigator<RootStackParamList>();


const App: React.FC = () => {
    return (
        <Auth0Provider domain={"dev-h5zqtrdr8n7sgz84.us.auth0.com"} clientId={"QYzAJiWlnzcgLlozDVuRJEpGvcTJxQXv"}>
            <LocationProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Login">
                        <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }}/>
                        <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
                        <Stack.Screen name="User" component={UserScreen} options={{ headerShown: false }}/>
                        <Stack.Screen name="Friends" component={FriendsScreen} options={{ headerShown: false }}/>
                        <Stack.Screen name="AddPlace" component={AddPlaceScreen}/>
                        <Stack.Screen name="PlaceScreen" component={PlaceScreen}/>
                        <Stack.Screen name="EventScreen" component={EventScreen}/>
                        <Stack.Screen name="NearbyScreen" component={NearbyScreen} options={{ headerShown: false }}/>
                        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
                        <Stack.Screen name="DM" component={DirectMessageScreen}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </LocationProvider>
        </Auth0Provider>
    );
};


export default App
