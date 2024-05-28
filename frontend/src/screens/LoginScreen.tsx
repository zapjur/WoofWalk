import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import RootStackParamList from '../../RootStackParamList';
import {useAuth0} from "react-native-auth0";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const {authorize} = useAuth0();
    const handleLoginPress = async () => {
        console.log("login button clicked");
        try {
            const authResult = await authorize();
            console.log("Auth result: " + authResult?.idToken);
            if (authResult && authResult.accessToken) {
                navigation.navigate('Map');
            }else{
                console.log('Authorization failed, no access token returned');
            }
        }
        catch (e){
            console.log(e);
        }

    };
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.buttonText} onPress={handleLoginPress}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
