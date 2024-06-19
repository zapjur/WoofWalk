import React, { useEffect, useState } from "react";
import {
    FlatList, Platform,
    StyleSheet,
    View,
} from "react-native";
import { Button, TextInput, Text, Appbar, Card } from 'react-native-paper';
import { StackNavigationProp } from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import io from "socket.io-client";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from "expo-secure-store";

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>

interface ChatScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp & ChatScreenNavigationProp;
}

interface Message {
    content: string;
    type: 'private';
    sender: string;
}

const baseURL = Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',
});

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [recipient, setRecipient] = useState<string>('');
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const initializeSocket = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            console.log('Token:', token);
            console.log('Base URL:', baseURL);
            if (token) {
                const socketInstance = io(baseURL!, {
                    auth: {
                        token: `Bearer ${token}` // Corrected token format
                    }
                });

                socketInstance.on('connect', () => {
                    console.log('connected to server');
                });

                socketInstance.on('private_message', (msg: Message) => {
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
            socket.emit('private_message', { content: message, to: recipient });
            setMessage('');
        } else {
            console.error('Socket is not connected');
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Appbar.Header>
                    <Appbar.Content title="Private Chat" />
                </Appbar.Header>
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Recipient ID"
                        value={recipient}
                        onChangeText={setRecipient}
                        style={styles.input}
                    />
                    <TextInput
                        label="Message"
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={sendPrivateMessage} style={styles.button}>
                        Send Private
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

export default ChatScreen;
