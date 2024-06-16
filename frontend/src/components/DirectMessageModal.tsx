import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useAuth0} from "react-native-auth0";
import apiClient from "../../axiosConfig";
import {useNavigation} from "@react-navigation/native";
import DirectMessageScreen from "../screens/DirectMessageScreen";
import {createStackNavigator, StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";

type DirectMessageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DM'>
interface DirectMessageModalProps {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;

}
interface User {
    email: string;
}

const DirectMessageModal: React.FC<DirectMessageModalProps> = ({modalVisible, setModalVisible}) => {
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
    const [inputText, setInputText] = useState<string>('');
    const [friends, setFriends] = useState<User[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
    const suggestionContainerHeight = filteredFriends.length * 50;
    const {user} = useAuth0();
    const navigation = useNavigation<DirectMessageScreenNavigationProp>();
    useEffect(() => {
        if(user){
            apiClient.get("/friends/getAllFriends",{
                params: {
                    email: user.email,
                }
            }).then(response =>{
                if(Array.isArray(response.data)){
                    const friendsArray = response.data.map((item: any) => ({
                        email: item.email,
                        name: item.name || 'Unknown',
                    }));
                    setFriends(friendsArray);
                    setFilteredFriends(friendsArray);
                }
            }).catch(error => {
                console.error("Error fetching friends:", error);
            });
        }
    }, []);
    const handleCloseModal = () =>{
        setInputText('');
        setModalVisible(false);
    }
    const handleInputChange = (text: string) => {
        setInputText(text);
        if (text) {
            const filtered = friends.filter(friend =>
                friend.email.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredFriends(filtered);
        } else {
            setFilteredFriends(friends);
        }
    };
    const handleSendDM = () => {
        handleCloseModal();
        navigation.navigate('DM', { email: inputText});
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                handleCloseModal()
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search friends"
                            value={inputText}
                            onChangeText={(text) => {
                                handleInputChange(text);
                                setShowSuggestions(true);
                            }}
                        />
                    </View>
                    {inputText.length > 0 && filteredFriends.length > 0 && showSuggestions && (
                        <ScrollView style={[styles.suggestionsContainer, { height: suggestionContainerHeight, minHeight: 50 }]}>
                            {filteredFriends.map((friend, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.suggestionItem}
                                    onPress={() => {
                                        setInputText(friend.email);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <Text>{friend.email}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => handleCloseModal()}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonDM]}
                            onPress={() => handleSendDM()}
                        >
                            <Text style={styles.textStyle}>Send DM</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginTop: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
    },
    inputContainer: {
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: '#c0bebe',
        borderRadius: 7,
        marginTop: 5,
        marginBottom: 5,
        height: 44,
        width: 260,
    },
    input: {
        height: 44,
        borderColor: 'gray',
        borderRadius: 7,
        borderWidth: 2,
        paddingLeft: 8,
        marginBottom: 3,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#ea1828',
    },
    buttonDM: {
        backgroundColor: '#007bff',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
    },

    suggestionsContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        flex: 1,
        marginTop: 10,
        maxHeight: 80,
        maxWidth: 300,
        overflow: 'scroll',
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
})
export default DirectMessageModal
