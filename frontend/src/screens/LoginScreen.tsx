import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
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

  const handleLoginPress = async () => {
    try {
      const authResult = await authorize({
        audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>WoofWalk</Text>
          <Text style={styles.subTitle}>Your Guide to Dog-Friendly Spots!</Text>
        </View>

        <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/128/9012/9012070.png" }}
            style={styles.image}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c9f6d4",
    padding: 20,
  },
  titleContainer: {
    marginBottom: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 180,
  },
  title: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#4c956c",

  },
  subTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4c956c",

  },
  loginButton: {
    backgroundColor: "#4c956c",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
