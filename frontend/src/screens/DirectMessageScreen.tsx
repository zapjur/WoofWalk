import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import RootStackParamList  from '../../RootStackParamList';
import apiClient from "../../axiosConfig";


type DirectMessageScreenRouteProp = RouteProp<RootStackParamList, 'DM'>;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'friend';
}
const DirectMessageScreen: React.FC = () => {
    const route = useRoute<DirectMessageScreenRouteProp>();
    const { email } = route.params;
    const [image, setImage] = useState("none");
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hej, co tam?', sender: 'friend' },
        { id: '2', text: 'Cześć! Wszystko dobrze, a u Ciebie?', sender: 'user' },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            setMessages([...messages, { id: (messages.length + 1).toString(), text: inputText, sender: 'user' }]);
            setInputText('');
        }
    };

    const renderItem = ({ item }: { item: Message }) =>  (
        <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.friendMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );
    useEffect(() => {
        console.log(email);
        apiClient.get("/user/profilePicture/download",{
            params: {
                email: email,
            },
            responseType: 'blob'
        }).then(response => {
            const blob = response.data;
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImage(reader.result as string);

                }
            };
            reader.readAsDataURL(blob);
        })
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: image != "none" ? image : 'https://cdn-icons-png.flaticon.com/128/848/848043.png' }}
                    style={styles.profileImage}
                />
                <Text style={styles.headerText}>
                    {email}
                </Text>
            </View>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesListContent}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    messagesList: {
        flex: 1,
    },
    messagesListContent: {
        padding: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: '#007bff',
        alignSelf: 'flex-end',
        marginLeft: '20%',
    },
    friendMessage: {
        backgroundColor: '#90909a',
        alignSelf: 'flex-start',
        marginRight: '20%',
    },
    messageText: {
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#dcdcdc',
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 10,
        paddingVertical: 5,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#d0cece',
        height: 90,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        marginLeft: 10,
      fontWeight: "bold",
      fontSize: 20,
    },
    profileImage: {
        marginLeft: 10,
        width: 60,
        height: 60,
        borderRadius: 50,
        alignSelf: "center",
    },
})
export default DirectMessageScreen;
