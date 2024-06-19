import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, Appbar, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import RootStackParamList from '../../RootStackParamList';
import io from 'socket.io-client';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import apiClient from "../../axiosConfig";

type ChatConversationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatConversation'>;
type ChatConversationScreenRouteProp = RouteProp<RootStackParamList, 'ChatConversation'>;

interface Message {
    content: string;
    type: 'private';
    sender: string;
}

const baseURL = Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',
});

const ChatConversationScreen: React.FC = () => {
    const route = useRoute<ChatConversationScreenRouteProp>();
    const { recipient } = route.params;
    const [recipientSub, setRecipentSub] = useState<string>('' as string);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {

        const getRecipientSub = async () => {
            apiClient.get('/user/getUserSub', {params: {email: recipient}})
                .then((response) => {
                    setRecipentSub(response.data);
                    console.log('Recipient sub:', response.data);
                })
                .catch((error) => {
                    console.error('Error fetching recipient sub:', error);
                });
        };

        getRecipientSub();
        const initializeSocket = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                const socketInstance = io(baseURL!, {
                    auth: {
                        token: `Bearer ${token}`
                    }
                });

                socketInstance.on('connect', () => {
                    console.log('connected to server');
                });

                socketInstance.on('private_message', (msg: Message) => {
                    console.log('Private message received:', msg);
                    setMessages((prevMessages) => [...prevMessages, { ...msg, type: 'private' }]);
                });

                setSocket(socketInstance);
            } else {
                console.error('No token found');
            }
        };

        initializeSocket();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const sendPrivateMessage = () => {
        if (socket) {
            const newMessage: Message = { content: message, type: 'private', sender: 'me' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('private_message', { content: message, to: recipientSub });
            setMessage('');
        } else {
            console.error('Socket is not connected');
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Appbar.Header>
                    <Appbar.Content title={`Chat with ${recipient}`} />
                </Appbar.Header>
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Message"
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={sendPrivateMessage} style={styles.button}>
                        Send
                    </Button>
                </View>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <Card style={styles.messageCard}>
                            <Card.Content>
                                <Text>{item.sender}: {item.content}</Text>
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.messageList}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginVertical: 5,
    },
    messageList: {
        padding: 10,
    },
    messageCard: {
        marginBottom: 10,
    },
});

export default ChatConversationScreen;
