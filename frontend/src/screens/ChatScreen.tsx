import {
    Button,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, {useEffect, useState} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import RootStackParamList from "../../RootStackParamList";
import * as SecureStore from "expo-secure-store";
import { Client } from '@stomp/stompjs';
import { TextDecoder, TextEncoder } from 'text-encoding';
import apiClient from "../../axiosConfig";
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;



type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>
type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>
interface ChatScreenProps {
    navigation: MapScreenNavigationProp & UserScreenNavigationProp & FriendsScreenNavigationProp & ChatScreenNavigationProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) =>{
    const [client, setClient] = useState<Client | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {

        const fetchMessages = async () => {
            try {
                const response = await apiClient.get('/messages');
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };

        fetchMessages();

        const connectWebSocket = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            const stompClient = new Client({
                brokerURL: `ws://localhost:8080/ws?token=${token}`,
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                debug: (str) => {
                    console.log(str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            stompClient.onConnect = () => {
                console.log('Connected');
                stompClient.subscribe('/user/queue/messages', (message) => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        JSON.parse(message.body)
                    ]);
                });
            };

            stompClient.onStompError = (frame) => {
                console.error(`Broker reported error: ${frame.headers['message']}`);
                console.error(`Additional details: ${frame.body}`);
            };

            stompClient.activate();
            setClient(stompClient);
        };

        connectWebSocket();
    }, []);

    const sendMessage = () => {
        if (client && client.connected) {
            client.publish({
                destination: '/app/private',
                body: JSON.stringify({ content: message, recipient: 'maciekjur123@gmail.com' })
            });
            setMessage('');
        }
    };

    return (
        <View>
            <Text>WebSocket Chat</Text>
            <FlatList
                data={messages}
                renderItem={({ item }) => <Text>{item.sender}: {item.content}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

interface Message {
    sender: string;
    content: string;
    recipient: string;
    timestamp: number;
}


export default ChatScreen;