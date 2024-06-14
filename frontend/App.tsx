import React from 'react';

import MapScreen from './src/screens/MapScreen';
import LoginScreen from "./src/screens/LoginScreen";
import UserScreen from "./src/screens/UserScreen";
import FriendsScreen from "./src/screens/FriendsScreen";
import {NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import RootStackParamList from "./RootStackParamList";
const Stack = createStackNavigator<RootStackParamList>();

import { Auth0Provider} from 'react-native-auth0';
import AddPlaceScreen from "./src/screens/AddPlaceScreen";
import ChatScreen from "./src/screens/ChatScreen";
import DirectMessageScreen from "./src/screens/DirectMessageScreen";

const App: React.FC = () => {
    return (
        <Auth0Provider domain={"dev-h5zqtrdr8n7sgz84.us.auth0.com"} clientId={"QYzAJiWlnzcgLlozDVuRJEpGvcTJxQXv"}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Map" component={MapScreen} />
                    <Stack.Screen name="User" component={UserScreen}/>
                    <Stack.Screen name="Friends" component={FriendsScreen}/>
                    <Stack.Screen name="AddPlace" component={AddPlaceScreen}/>
                    <Stack.Screen name="Chat" component={ChatScreen}/>
                    <Stack.Screen name="DM" component={DirectMessageScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Auth0Provider>
    );
};

export default App;