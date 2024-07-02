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
import {useAuth0} from "react-native-auth0";

type GroupChatConversationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GroupChatConversation'>;
type GroupChatConversationScreenRouteProp = RouteProp<RootStackParamList, 'GroupChatConversation'>;

interface Message {
    content: string;
    type: 'group';
    sender: string;
}

const baseURL = Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',
});

const GroupChatConversationScreen: React.FC = () => {
    const route = useRoute<GroupChatConversationScreenRouteProp>();
    const { groupChatId, members } = route.params;
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const navigation = useNavigation<GroupChatConversationScreenNavigationProp>();
    const { user } = useAuth0();
    const [userProfilePicture, setUserProfilePicture] = useState<string>('');
    const [userSubs, setUserSubs] = useState<Map<string, string>>(new Map());
    const [userProfilePictures, setUserProfilePictures] = useState<Map<string, string>>(new Map());

    const socketRef = useRef<any>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/chat/group/${groupChatId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        const fetchUserSubs = async () => {
            try {
                const response = await apiClient.get(`/chat/group/userSubs/${groupChatId}`);
                const subsMap = new Map<string, string>(
                    Object.entries(response.data).map(([key, value]) => [key, String(value)])
                );
                setUserSubs(subsMap);
                console.log('User subs:', subsMap);
            } catch (error) {
                console.error('Error fetching user subs:', error);
            }
        };

        const fetchUserProfilePictures = async () => {
            try {
                const response = await apiClient.get(`/chat/group/profilePictures/${groupChatId}`);
                const picturesMap = new Map<string, string>(
                    Object.entries(response.data).map(([key, value]) => [key, String(value)])
                );
                setUserProfilePictures(picturesMap);
                console.log('User pictures:', picturesMap);
            } catch (error) {
                console.error('Error fetching user subs:', error);
            }
        };

        fetchUserSubs();
        fetchUserProfilePictures()
        fetchMessages();

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
                    socketInstance.emit('join_group', groupChatId);
                });

                socketInstance.on('group_message', (msg: Message) => {
                    console.log('Group message received:', msg);
                    setMessages((prevMessages) => [...prevMessages, { ...msg, type: 'group' }]);
                });

                socketRef.current = socketInstance;
                setSocket(socketInstance);
            } else {
                console.error('No token found');
            }
        };

        initializeSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [groupChatId]);

    const sendGroupMessage = () => {
        if (socketRef.current) {
            socketRef.current.emit('group_message', { content: message, groupId: groupChatId });
            setMessage('');
        } else {
            console.error('Socket is not connected');
        }
    };

    return (
        <Provider theme={theme}>
            <View style={styles.container}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <Card style={styles.messageCard}>
                            <Card.Title
                                title={userSubs?.get(item.sender) || item.sender}
                                titleStyle={{ fontWeight: 'bold', fontSize: 12 }}
                                left={() =>
                                    <Avatar.Image
                                        size={40}
                                        source={{ uri: userProfilePictures?.get(item.sender) || 'https://cdn-icons-png.flaticon.com/128/848/848043.png' }}
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
                        onPress={sendGroupMessage}
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

export default GroupChatConversationScreen;
