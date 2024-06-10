import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import { useAuth0 } from "react-native-auth0";
import * as SecureStore from "expo-secure-store";
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { authorize } = useAuth0();
  const { user, error } = useAuth0();
  const handleLoginPress = async () => {
    try {
      const authResult = await authorize({
        audience: "https://dev-h5zqtrdr8n7sgz84.us.auth0.com/api/v2/",
      });
      console.log("Auth result: " + authResult?.accessToken);
      if (authResult && authResult.accessToken) {
        await SecureStore.setItemAsync("authToken", authResult.accessToken);
        navigation.navigate("Map");
      } else {
        console.log("Authorization failed, no access token returned");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
