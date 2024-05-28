import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import LoginScreen from "./src/screens/LoginScreen";
import {NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import RootStackParamList from "./RootStackParamList";
const Stack = createStackNavigator<RootStackParamList>();
import { Auth0Provider} from 'react-native-auth0';
const App: React.FC = () => {
    return (
        <Auth0Provider domain={"dev-h5zqtrdr8n7sgz84.us.auth0.com"} clientId={"QYzAJiWlnzcgLlozDVuRJEpGvcTJxQXv"}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Map" component={MapScreen} />
                </Stack.Navigator>
            </NavigationContainer>
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
