import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { TextInput, Text, Card, IconButton, Provider, Avatar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import RootStackParamList from '../../RootStackParamList';
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import apiClient from "../../axiosConfig";
import BottomBar from "../components/BottomBar";
import theme from "../constants/theme";
import { useAuth0 } from "react-native-auth0";

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
    const { chatId, recipient } = route.params;
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [recipientSub, setRecipentSub] = useState<string>('');
    const [userProfilePicture, setUserProfilePicture] = useState<string>('');
    const [recipientProfilePicture, setRecipientProfilePicture] = useState<string>('');
    const navigation = useNavigation<ChatConversationScreenNavigationProp>();
    const { user } = useAuth0();

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const getRecipientSub = async () => {
            apiClient.get('/user/getUserSub', { params: { email: recipient } })
                .then((response) => {
                    setRecipentSub(response.data);
                    console.log('Recipient sub:', response.data);
                })
                .catch((error) => {
                    console.error('Error fetching recipient sub:', error);
                });
        };

        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/chat/private/${chatId}`);
                setMessages(response.data);
                setTimeout(() => {
                    if (flatListRef.current) {
                        flatListRef.current.scrollToEnd({ animated: true });
                    }
                }, 1000);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        const fetchUserProfilePicture = async () => {
            try {
                if (!user?.email) return;
                const response = await apiClient.get('/user/getProfilePicture', { params: { email: user.email } });
                console.log('User profile picture:', response.data);
                if (!response.data) {
                    setUserProfilePicture('https://cdn-icons-png.flaticon.com/128/848/848043.png');
                    return;
                }
                setUserProfilePicture(response.data);
            } catch (error) {
                console.error('Error fetching user profile picture:', error);
            }
        }

        const fetchRecipientProfilePicture = async () => {
            try {
                const response = await apiClient.get('/user/getProfilePicture', { params: { email: recipient } });
                console.log('Recipent profile picture:', response.data);
                if (!response.data) {
                    setRecipientProfilePicture('https://cdn-icons-png.flaticon.com/128/848/848043.png');
                    return;
                }
                setRecipientProfilePicture(response.data);
            } catch (error) {
                console.error('Error fetching recipient profile picture:', error);
            }
        }

        getRecipientSub();
        fetchMessages();
        fetchUserProfilePicture();
        fetchRecipientProfilePicture();

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
    }, [chatId, recipient]);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const sendPrivateMessage = () => {
        if (socket) {
            const newMessage: Message = { content: message, type: 'private', sender: user?.email || '' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('private_message', { content: message, to: recipientSub, chatId });
            setMessage('');
        } else {
            console.error('Socket is not connected');
        }
    };

    return (
        <Provider theme={theme}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => (
                        <Card style={styles.messageCard}>
                            <Card.Title
                                title={item.sender == recipientSub ? recipient : user?.email}
                                titleStyle={{ fontWeight: 'bold', fontSize: 12 }}
                                left={() =>
                                    <Avatar.Image
                                        size={40}
                                        source={{ uri: item.sender == recipientSub ? recipientProfilePicture : userProfilePicture }}
                                        style={{ backgroundColor: '#fff' }}
                                    />}
                            />
                            <Card.Content>
                                <Text>{item.content}</Text>
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.messageList}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Message"
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        underlineColor="transparent"
                        mode="outlined"
                        outlineColor="#e5e5e5"
                        activeOutlineColor="#4c956c"
                    />
                    <IconButton
                        icon="send"
                        size={24}
                        onPress={sendPrivateMessage}
                    />
                </View>
                <BottomBar navigation={navigation} />
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: '20%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 90,
        paddingTop: 10,
    },
    input: {
        width: '80%',
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#fff',
    },
    messageList: {
        padding: 10,
        paddingBottom: 120,
    },
    messageCard: {
        marginBottom: 10,
    },
});

export default ChatConversationScreen;
