import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Modal, TextInput } from 'react-native';
import { useAuth0 } from "react-native-auth0";
import React, {useState} from "react";
import {TouchableOpacity, Text, StyleSheet, View, Modal, TextInput, Alert} from 'react-native';
import {useAuth0} from "react-native-auth0";
import apiClient from "../../axiosConfig";
import axios from "axios";

interface AddFriendButtonProps {
    onFriendRequestSent: () => void;
}

const AddFriendButton: React.FC<AddFriendButtonProps> = ({ onFriendRequestSent }) => {
    const { user } = useAuth0();
    const [receiverEmail, setReceiverEmail] = useState("");
const AddFriendButton: React.FC<{ onInvitationSent: () => void }> = ({ onInvitationSent }) => {
    const {user} = useAuth0();
    const [ReceiverEmail, setReceiverEmail] = useState("0");
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddFriendPress = () => {
        setModalVisible(true);
    };

    const handleClosePhotoModal = () => {
        setModalVisible(false);
    };

    const handleInviteFriendPress = async () => {
        try {
            if (user) {
                const friendRequestData = {
                    senderEmail: user.email,
                    receiverEmail: ReceiverEmail,
                }
                try{
                    const response = await apiClient.post("/friends/invite", friendRequestData);
                    onInvitationSent();
                    setModalVisible(false);
                }
                catch (error: unknown) {
                    if (axios.isAxiosError(error) && error.response) {
                        if (error.response.status === 409) {
                            Alert.alert("Error", error.response.data);
                        }
                        else if(error.response.status === 400){
                            Alert.alert("Error", error.response.data);
                        }
                        else if(error.response.status === 404){
                            Alert.alert("Error",  error.response.data);
                        }
                        else {
                            Alert.alert("Error", "Failed to invite: " + error.message);
                        }
                    } else if (error instanceof Error) {
                        Alert.alert("Error", error.message);
                    } else {
                        Alert.alert("Error", "An unknown error occurred");
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleAddFriendPress}>
                <Text style={styles.buttonText}>Add Your Friend</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClosePhotoModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.headerSection}>
                            <Text style={styles.modalHeader}>Invite your friend</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder={"Provide your friend's email address"}
                                    onChangeText={setReceiverEmail}
                                    value={receiverEmail}
                                />
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={handleClosePhotoModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={handleInviteFriendPress}>
                                <Text style={styles.closeButtonText}>Invite</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        position: 'absolute',
        width: 200,
        bottom: 90,
        left: '50%',
        transform: [{ translateX: -100 }],
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        zIndex: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    inputContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: '#c0bebe',
        borderRadius: 7,
        marginTop: 15,
        height: 50,
        width: 260,
    },
    modalContent: {
        width: 350,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    headerSection: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    modalHeader: {
        fontWeight: "bold",
        fontSize: 40,
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ea1828',
        borderRadius: 5,
    },
    submitButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default AddFriendButton;

